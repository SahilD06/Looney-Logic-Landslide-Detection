import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MOCK_SENSORS, MOCK_RISK_ZONES, HISTORICAL_LANDSLIDES } from '../../services/mockData';
import { fetchNasaEvents } from '../../services/api';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const createCustomIcon = (color) => {
  return new L.DivIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px ${color};"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
};

const sensorIcon = createCustomIcon('#3b82f6'); // Blue
const landslideIcon = createCustomIcon('#ef4444'); // Red
const nasaEventIcon = createCustomIcon('#f97316'); // Orange

export const GISMap = () => {
  const [nasaEvents, setNasaEvents] = useState([]);
  // Center map on NER region (roughly Guwahati)
  const position = [26.1445, 91.7362];

  useEffect(() => {
    fetchNasaEvents().then(events => setNasaEvents(events));
  }, []);

  return (
    <div className="glass-panel p-2 rounded-2xl h-[500px] w-full relative z-0">
      <div className="absolute top-4 left-4 z-[400] bg-surface/90 backdrop-blur px-2 py-1 rounded-lg border border-white/10 text-[10px] flex flex-col gap-1 shadow-xl">
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Sensors</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div> Past Events</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500"></div> NASA Live</div>
      </div>

      <MapContainer 
        center={position} 
        zoom={6} 
        style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
        zoomControl={false}
      >
        {/* OpenTopoMap terrain basemap */}
        <TileLayer
          attribution='Map data: &copy; OSM | Style: &copy; OpenTopoMap'
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
        />

        {/* Render Risk Zones as circles */}
        {MOCK_RISK_ZONES.map(zone => (
          <Circle
            key={zone.id}
            center={zone.center}
            radius={zone.radius}
            pathOptions={{ 
              color: zone.riskLevel === 'critical' ? '#ef4444' : zone.riskLevel === 'high' ? '#f59e0b' : '#3b82f6',
              fillColor: zone.riskLevel === 'critical' ? '#ef4444' : zone.riskLevel === 'high' ? '#f59e0b' : '#3b82f6',
              fillOpacity: 0.2
            }}
          >
            <Popup className="custom-popup">
              <div className="text-gray-800 p-1">
                <h4 className="font-bold text-sm">{zone.name}</h4>
                <p className="text-xs mt-1">Risk Level: <span className="uppercase font-semibold">{zone.riskLevel}</span></p>
                <p className="text-xs text-gray-500 mt-1">AI Prediction Confidence: 87%</p>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* Render Sensors */}
        {MOCK_SENSORS.map(sensor => (
          <Marker key={sensor.id} position={sensor.location} icon={sensorIcon}>
            <Popup>
              <div className="text-gray-800 p-1">
                <h4 className="font-bold text-sm">{sensor.name}</h4>
                <p className="text-xs text-gray-500 capitalize">{sensor.type.replace('_', ' ')}</p>
                <div className="mt-2 text-sm font-semibold">
                  Reading: {sensor.value} 
                  {sensor.value >= sensor.threshold && <span className="text-red-500 ml-2">(Alert!)</span>}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Historical Landslides */}
        {HISTORICAL_LANDSLIDES.map(ls => (
          <Marker key={ls.id} position={ls.location} icon={landslideIcon}>
            <Popup>
              <div className="text-gray-800 p-1">
                <h4 className="font-bold text-sm text-red-600">Past Landslide</h4>
                <p className="text-xs mt-1">Date: {ls.date}</p>
                <p className="text-xs">Severity: {ls.severity}</p>
                <p className="text-xs text-gray-500 mt-1">Impact: {ls.impact}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Render NASA EONET Events */}
        {nasaEvents.map(event => {
          // EONET points are in [longitude, latitude] format
          const [lon, lat] = event.geometry[0].coordinates;
          if (!lat || !lon) return null;
          return (
            <Marker key={event.id} position={[lat, lon]} icon={nasaEventIcon}>
              <Popup>
                <div className="text-gray-800 p-1">
                  <h4 className="font-bold text-sm text-orange-600">NASA EONET Alert</h4>
                  <p className="text-xs mt-1 font-semibold">{event.title}</p>
                  <p className="text-xs text-gray-500 mt-1">Category: {event.categories[0]?.title}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
