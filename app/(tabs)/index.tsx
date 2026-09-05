<<<<<<< HEAD
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { RiskMetrics } from '../../components/Dashboard/RiskMetrics';
import { GISMap } from '../../components/Map/GISMap';
import { Header } from '../../legacy-web/src/components/Header'; // We need to port this or skip it

export default function DashboardScreen() {
  const [sosStatus, setSosStatus] = useState('none');

  const handleSOS = () => {
    setSosStatus('needs_help');
    console.log("SOS Broadcast: User needs immediate assistance at Lat: 25.5788, Lon: 91.8933");
  };

  const handleSafe = () => {
    setSosStatus('safe');
    console.log("Status Broadcast: User marked as SAFE.");
  };

  return (
    <View className="flex-1 bg-background pt-12">
      {sosStatus === 'triggered' && (
        <View className="absolute z-50 top-0 bottom-0 left-0 right-0 bg-black/80 items-center justify-center p-6">
          <View className="bg-surface/90 border border-danger/50 p-6 rounded-2xl w-full items-center shadow-2xl">
            <View className="w-16 h-16 bg-danger/20 rounded-full items-center justify-center mb-4">
              <ShieldAlert color="#ef4444" size={32} />
            </View>
            <Text className="text-xl font-bold text-white mb-2">Emergency Alert!</Text>
            <Text className="text-sm text-gray-300 mb-6 text-center">A landslide has been reported in your immediate vicinity (East Khasi Hills). Are you safe?</Text>
            
            <View className="w-full gap-3">
              <TouchableOpacity 
                onPress={handleSOS}
                className="w-full bg-danger py-4 rounded-xl items-center flex-row justify-center gap-2"
              >
                <ShieldAlert color="#ffffff" size={24} />
                <Text className="text-white font-bold text-lg">SOS / NEED HELP</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleSafe}
                className="w-full bg-surface border border-white/10 py-3 rounded-xl items-center flex-row justify-center gap-2"
              >
                <CheckCircle2 color="#10b981" size={20} />
                <Text className="text-gray-200 font-medium">I am safe for now</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-[10px] text-gray-500 mt-4 text-center">Your status will be broadcast to disaster management officials and emergency contacts via SMS.</Text>
          </View>
        </View>
      )}

      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header equivalent */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-2xl font-bold text-white">Raksha App</Text>
            <Text className="text-xs text-gray-400">Landslide Monitoring System</Text>
          </View>
        </View>

        {sosStatus === 'needs_help' ? (
          <View className="bg-danger/20 border-2 border-danger rounded-xl p-3 mb-5 flex-row gap-3 items-start">
            <View className="bg-danger p-2 rounded-lg">
              <ShieldAlert color="#ffffff" size={20} />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-danger text-sm">SOS Broadcast Active</Text>
              <Text className="text-xs text-red-200/80 mt-0.5">Emergency teams have been dispatched to your location.</Text>
            </View>
          </View>
        ) : sosStatus === 'safe' ? (
          <View className="bg-success/10 border border-success/30 rounded-xl p-3 mb-5 flex-row gap-3 items-start">
            <View className="bg-success/20 p-2 rounded-lg">
              <CheckCircle2 color="#10b981" size={20} />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-success text-sm">Status: Safe</Text>
              <Text className="text-xs text-green-200/80 mt-0.5">Your safe status has been logged. Stay alert.</Text>
            </View>
          </View>
        ) : (
          <View className="bg-warning/10 border border-warning/30 rounded-xl p-3 mb-5">
            <View className="flex-row gap-3 items-start mb-2">
              <View className="bg-warning/20 p-2 rounded-lg">
                <AlertCircle color="#f59e0b" size={20} />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-warning text-sm">High Risk Area</Text>
                <Text className="text-xs text-yellow-200/80 mt-0.5">You are currently in a high risk zone.</Text>
              </View>
            </View>
            <TouchableOpacity 
              onPress={() => setSosStatus('triggered')}
              className="w-full bg-warning/80 py-2 rounded-lg items-center mt-1"
            >
              <Text className="text-gray-900 text-xs font-bold">Simulate Local Danger (Demo)</Text>
            </TouchableOpacity>
          </View>
        )}

        <RiskMetrics />

        <View className="mb-4 mt-2 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-white tracking-tight">Map</Text>
          <TouchableOpacity className="px-3 py-1.5 bg-primary rounded-lg shadow-lg shadow-primary/20">
            <Text className="text-white text-xs font-medium">Sync</Text>
          </TouchableOpacity>
        </View>

        <View className="h-[300px] w-full rounded-2xl overflow-hidden shadow-lg border border-white/5">
          <GISMap />
        </View>
=======
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Header } from '../../components/Header';
import { RiskGauge } from '../../components/RiskGauge';
import { InteractiveMap } from '../../components/InteractiveMap';
import { SOSBanner } from '../../components/SOSBanner';
import { fetchLiveTelemetry, fetchNasaEvents, TelemetryData, NasaEvent } from '../../services/api';
import { calculateRisk, RiskEvaluation } from '../../services/aiEngine';
import { CONNECTIVITY_STATUS } from '../../services/mockData';
import { MapPin, Navigation, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useAppTheme } from '../../context/ThemeContext';

export default function DashboardScreen() {
  const { colors, isDark } = useAppTheme();
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [nasaEvents, setNasaEvents] = useState<NasaEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [simulatedDanger, setSimulatedDanger] = useState<boolean>(false);
  const [sosStatus, setSosStatus] = useState<'none' | 'needs_help' | 'safe'>('none');
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

  const loadData = async () => {
    try {
      const [tel, nasa] = await Promise.all([
        fetchLiveTelemetry(25.5788, 91.8933),
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

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
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
        {/* Quick Location & Status Pill - Enlarged */}
        <View style={[styles.locationBar, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.locationLeft}>
            <MapPin size={16} color={colors.steelBlue} />
            <Text style={[styles.locationText, { color: colors.textPrimary }]}>East Khasi Hills • Shillong Sector</Text>
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
>>>>>>> b975479ddc28a837af2451e176af696b66432c34
      </ScrollView>
    </View>
  );
}
<<<<<<< HEAD
=======

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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '800',
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
>>>>>>> b975479ddc28a837af2451e176af696b66432c34
