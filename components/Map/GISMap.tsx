import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Circle, UrlTile, Callout } from 'react-native-maps';
import { MOCK_SENSORS, MOCK_RISK_ZONES, HISTORICAL_LANDSLIDES } from '../../services/mockData';
import { fetchNasaEvents } from '../../services/api';

export const GISMap = () => {
  const [nasaEvents, setNasaEvents] = useState<any[]>([]);
  
  // Center map on NER region (roughly Guwahati)
  const initialRegion = {
    latitude: 26.1445,
    longitude: 91.7362,
    latitudeDelta: 5.0,
    longitudeDelta: 5.0,
  };

  useEffect(() => {
    fetchNasaEvents().then((events) => setNasaEvents(events));
  }, []);

  return (
    <View className="flex-1 bg-surface/80 rounded-2xl overflow-hidden relative border border-white/10">
      {/* Legend Overlay */}
      <View className="absolute top-4 left-4 z-10 bg-surface/90 px-2 py-2 rounded-lg border border-white/10 shadow-xl">
        <View className="flex-row items-center gap-1.5 mb-1">
          <View className="w-2 h-2 rounded-full bg-blue-500" />
          <Text className="text-[10px] text-white font-medium">Sensors</Text>
        </View>
        <View className="flex-row items-center gap-1.5 mb-1">
          <View className="w-2 h-2 rounded-full bg-red-500" />
          <Text className="text-[10px] text-white font-medium">Past Events</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View className="w-2 h-2 rounded-full bg-orange-500" />
          <Text className="text-[10px] text-white font-medium">NASA Live</Text>
        </View>
      </View>

      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        mapType="none" // we use UrlTile instead of default Apple/Google maps to match legacy UI
      >
        <UrlTile
          urlTemplate="https://a.tile.opentopomap.org/{z}/{x}/{y}.png"
          maximumZ={17}
          flipY={false}
        />

        {/* Risk Zones */}
        {MOCK_RISK_ZONES.map((zone) => (
          <Circle
            key={zone.id}
            center={{ latitude: zone.center[0], longitude: zone.center[1] }}
            radius={zone.radius}
            strokeColor={
              zone.riskLevel === 'critical' ? '#ef4444' : zone.riskLevel === 'high' ? '#f59e0b' : '#3b82f6'
            }
            fillColor={
              zone.riskLevel === 'critical' ? 'rgba(239, 68, 68, 0.2)' : zone.riskLevel === 'high' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)'
            }
          />
        ))}

        {/* Sensors */}
        {MOCK_SENSORS.map((sensor) => (
          <Marker
            key={sensor.id}
            coordinate={{ latitude: sensor.location[0], longitude: sensor.location[1] }}
            pinColor="#3b82f6"
          >
            <Callout>
              <View className="p-1">
                <Text className="font-bold text-sm">{sensor.name}</Text>
                <Text className="text-xs text-gray-500 capitalize">{sensor.type.replace('_', ' ')}</Text>
                <Text className="mt-1 text-xs font-semibold">
                  Reading: {sensor.value}
                  {sensor.value >= sensor.threshold ? ' (Alert!)' : ''}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Historical Landslides */}
        {HISTORICAL_LANDSLIDES.map((ls) => (
          <Marker
            key={ls.id}
            coordinate={{ latitude: ls.location[0], longitude: ls.location[1] }}
            pinColor="#ef4444"
          >
            <Callout>
              <View className="p-1">
                <Text className="font-bold text-sm text-red-600">Past Landslide</Text>
                <Text className="text-xs mt-1">Date: {ls.date}</Text>
                <Text className="text-xs">Severity: {ls.severity}</Text>
                <Text className="text-xs text-gray-500 mt-1">Impact: {ls.impact}</Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* NASA EONET Events */}
        {nasaEvents.map((event) => {
          const [lon, lat] = event.geometry[0].coordinates;
          if (!lat || !lon) return null;
          return (
            <Marker
              key={event.id}
              coordinate={{ latitude: lat, longitude: lon }}
              pinColor="#f97316"
            >
              <Callout>
                <View className="p-1">
                  <Text className="font-bold text-sm text-orange-600">NASA EONET Alert</Text>
                  <Text className="text-xs mt-1 font-semibold">{event.title}</Text>
                  <Text className="text-xs text-gray-500 mt-1">Category: {event.categories[0]?.title}</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
};
