import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Header } from '../../components/Header';
import { RiskGauge } from '../../components/RiskGauge';
import { InteractiveMap } from '../../components/InteractiveMap';
import { SOSBanner } from '../../components/SOSBanner';
import { fetchLiveTelemetry, fetchNasaEvents, TelemetryData, NasaEvent } from '../../services/api';
import { calculateRisk, RiskEvaluation } from '../../services/aiEngine';
import { CONNECTIVITY_STATUS } from '../../services/mockData';
import { MapPin, Navigation, RefreshCw, AlertTriangle, ShieldCheck, Thermometer, Wind } from 'lucide-react-native';

export default function DashboardScreen() {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [nasaEvents, setNasaEvents] = useState<NasaEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [simulatedDanger, setSimulatedDanger] = useState<boolean>(false);
  const [sosStatus, setSosStatus] = useState<'none' | 'needs_help' | 'safe'>('none');

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
    <View style={styles.container}>
      <Header onRefresh={onRefresh} isLive={true} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38bdf8" />
        }
      >
        {/* Quick Location & Status Pill */}
        <View style={styles.locationBar}>
          <View style={styles.locationLeft}>
            <MapPin size={14} color="#38bdf8" />
            <Text style={styles.locationText}>East Khasi Hills • Shillong NER</Text>
          </View>
          <View style={styles.telemetryQuickRow}>
            <Text style={styles.telemetryQuickText}>
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

        {/* Critical Corridors Ticker */}
        <View style={styles.corridorContainer}>
          <View style={styles.sectionHeader}>
            <Navigation size={14} color="#f59e0b" />
            <Text style={styles.sectionTitle}>High-Risk Corridors</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.corridorScroll}>
            {CONNECTIVITY_STATUS.map((item) => (
              <View key={item.id} style={styles.corridorCard}>
                <View style={styles.corridorCardTop}>
                  <Text style={styles.corridorRoute}>{item.route}</Text>
                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor:
                          item.status === 'Blocked'
                            ? 'rgba(239, 68, 68, 0.2)'
                            : item.status === 'Vulnerable'
                            ? 'rgba(245, 158, 11, 0.2)'
                            : 'rgba(16, 185, 129, 0.2)',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        {
                          color:
                            item.status === 'Blocked'
                              ? '#f87171'
                              : item.status === 'Vulnerable'
                              ? '#fbbf24'
                              : '#34d399',
                        },
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.corridorName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.corridorReason} numberOfLines={2}>
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
    backgroundColor: '#090d16',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 40,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },
  locationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: 8,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    color: '#e2e8f0',
    fontSize: 11,
    fontWeight: '700',
  },
  telemetryQuickRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  telemetryQuickText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  corridorContainer: {
    marginVertical: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  corridorScroll: {
    flexDirection: 'row',
  },
  corridorCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
    width: 220,
    marginRight: 10,
  },
  corridorCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  corridorRoute: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '800',
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '800',
  },
  corridorName: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  corridorReason: {
    color: '#cbd5e1',
    fontSize: 10,
    lineHeight: 14,
  },
});
