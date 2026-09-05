import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Header } from '../../components/Header';
import { RiskGauge } from '../../components/RiskGauge';
import { InteractiveMap } from '../../components/InteractiveMap';
import { SOSBanner } from '../../components/SOSBanner';
import { fetchLiveTelemetry, fetchNasaEvents, TelemetryData, NasaEvent } from '../../services/api';
import { calculateRisk, RiskEvaluation } from '../../services/aiEngine';
import { CONNECTIVITY_STATUS } from '../../services/mockData';
import { MapPin, Navigation, ChevronLeft, ChevronRight, Crosshair, RefreshCw } from 'lucide-react-native';
import { useAppTheme } from '../../context/ThemeContext';
import { requestUserLocation, UserLocation } from '../../services/locationService';

export default function DashboardScreen() {
  const { colors, isDark } = useAppTheme();
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [nasaEvents, setNasaEvents] = useState<NasaEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [simulatedDanger, setSimulatedDanger] = useState<boolean>(false);
  const [sosStatus, setSosStatus] = useState<'none' | 'needs_help' | 'safe'>('none');
  const [userLocation, setUserLocation] = useState<UserLocation>({
    latitude: 25.5788,
    longitude: 91.8933,
    locationName: 'East Khasi Hills • Shillong Sector',
    isLiveGps: false,
  });
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const corridorScrollRef = useRef<ScrollView>(null);
  const [scrollOffset, setScrollOffset] = useState<number>(0);

  const scrollCorridors = (direction: 'left' | 'right') => {
    const step = 280;
    const delta = direction === 'left' ? -step : step;

    if (Platform.OS === 'web') {
      const el =
        document.getElementById('corridor-scroll-view') ||
        (corridorScrollRef.current as any)?.getScrollableNode?.() ||
        (corridorScrollRef.current as any)?._nativeNode;

      if (el) {
        if (typeof el.scrollBy === 'function') {
          el.scrollBy({ left: delta, behavior: 'smooth' });
        } else if (typeof el.scrollLeft === 'number') {
          el.scrollLeft += delta;
        }
        return;
      }
    }

    const newOffset = direction === 'left' ? Math.max(0, scrollOffset - step) : scrollOffset + step;
    setScrollOffset(newOffset);
    corridorScrollRef.current?.scrollTo({ x: newOffset, animated: true });
  };

  const loadData = async (lat = userLocation.latitude, lon = userLocation.longitude) => {
    try {
      const [tel, nasa] = await Promise.all([
        fetchLiveTelemetry(lat, lon),
        fetchNasaEvents(),
      ]);
      setTelemetry(tel);
      setNasaEvents(nasa);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const autoTrackLocation = async () => {
    setIsLocating(true);
    try {
      const loc = await requestUserLocation();
      setUserLocation(loc);
      await loadData(loc.latitude, loc.longitude);
    } catch (e) {
      console.warn('Location tracking error:', e);
      await loadData();
    } finally {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    // Automatically request location permission & acquire GPS position on load
    autoTrackLocation();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    autoTrackLocation();
  };

  const risk: RiskEvaluation = calculateRisk('NER Regional', telemetry, simulatedDanger);

  return (
    <View style={StyleSheet.flatten([styles.container, { backgroundColor: colors.bg }])}>
      <Header onRefresh={onRefresh} isLive={true} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.steelBlue} />
        }
      >
        {/* Quick Location & Status Pill - Live GPS Auto-Tracking */}
        <View style={[styles.locationBar, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.locationLeft}>
            <TouchableOpacity
              style={[
                styles.gpsIconBtn,
                {
                  backgroundColor: userLocation.isLiveGps ? colors.successBg : colors.subPanel,
                  borderColor: userLocation.isLiveGps ? colors.successBorder : colors.border,
                },
              ]}
              onPress={autoTrackLocation}
              disabled={isLocating}
              activeOpacity={0.7}
            >
              {isLocating ? (
                <ActivityIndicator size="small" color={colors.steelBlue} />
              ) : (
                <MapPin size={15} color={userLocation.isLiveGps ? colors.success : colors.steelBlue} />
              )}
            </TouchableOpacity>

            <View style={styles.locationInfoCol}>
              <View style={styles.locationTitleRow}>
                <Text style={[styles.locationText, { color: colors.textPrimary }]} numberOfLines={1}>
                  {userLocation.locationName}
                </Text>
                {userLocation.isLiveGps && (
                  <View style={[styles.liveGpsBadge, { backgroundColor: colors.successBg, borderColor: colors.successBorder }]}>
                    <View style={[styles.liveGpsDot, { backgroundColor: colors.success }]} />
                    <Text style={[styles.liveGpsText, { color: colors.success }]}>
                      Live GPS {userLocation.accuracy ? `(±${userLocation.accuracy}m)` : ''}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[styles.locationCoordsText, { color: colors.textMuted }]}>
                {userLocation.latitude.toFixed(4)}°N, {userLocation.longitude.toFixed(4)}°E
              </Text>
            </View>
          </View>

          <View style={styles.telemetryQuickRow}>
            <Text style={[styles.telemetryQuickText, { color: colors.textSecondary }]}>
              {telemetry?.temperature ?? 22}°C • {telemetry?.humidity ?? 88}% RH
            </Text>
          </View>
        </View>

        {/* SOS Emergency Banner */}
        <SOSBanner
          sosStatus={sosStatus}
          onTriggerSOS={() => setSosStatus('needs_help')}
          onMarkSafe={() => setSosStatus(sosStatus === 'safe' ? 'none' : 'safe')}
          onSimulateDanger={() => setSimulatedDanger(!simulatedDanger)}
          isSimulatedDanger={simulatedDanger}
        />

        {/* AI Susceptibility Gauge */}
        <RiskGauge risk={risk} telemetry={telemetry} loading={loading} />

        {/* Critical Corridors Ticker - Enlarged */}
        <View style={styles.corridorContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Navigation size={16} color={colors.steelBlue} />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>High-Risk Highway Corridors</Text>
            </View>
            <View style={styles.scrollNavControls}>
              <TouchableOpacity
                style={[styles.scrollNavBtn, { backgroundColor: colors.subPanel, borderColor: colors.border }]}
                onPress={() => scrollCorridors('left')}
                activeOpacity={0.6}
                accessibilityLabel="Scroll highways left"
              >
                <ChevronLeft size={18} color={colors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.scrollNavBtn, { backgroundColor: colors.subPanel, borderColor: colors.border }]}
                onPress={() => scrollCorridors('right')}
                activeOpacity={0.6}
                accessibilityLabel="Scroll highways right"
              >
                <ChevronRight size={18} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView
            ref={corridorScrollRef}
            nativeID="corridor-scroll-view"
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.corridorScroll}
            contentContainerStyle={styles.corridorScrollContent}
          >
            {CONNECTIVITY_STATUS.map((item) => (
              <View key={item.id} style={[styles.corridorCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                <View style={styles.corridorCardTop}>
                  <Text style={[styles.corridorRoute, { color: colors.textPrimary }]}>{item.route}</Text>
                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor:
                          item.status === 'Blocked'
                            ? colors.dangerBg
                            : item.status === 'Vulnerable'
                            ? colors.warningBg
                            : colors.successBg,
                        borderColor:
                          item.status === 'Blocked'
                            ? colors.dangerBorder
                            : item.status === 'Vulnerable'
                            ? colors.warningBorder
                            : colors.successBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        {
                          color:
                            item.status === 'Blocked'
                              ? colors.danger
                              : item.status === 'Vulnerable'
                              ? colors.warning
                              : colors.success,
                        },
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.corridorName, { color: colors.textSecondary }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[styles.corridorReason, { color: colors.textPrimary }]} numberOfLines={2}>
                  {item.reason}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Interactive Spatial GIS Radar */}
        <InteractiveMap nasaEvents={nasaEvents} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 50,
    maxWidth: 960,
    alignSelf: 'center',
    width: '100%',
  },
  locationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    gap: 8,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 200,
  },
  gpsIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfoCol: {
    flex: 1,
    gap: 2,
  },
  locationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  locationText: {
    fontSize: 13,
    fontWeight: '800',
  },
  locationCoordsText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  liveGpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  liveGpsDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  liveGpsText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  telemetryQuickRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  telemetryQuickText: {
    fontSize: 12,
    fontWeight: '700',
  },
  corridorContainer: {
    marginVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  scrollNavControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scrollNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer' as any,
  },
  corridorScroll: {
    flexDirection: 'row',
  },
  corridorScrollContent: {
    paddingRight: 8,
  },
  corridorCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    width: 250,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  corridorCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  corridorRoute: {
    fontSize: 14,
    fontWeight: '900',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  corridorName: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  corridorReason: {
    fontSize: 11,
    lineHeight: 16,
  },
});
