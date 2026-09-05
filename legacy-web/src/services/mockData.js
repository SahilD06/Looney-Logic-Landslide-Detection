// Simulated Mock Data for NER region

export const MOCK_SENSORS = [
  { id: 'S-01', location: [25.5788, 91.8933], name: 'Shillong Peak Sensor', type: 'soil_moisture', value: 85, threshold: 80 },
  { id: 'S-02', location: [27.3314, 88.6138], name: 'Gangtok Slope Monitor', type: 'inclinometer', value: 2.1, threshold: 2.0 },
  { id: 'S-03', location: [26.1445, 91.7362], name: 'Guwahati Rainfall', type: 'rain_gauge', value: 120, threshold: 100 },
  { id: 'S-04', location: [27.4728, 94.9120], name: 'Dibrugarh Flood Sensor', type: 'water_level', value: 104, threshold: 105 },
  { id: 'S-05', location: [23.7271, 92.7176], name: 'Aizawl Fault Monitor', type: 'extensometer', value: 0.5, threshold: 1.0 },
];

export const MOCK_RISK_ZONES = [
  // A set of polygon coordinates representing high risk zones, simplified for mock
  { id: 'Z-01', name: 'East Khasi Hills', center: [25.5788, 91.8933], riskLevel: 'high', radius: 15000 },
  { id: 'Z-02', name: 'Tawang Valley', center: [27.5860, 91.8594], riskLevel: 'critical', radius: 12000 },
  { id: 'Z-03', name: 'Dima Hasao', center: [25.1764, 93.0232], riskLevel: 'medium', radius: 20000 },
];

export const HISTORICAL_LANDSLIDES = [
  { id: 'L-01', location: [27.3314, 88.6138], date: '2023-06-15', severity: 'high', impact: 'Road Blocked' },
  { id: 'L-02', location: [25.5788, 91.8933], date: '2024-05-10', severity: 'medium', impact: 'Minor Damage' },
];

export const CURRENT_WEATHER = {
  temperature: 24,
  humidity: 92,
  rainfall_24h: 115, // mm
  forecast: 'Heavy rainfall expected in next 48 hours.',
  alert_level: 'Red' // Red, Orange, Yellow, Green
};

export const CONNECTIVITY_STATUS = [
  { route: 'NH-6 (Shillong - Silchar)', status: 'Blocked', reason: 'Landslide at Sonapur' },
  { route: 'NH-10 (Siliguri - Gangtok)', status: 'Vulnerable', reason: 'Heavy rainfall, slow movement' },
  { route: 'NH-29 (Dimapur - Kohima)', status: 'Clear', reason: 'Normal operations' },
];
