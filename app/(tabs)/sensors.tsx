import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../../components/Header';
import { MOCK_SENSORS, CONNECTIVITY_STATUS, SensorData, ConnectivityRoute } from '../../services/mockData';
import {
  Activity,
  Navigation,
  Battery,
  Clock,
  AlertTriangle,
  CheckCircle,
  Wifi,
  Radio,
  SlidersHorizontal,
} from 'lucide-react-native';

export default function SensorsScreen() {
  const [activeSegment, setActiveSegment] = useState<'sensors' | 'highways'>('sensors');
  const [selectedSensorType, setSelectedSensorType] = useState<string>('all');

  const sensorTypes = [
    { key: 'all', label: 'All Probes' },
    { key: 'soil_moisture', label: 'Soil Moisture' },
    { key: 'inclinometer', label: 'Inclinometers' },
    { key: 'rain_gauge', label: 'Rain Gauges' },
    { key: 'water_level', label: 'Water Level' },
    { key: 'extensometer', label: 'Extensometers' },
  ];

  const filteredSensors =
    selectedSensorType === 'all'
      ? MOCK_SENSORS
      : MOCK_SENSORS.filter((s) => s.type === selectedSensorType);

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[styles.segmentBtn, activeSegment === 'sensors' && styles.segmentBtnActive]}
          onPress={() => setActiveSegment('sensors')}
        >
          <Activity size={14} color={activeSegment === 'sensors' ? '#ffffff' : '#94a3b8'} />
          <Text style={[styles.segmentText, activeSegment === 'sensors' && styles.segmentTextActive]}>
            IoT Slope Sensors ({MOCK_SENSORS.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeSegment === 'highways' && styles.segmentBtnActive]}
          onPress={() => setActiveSegment('highways')}
        >
          <Navigation size={14} color={activeSegment === 'highways' ? '#ffffff' : '#94a3b8'} />
          <Text style={[styles.segmentText, activeSegment === 'highways' && styles.segmentTextActive]}>
            National Highways ({CONNECTIVITY_STATUS.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeSegment === 'sensors' && (
          <View>
            {/* Filter chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
              {sensorTypes.map((t) => (
                <TouchableOpacity
                  key={t.key}
                  style={[styles.filterChip, selectedSensorType === t.key && styles.filterChipActive]}
                  onPress={() => setSelectedSensorType(t.key)}
                >
                  <Text style={[styles.filterChipText, selectedSensorType === t.key && styles.filterChipTextActive]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Sensors Grid */}
            <View style={styles.cardsList}>
              {filteredSensors.map((sensor) => {
                const isCritical = sensor.status === 'critical';
                const isWarning = sensor.status === 'warning';
                return (
                  <View key={sensor.id} style={styles.sensorCard}>
                    <View style={styles.cardHeader}>
                      <View style={styles.sensorIconRow}>
                        <View
                          style={[
                            styles.statusDot,
                            { backgroundColor: isCritical ? '#ef4444' : isWarning ? '#f97316' : '#10b981' },
                          ]}
                        />
                        <Text style={styles.sensorId}>{sensor.id}</Text>
                        <Text style={styles.sensorStateTag}>{sensor.state}</Text>
                      </View>

                      <View style={styles.batteryRow}>
                        <Battery size={12} color="#94a3b8" />
                        <Text style={styles.batteryText}>{sensor.battery}%</Text>
                      </View>
                    </View>

                    <Text style={styles.sensorName}>{sensor.name}</Text>

                    <View style={styles.telemetryBox}>
                      <View style={styles.telemetryValCol}>
                        <Text style={styles.telemetryLabel}>Live Reading</Text>
                        <Text
                          style={[
                            styles.telemetryValue,
                            { color: isCritical ? '#ef4444' : isWarning ? '#fbbf24' : '#38bdf8' },
                          ]}
                        >
                          {sensor.value} <Text style={styles.unitText}>{sensor.unit}</Text>
                        </Text>
                      </View>

                      <View style={styles.telemetryThreshCol}>
                        <Text style={styles.telemetryLabel}>Alert Threshold</Text>
                        <Text style={styles.threshValue}>
                          {sensor.threshold} {sensor.unit}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cardFooter}>
                      <View style={styles.footerLeft}>
                        <Clock size={11} color="#64748b" />
                        <Text style={styles.footerTime}>{sensor.lastUpdated}</Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: isCritical
                              ? 'rgba(239, 68, 68, 0.15)'
                              : isWarning
                              ? 'rgba(249, 115, 22, 0.15)'
                              : 'rgba(16, 185, 129, 0.15)',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            { color: isCritical ? '#f87171' : isWarning ? '#fbbf24' : '#34d399' },
                          ]}
                        >
                          {sensor.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {activeSegment === 'highways' && (
          <View style={styles.cardsList}>
            {CONNECTIVITY_STATUS.map((item) => (
              <View key={item.id} style={styles.highwayCard}>
                <View style={styles.highwayHeader}>
                  <View>
                    <Text style={styles.highwayRoute}>{item.route}</Text>
                    <Text style={styles.highwayName}>{item.name}</Text>
                    <Text style={styles.highwayState}>{item.state}</Text>
                  </View>

                  <View
                    style={[
                      styles.highwayBadge,
                      {
                        backgroundColor:
                          item.status === 'Blocked'
                            ? 'rgba(239, 68, 68, 0.18)'
                            : item.status === 'Vulnerable'
                            ? 'rgba(245, 158, 11, 0.18)'
                            : 'rgba(16, 185, 129, 0.18)',
                        borderColor:
                          item.status === 'Blocked'
                            ? '#ef4444'
                            : item.status === 'Vulnerable'
                            ? '#f59e0b'
                            : '#10b981',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.highwayBadgeText,
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
                      {item.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.reasonBox}>
                  <Text style={styles.reasonText}>
                    <Text style={{ fontWeight: '700', color: '#e2e8f0' }}>Situation: </Text>
                    {item.reason}
                  </Text>
                </View>

                {item.alternateRoute && (
                  <Text style={styles.altRouteText}>
                    <Text style={{ fontWeight: '700', color: '#38bdf8' }}>Detour: </Text>
                    {item.alternateRoute}
                  </Text>
                )}

                <View style={styles.highwayFooter}>
                  <Text style={styles.etaText}>
                    Clearance ETA: <Text style={{ color: '#f8fafc', fontWeight: '700' }}>{item.clearanceEta}</Text>
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    padding: 6,
    marginHorizontal: 14,
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    maxWidth: 900,
    alignSelf: 'center',
    width: '93%',
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  segmentBtnActive: {
    backgroundColor: '#0284c7',
  },
  segmentText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  segmentTextActive: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 40,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },
  chipsScroll: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  filterChip: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 6,
  },
  filterChipActive: {
    backgroundColor: '#0284c7',
  },
  filterChipText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '700',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  cardsList: {
    gap: 10,
  },
  sensorCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sensorIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  sensorId: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '800',
  },
  sensorStateTag: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '600',
  },
  batteryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  batteryText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
  },
  sensorName: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
  },
  telemetryBox: {
    flexDirection: 'row',
    backgroundColor: '#131d33',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  telemetryValCol: {
    flex: 1,
  },
  telemetryThreshCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  telemetryLabel: {
    color: '#64748b',
    fontSize: 8,
    fontWeight: '600',
  },
  telemetryValue: {
    fontSize: 14,
    fontWeight: '900',
    marginTop: 2,
  },
  unitText: {
    fontSize: 10,
    fontWeight: '600',
  },
  threshValue: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerTime: {
    color: '#64748b',
    fontSize: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  highwayCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  highwayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  highwayRoute: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '900',
  },
  highwayName: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  highwayState: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 1,
  },
  highwayBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  highwayBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  reasonBox: {
    backgroundColor: '#131d33',
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  reasonText: {
    color: '#cbd5e1',
    fontSize: 11,
    lineHeight: 15,
  },
  altRouteText: {
    color: '#94a3b8',
    fontSize: 10,
    marginBottom: 6,
  },
  highwayFooter: {
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 6,
  },
  etaText: {
    color: '#94a3b8',
    fontSize: 10,
  },
});
