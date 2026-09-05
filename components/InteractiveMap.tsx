import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { MOCK_SENSORS, MOCK_RISK_ZONES, HISTORICAL_LANDSLIDES } from '../services/mockData';
import { NasaEvent } from '../services/api';
import { MapPin, AlertTriangle, Activity, Satellite, Layers, ZoomIn, ZoomOut, Compass } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';

interface InteractiveMapProps {
  nasaEvents?: NasaEvent[];
  onSelectLocation?: (lat: number, lon: number, name: string) => void;
}

type FilterType = 'all' | 'sensors' | 'zones' | 'history' | 'nasa';
type BasemapType = 'topo' | 'satellite' | 'street' | 'slate';

const BASEMAP_URLS = {
  topo: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  street: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  slate: 'https://cartodb-basemaps-a.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}{r}.png',
};

const REGIONS = [
  { name: 'NER Overview', center: [26.1445, 91.7362] as [number, number], zoom: 7 },
  { name: 'Shillong (Meghalaya)', center: [25.5788, 91.8933] as [number, number], zoom: 11 },
  { name: 'Gangtok (Sikkim)', center: [27.3314, 88.6138] as [number, number], zoom: 11 },
  { name: 'Tawang (Arunachal)', center: [27.5860, 91.8594] as [number, number], zoom: 10 },
  { name: 'Dima Hasao (Assam)', center: [25.1764, 93.0232] as [number, number], zoom: 10 },
];

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  nasaEvents = [],
  onSelectLocation,
}) => {
  const { colors, isDark } = useAppTheme();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [basemap, setBasemap] = useState<BasemapType>('topo');
  const [isLeafletReady, setIsLeafletReady] = useState(false);
  const mapContainerId = useRef(`leaflet-map-${Math.random().toString(36).substring(2, 9)}`).current;
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);

  // Load Leaflet CSS & Script dynamically if on web
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    // 1. Inject Leaflet CSS
    if (!document.getElementById('leaflet-css-cdn')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css-cdn';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // 2. Inject Leaflet JS
    const loadLeaflet = () => {
      const win = window as any;
      if (win.L) {
        setIsLeafletReady(true);
        return;
      }

      const existingScript = document.getElementById('leaflet-js-cdn');
      if (existingScript) {
        existingScript.addEventListener('load', () => setIsLeafletReady(true));
        return;
      }

      const script = document.createElement('script');
      script.id = 'leaflet-js-cdn';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => {
        setIsLeafletReady(true);
      };
      document.head.appendChild(script);
    };

    loadLeaflet();
  }, []);

  // Initialize Map
  useEffect(() => {
    if (Platform.OS !== 'web' || !isLeafletReady) return;

    const win = window as any;
    const L = win.L;
    if (!L) return;

    const container = document.getElementById(mapContainerId);
    if (!container) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerId, {
      center: [26.1445, 91.7362],
      zoom: 7,
      zoomControl: false,
      attributionControl: false,
    });

    const tileUrl = BASEMAP_URLS[basemap];
    tileLayerRef.current = L.tileLayer(tileUrl, {
      maxZoom: 18,
      subdomains: ['a', 'b', 'c'],
    }).addTo(map);

    layerGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    renderMapFeatures(map, layerGroupRef.current, activeFilter);

    // Re-invalidate size multiple times to ensure full container measurement
    setTimeout(() => {
      map.invalidateSize();
    }, 150);
    setTimeout(() => {
      map.invalidateSize();
    }, 500);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isLeafletReady, mapContainerId]);

  // Handle Basemap Switch
  useEffect(() => {
    if (!mapInstanceRef.current || Platform.OS !== 'web') return;
    const win = window as any;
    const L = win.L;
    if (!L) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const tileUrl = BASEMAP_URLS[basemap];
    tileLayerRef.current = L.tileLayer(tileUrl, {
      maxZoom: 18,
      subdomains: ['a', 'b', 'c'],
    }).addTo(mapInstanceRef.current);
  }, [basemap]);

  // Handle Filter Change
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current || Platform.OS !== 'web') return;
    renderMapFeatures(mapInstanceRef.current, layerGroupRef.current, activeFilter);
  }, [activeFilter, nasaEvents]);

  const renderMapFeatures = (map: any, layerGroup: any, filter: FilterType) => {
    const win = window as any;
    const L = win.L;
    if (!L || !layerGroup) return;

    layerGroup.clearLayers();

    const makeIcon = (color: string, iconSymbol: string, size: number = 26) => {
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background-color: ${color};
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            border: 2px solid #ffffff;
            box-shadow: 0 0 10px ${color}, 0 2px 6px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 13px;
            font-weight: bold;
          ">
            ${iconSymbol}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
    };

    // 1. Render Risk Zones
    if (filter === 'all' || filter === 'zones') {
      MOCK_RISK_ZONES.forEach((zone) => {
        const isCritical = zone.riskLevel === 'critical';
        const color = isCritical ? '#B84A4A' : zone.riskLevel === 'high' ? '#C28B52' : '#6B7C98';

        const circle = L.circle(zone.center, {
          radius: zone.radius,
          color: color,
          fillColor: color,
          fillOpacity: isCritical ? 0.28 : 0.18,
          weight: 2.5,
          dashArray: '6, 6',
        });

        circle.bindPopup(`
          <div style="padding: 6px; font-family: sans-serif; color: #2C2827;">
            <div style="color: ${color}; font-size: 11px; font-weight: 800; text-transform: uppercase;">
              ${zone.riskLevel} SUSCEPTIBILITY ZONE
            </div>
            <div style="font-size: 14px; font-weight: bold; margin-top: 3px; color: #2C2827;">${zone.name}</div>
            <div style="font-size: 11px; color: #5E5653; margin-top: 2px;">State: ${zone.state}</div>
            <div style="margin-top: 8px; border-top: 1px solid #DCD7D8; padding-top: 6px; font-size: 12px; color: #5E5653; line-height: 1.4;">
              <div>• Slope Angle: <b>${zone.slopeAngle}°</b></div>
              <div>• At-Risk Population: <b>${(zone.populationAffected / 1000).toFixed(0)}k residents</b></div>
            </div>
          </div>
        `);

        layerGroup.addLayer(circle);
      });
    }

    // 2. Render IoT Slope Sensors
    if (filter === 'all' || filter === 'sensors') {
      MOCK_SENSORS.forEach((sensor) => {
        const isAlert = sensor.status === 'critical';
        const isWarn = sensor.status === 'warning';
        const color = isAlert ? '#B84A4A' : isWarn ? '#C28B52' : '#6B7C98';
        const icon = makeIcon(color, '⚡', 26);

        const marker = L.marker(sensor.location, { icon });
        marker.bindPopup(`
          <div style="padding: 6px; font-family: sans-serif; color: #2C2827;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 11px; font-weight: 800; color: #6B7C98;">${sensor.id}</span>
              <span style="background: ${isAlert ? '#F8ECEC' : '#EEF5F1'}; color: ${isAlert ? '#B84A4A' : '#4D8067'}; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 6px; border: 1px solid ${isAlert ? '#D89696' : '#A3C7B5'};">
                ${sensor.status.toUpperCase()}
              </span>
            </div>
            <div style="font-size: 14px; font-weight: bold; margin-top: 4px; color: #2C2827;">${sensor.name}</div>
            <div style="font-size: 11px; color: #5E5653; text-transform: capitalize;">${sensor.state} • ${sensor.type.replace('_', ' ')}</div>
            <div style="margin-top: 8px; background: #FAF9F9; padding: 10px; border-radius: 8px; border: 1px solid #DCD7D8;">
              <div style="font-size: 11px; color: #5E5653;">Live Telemetry:</div>
              <div style="font-size: 17px; font-weight: 900; color: ${color};">
                ${sensor.value} <span style="font-size: 11px; color: #7B7F8A;">${sensor.unit}</span>
              </div>
              <div style="font-size: 10px; color: #7B7F8A; margin-top: 2px;">Threshold: ${sensor.threshold} ${sensor.unit}</div>
            </div>
          </div>
        `);

        layerGroup.addLayer(marker);
      });
    }

    // 3. Render Historical Landslides
    if (filter === 'all' || filter === 'history') {
      HISTORICAL_LANDSLIDES.forEach((ls) => {
        const icon = makeIcon('#B84A4A', '⚠', 24);
        const marker = L.marker(ls.location, { icon });
        marker.bindPopup(`
          <div style="padding: 6px; font-family: sans-serif; color: #2C2827;">
            <div style="font-size: 11px; font-weight: 800; color: #B84A4A;">HISTORICAL LANDSLIDE</div>
            <div style="font-size: 14px; font-weight: bold; margin-top: 2px; color: #2C2827;">${ls.title}</div>
            <div style="font-size: 11px; color: #5E5653;">Recorded: ${ls.date} (${ls.state})</div>
            <div style="margin-top: 8px; font-size: 12px; color: #5E5653; line-height: 1.4;">
              <b>Impact:</b> ${ls.impact}
            </div>
          </div>
        `);
        layerGroup.addLayer(marker);
      });
    }

    // 4. Render NASA EONET alerts
    if (filter === 'all' || filter === 'nasa') {
      nasaEvents.forEach((ev) => {
        const icon = makeIcon('#AB978C', '🛰', 26);
        const marker = L.marker(ev.coordinates, { icon });
        marker.bindPopup(`
          <div style="padding: 6px; font-family: sans-serif; color: #2C2827;">
            <div style="font-size: 11px; font-weight: 800; color: #AB978C;">NASA SATELLITE ALERT</div>
            <div style="font-size: 14px; font-weight: bold; margin-top: 2px; color: #2C2827;">${ev.title}</div>
            <div style="font-size: 11px; color: #5E5653;">Category: ${ev.category}</div>
            <div style="margin-top: 6px; font-size: 12px; color: #5E5653;">
              Monitored by NASA Earth Observing System (EOS).
            </div>
          </div>
        `);
        layerGroup.addLayer(marker);
      });
    }
  };

  const flyToRegion = (center: [number, number], zoom: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(center, zoom, { duration: 1.2 });
    }
  };

  const handleZoom = (delta: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + delta);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
      {/* Header & Filter Bar - Enlarged */}
      <View style={[styles.mapHeader, { borderBottomColor: colors.border, backgroundColor: colors.subPanel }]}>
        <View style={styles.titleRow}>
          <Layers size={18} color={colors.steelBlue} />
          <Text style={[styles.mapTitle, { color: colors.textPrimary }]}>NER Spatial GIS Radar</Text>
          <Text style={[styles.subtext, { color: colors.textSecondary }]}>(Live Terrain & Satellite GIS)</Text>

          {/* Basemap Toggle Buttons */}
          <View style={[styles.basemapToggleRow, { backgroundColor: colors.borderSoft, borderColor: colors.border }]}>
            {(['topo', 'satellite', 'street', 'slate'] as BasemapType[]).map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.basemapBtn, basemap === type && { backgroundColor: colors.steelBlue }]}
                onPress={() => setBasemap(type)}
              >
                <Text style={[styles.basemapBtnText, { color: basemap === type ? '#ffffff' : colors.textSecondary }]}>
                  {type === 'topo' ? 'Topo' : type === 'satellite' ? 'Satellite' : type === 'street' ? 'Street' : 'Slate'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Layer Filters - Enlarged */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <TouchableOpacity
            style={[styles.filterChip, { backgroundColor: colors.borderSoft, borderColor: colors.border }, activeFilter === 'all' && { backgroundColor: colors.steelBlue, borderColor: colors.steelBlue }]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[styles.filterChipText, { color: activeFilter === 'all' ? '#ffffff' : colors.textSecondary }]}>
              All Layers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, { backgroundColor: colors.borderSoft, borderColor: colors.border }, activeFilter === 'sensors' && { backgroundColor: colors.steelBlue, borderColor: colors.steelBlue }]}
            onPress={() => setActiveFilter('sensors')}
          >
            <Activity size={13} color={activeFilter === 'sensors' ? '#ffffff' : colors.steelBlue} />
            <Text style={[styles.filterChipText, { color: activeFilter === 'sensors' ? '#ffffff' : colors.textSecondary }]}>
              IoT Sensors ({MOCK_SENSORS.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, { backgroundColor: colors.borderSoft, borderColor: colors.border }, activeFilter === 'zones' && { backgroundColor: colors.steelBlue, borderColor: colors.steelBlue }]}
            onPress={() => setActiveFilter('zones')}
          >
            <AlertTriangle size={13} color={activeFilter === 'zones' ? '#ffffff' : colors.warning} />
            <Text style={[styles.filterChipText, { color: activeFilter === 'zones' ? '#ffffff' : colors.textSecondary }]}>
              High-Risk Zones
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, { backgroundColor: colors.borderSoft, borderColor: colors.border }, activeFilter === 'nasa' && { backgroundColor: colors.steelBlue, borderColor: colors.steelBlue }]}
            onPress={() => setActiveFilter('nasa')}
          >
            <Satellite size={13} color={activeFilter === 'nasa' ? '#ffffff' : colors.taupe} />
            <Text style={[styles.filterChipText, { color: activeFilter === 'nasa' ? '#ffffff' : colors.textSecondary }]}>
              NASA Alerts
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, { backgroundColor: colors.borderSoft, borderColor: colors.border }, activeFilter === 'history' && { backgroundColor: colors.steelBlue, borderColor: colors.steelBlue }]}
            onPress={() => setActiveFilter('history')}
          >
            <MapPin size={13} color={activeFilter === 'history' ? '#ffffff' : colors.danger} />
            <Text style={[styles.filterChipText, { color: activeFilter === 'history' ? '#ffffff' : colors.textSecondary }]}>
              Past Slides
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Map Surface View - Height Increased to 480px */}
      <View style={[styles.mapCanvasWrapper, { backgroundColor: colors.bg }]}>
        {Platform.OS === 'web' ? (
          <div
            id={mapContainerId}
            style={{
              width: '100%',
              height: '480px',
              backgroundColor: colors.bg,
              zIndex: 1,
            }}
          />
        ) : (
          <View style={styles.mobileFallback}>
            <Text style={[styles.mobileFallbackText, { color: colors.textSecondary }]}>GIS Map View Active</Text>
          </View>
        )}

        {/* Floating Zoom & Compass Controls */}
        <View style={styles.floatingControls}>
          <TouchableOpacity style={[styles.controlIconBtn, { backgroundColor: colors.cardBg, borderColor: colors.border }]} onPress={() => handleZoom(1)}>
            <ZoomIn size={18} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.controlIconBtn, { backgroundColor: colors.cardBg, borderColor: colors.border }]} onPress={() => handleZoom(-1)}>
            <ZoomOut size={18} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlIconBtn, { backgroundColor: colors.steelBlue, borderColor: colors.steelBlue }]}
            onPress={() => flyToRegion([26.1445, 91.7362], 7)}
          >
            <Compass size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Regional Quick Jump Pills */}
        <View style={styles.regionJumpBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {REGIONS.map((reg, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.regionJumpChip, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
                onPress={() => flyToRegion(reg.center, reg.zoom)}
              >
                <MapPin size={12} color={colors.steelBlue} />
                <Text style={[styles.regionJumpText, { color: colors.textPrimary }]}>{reg.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  mapHeader: {
    padding: 12,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  mapTitle: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subtext: {
    fontSize: 10.5,
  },
  basemapToggleRow: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 2,
    gap: 2,
    borderWidth: 1,
    flexWrap: 'wrap',
  },
  basemapBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  basemapBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 6,
    gap: 4,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '800',
  },
  mapCanvasWrapper: {
    position: 'relative',
    height: 380,
    overflow: 'hidden',
  },
  mobileFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileFallbackText: {
    fontSize: 13,
  },
  floatingControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1000,
    gap: 8,
  },
  controlIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  regionJumpBar: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  regionJumpChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  regionJumpText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
