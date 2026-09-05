import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { MOCK_SENSORS, MOCK_RISK_ZONES, HISTORICAL_LANDSLIDES, SensorData, RiskZone, LandslideIncident } from '../services/mockData';
import { NasaEvent } from '../services/api';
import { MapPin, Radio, AlertTriangle, Activity, Satellite, Layers, Info, X } from 'lucide-react-native';

interface InteractiveMapProps {
  nasaEvents?: NasaEvent[];
  onSelectLocation?: (lat: number, lon: number, name: string) => void;
}

type FilterType = 'all' | 'sensors' | 'zones' | 'history' | 'nasa';

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  nasaEvents = [],
  onSelectLocation,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedItem, setSelectedItem] = useState<{
    type: 'sensor' | 'zone' | 'history' | 'nasa';
    data: any;
  } | null>(null);

  // Region bounds: North East India (lat ~23.5 - 28.0, lon ~88.0 - 95.5)
  // Mapping formula to relative 0% - 100% position on canvas
  const minLat = 23.2, maxLat = 28.2;
  const minLon = 88.0, maxLon = 95.5;

  const getCanvasCoords = (lat: number, lon: number) => {
    // Invert lat for top (0%) to bottom (100%)
    const top = Math.max(8, Math.min(88, ((maxLat - lat) / (maxLat - minLat)) * 100));
    const left = Math.max(8, Math.min(92, ((lon - minLon) / (maxLon - minLon)) * 100));
    return { top: `${top}%` as const, left: `${left}%` as const };
  };

  return (
    <View style={styles.container}>
      {/* Header & Filter Bar */}
      <View style={styles.mapHeader}>
        <View style={styles.titleRow}>
          <Layers size={16} color="#38bdf8" />
          <Text style={styles.mapTitle}>NER Spatial GIS Radar</Text>
          <Text style={styles.subtext}>(Live Multi-Layer)</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <TouchableOpacity
            style={[styles.filterChip, activeFilter === 'all' && styles.filterChipActive]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[styles.filterChipText, activeFilter === 'all' && styles.filterChipTextActive]}>
              All Layers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, activeFilter === 'sensors' && styles.filterChipActive]}
            onPress={() => setActiveFilter('sensors')}
          >
            <Activity size={11} color={activeFilter === 'sensors' ? '#ffffff' : '#38bdf8'} />
            <Text style={[styles.filterChipText, activeFilter === 'sensors' && styles.filterChipTextActive]}>
              IoT Sensors ({MOCK_SENSORS.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, activeFilter === 'zones' && styles.filterChipActive]}
            onPress={() => setActiveFilter('zones')}
          >
            <AlertTriangle size={11} color={activeFilter === 'zones' ? '#ffffff' : '#f97316'} />
            <Text style={[styles.filterChipText, activeFilter === 'zones' && styles.filterChipTextActive]}>
              High-Risk Zones
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, activeFilter === 'nasa' && styles.filterChipActive]}
            onPress={() => setActiveFilter('nasa')}
          >
            <Satellite size={11} color={activeFilter === 'nasa' ? '#ffffff' : '#eab308'} />
            <Text style={[styles.filterChipText, activeFilter === 'nasa' && styles.filterChipTextActive]}>
              NASA Alerts
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, activeFilter === 'history' && styles.filterChipActive]}
            onPress={() => setActiveFilter('history')}
          >
            <MapPin size={11} color={activeFilter === 'history' ? '#ffffff' : '#ef4444'} />
            <Text style={[styles.filterChipText, activeFilter === 'history' && styles.filterChipTextActive]}>
              Past Slides
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Map Surface View */}
      <View style={styles.mapCanvas}>
        {/* Topographic Background Grids & Regional Label */}
        <View style={styles.gridOverlay}>
          <View style={styles.gridLineHorizontal} />
          <View style={[styles.gridLineHorizontal, { top: '50%' }]} />
          <View style={styles.gridLineVertical} />
          <View style={[styles.gridLineVertical, { left: '50%' }]} />
        </View>

        {/* Topographic region labels */}
        <Text style={[styles.regionTag, { top: '15%', left: '12%' }]}>Sikkim Himalaya</Text>
        <Text style={[styles.regionTag, { top: '12%', left: '60%' }]}>Arunachal Range</Text>
        <Text style={[styles.regionTag, { top: '48%', left: '42%' }]}>Brahmaputra Valley</Text>
        <Text style={[styles.regionTag, { top: '65%', left: '35%' }]}>Meghalaya Plateau</Text>
        <Text style={[styles.regionTag, { top: '80%', left: '70%' }]}>Mizo Hills</Text>

        {/* Risk Zones Circles */}
        {(activeFilter === 'all' || activeFilter === 'zones') &&
          MOCK_RISK_ZONES.map((zone) => {
            const coords = getCanvasCoords(zone.center[0], zone.center[1]);
            const isCritical = zone.riskLevel === 'critical';
            return (
              <TouchableOpacity
                key={zone.id}
                style={[
                  styles.zoneCircle,
                  coords,
                  {
                    borderColor: isCritical ? '#ef4444' : '#f97316',
                    backgroundColor: isCritical ? 'rgba(239, 68, 68, 0.18)' : 'rgba(249, 115, 22, 0.15)',
                  },
                ]}
                onPress={() => setSelectedItem({ type: 'zone', data: zone })}
                activeOpacity={0.7}
              >
                <View style={[styles.zoneCoreDot, { backgroundColor: isCritical ? '#ef4444' : '#f97316' }]} />
              </TouchableOpacity>
            );
          })}

        {/* IoT Sensors */}
        {(activeFilter === 'all' || activeFilter === 'sensors') &&
          MOCK_SENSORS.map((sensor) => {
            const coords = getCanvasCoords(sensor.location[0], sensor.location[1]);
            const isAlert = sensor.status === 'critical';
            return (
              <TouchableOpacity
                key={sensor.id}
                style={[styles.markerButton, coords]}
                onPress={() => setSelectedItem({ type: 'sensor', data: sensor })}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.sensorMarker,
                    {
                      backgroundColor: isAlert ? '#ef4444' : '#0284c7',
                      borderColor: isAlert ? '#fca5a5' : '#7dd3fc',
                    },
                  ]}
                >
                  <Activity size={10} color="#ffffff" />
                </View>
                <Text style={styles.markerLabel}>{sensor.name.split(' ')[0]}</Text>
              </TouchableOpacity>
            );
          })}

        {/* NASA EONET Alerts */}
        {(activeFilter === 'all' || activeFilter === 'nasa') &&
          nasaEvents.map((event) => {
            const coords = getCanvasCoords(event.coordinates[0], event.coordinates[1]);
            return (
              <TouchableOpacity
                key={event.id}
                style={[styles.markerButton, coords]}
                onPress={() => setSelectedItem({ type: 'nasa', data: event })}
                activeOpacity={0.8}
              >
                <View style={styles.nasaMarker}>
                  <Satellite size={11} color="#ffffff" />
                </View>
                <Text style={[styles.markerLabel, { color: '#fde047' }]}>NASA</Text>
              </TouchableOpacity>
            );
          })}

        {/* Historical Landslides */}
        {(activeFilter === 'all' || activeFilter === 'history') &&
          HISTORICAL_LANDSLIDES.map((ls) => {
            const coords = getCanvasCoords(ls.location[0], ls.location[1]);
            return (
              <TouchableOpacity
                key={ls.id}
                style={[styles.markerButton, coords]}
                onPress={() => setSelectedItem({ type: 'history', data: ls })}
                activeOpacity={0.8}
              >
                <View style={styles.historyMarker}>
                  <AlertTriangle size={10} color="#ffffff" />
                </View>
                <Text style={[styles.markerLabel, { color: '#f87171' }]}>Slide</Text>
              </TouchableOpacity>
            );
          })}
      </View>

      {/* Selected Item Detail Card */}
      {selectedItem && (
        <View style={styles.detailCard}>
          <View style={styles.detailCardHeader}>
            <View style={styles.detailBadge}>
              <Text style={styles.detailBadgeText}>{selectedItem.type.toUpperCase()}</Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedItem(null)} style={styles.closeBtn}>
              <X size={16} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {selectedItem.type === 'sensor' && (
            <View>
              <Text style={styles.detailTitle}>{selectedItem.data.name}</Text>
              <Text style={styles.detailSubtitle}>
                State: {selectedItem.data.state} | Probe: {selectedItem.data.type}
              </Text>
              <View style={styles.detailStatsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Current Telemetry</Text>
                  <Text style={[styles.statVal, { color: selectedItem.data.status === 'critical' ? '#ef4444' : '#38bdf8' }]}>
                    {selectedItem.data.value} {selectedItem.data.unit}
                  </Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Threshold</Text>
                  <Text style={styles.statVal}>{selectedItem.data.threshold} {selectedItem.data.unit}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Battery</Text>
                  <Text style={styles.statVal}>{selectedItem.data.battery}%</Text>
                </View>
              </View>
            </View>
          )}

          {selectedItem.type === 'zone' && (
            <View>
              <Text style={styles.detailTitle}>{selectedItem.data.name}</Text>
              <Text style={styles.detailSubtitle}>State: {selectedItem.data.state}</Text>
              <View style={styles.detailStatsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Risk Classification</Text>
                  <Text style={[styles.statVal, { color: '#ef4444' }]}>{selectedItem.data.riskLevel.toUpperCase()}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Slope Angle</Text>
                  <Text style={styles.statVal}>{selectedItem.data.slopeAngle}°</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Population</Text>
                  <Text style={styles.statVal}>{(selectedItem.data.populationAffected / 1000).toFixed(0)}k</Text>
                </View>
              </View>
            </View>
          )}

          {selectedItem.type === 'nasa' && (
            <View>
              <Text style={styles.detailTitle}>{selectedItem.data.title}</Text>
              <Text style={styles.detailSubtitle}>Category: {selectedItem.data.category}</Text>
              <Text style={styles.detailDesc}>
                Satellite monitoring detected anomalous precipitation cluster and slope destabilization potential.
              </Text>
            </View>
          )}

          {selectedItem.type === 'history' && (
            <View>
              <Text style={styles.detailTitle}>{selectedItem.data.title}</Text>
              <Text style={styles.detailSubtitle}>Date: {selectedItem.data.date} ({selectedItem.data.state})</Text>
              <Text style={styles.detailDesc}>Impact: {selectedItem.data.impact}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    overflow: 'hidden',
    marginVertical: 10,
  },
  mapHeader: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  mapTitle: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtext: {
    color: '#64748b',
    fontSize: 10,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 6,
    gap: 5,
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
  mapCanvas: {
    height: 260,
    backgroundColor: '#080d1a',
    position: 'relative',
    overflow: 'hidden',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFill,
    opacity: 0.15,
  },
  gridLineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '25%',
    height: 1,
    backgroundColor: '#38bdf8',
  },
  gridLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '25%',
    width: 1,
    backgroundColor: '#38bdf8',
  },
  regionTag: {
    position: 'absolute',
    color: '#334155',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  zoneCircle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -30 }, { translateY: -30 }],
  },
  zoneCoreDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  markerButton: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  sensorMarker: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  nasaMarker: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#d97706',
    borderWidth: 2,
    borderColor: '#fde047',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#b91c1c',
    borderWidth: 1.5,
    borderColor: '#fca5a5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerLabel: {
    color: '#cbd5e1',
    fontSize: 8,
    fontWeight: '700',
    marginTop: 2,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 3,
    borderRadius: 3,
  },
  detailCard: {
    backgroundColor: '#131d33',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  detailCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailBadge: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  detailBadgeText: {
    color: '#38bdf8',
    fontSize: 9,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 2,
  },
  detailTitle: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
  },
  detailSubtitle: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
    marginBottom: 8,
  },
  detailDesc: {
    color: '#cbd5e1',
    fontSize: 11,
    lineHeight: 16,
  },
  detailStatsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#0b1222',
    padding: 6,
    borderRadius: 6,
  },
  statLabel: {
    color: '#64748b',
    fontSize: 8,
    fontWeight: '600',
  },
  statVal: {
    color: '#f1f5f9',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
});
