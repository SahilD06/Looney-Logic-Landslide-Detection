import { MOCK_SENSORS } from './mockData';

// Simulated AI Model for Risk Prediction with Live Data
export const calculateRisk = (location, liveData = null) => {
  let riskScore = 0;
  
  if (liveData) {
    // Factor 1: Rainfall (24h sum)
    const rain = parseFloat(liveData.rain_24h_sum) || 0;
    if (rain > 100) riskScore += 40;
    else if (rain > 50) riskScore += 20;

    // Factor 2: Soil Moisture (Volumetric Water Content)
    // Soil moisture usually ranges 0.0 to 0.5 (saturation). Above 0.4 is very wet.
    const moisture = parseFloat(liveData.soil_moisture) || 0;
    if (moisture > 0.4) riskScore += 40;
    else if (moisture > 0.3) riskScore += 20;
  } else {
    // Fallback logic if live data is loading or failed
    riskScore += 20; // Default moderate risk
  }

  // Determine Level
  if (riskScore >= 70) return { level: 'Critical', score: riskScore, color: 'text-danger' };
  if (riskScore >= 40) return { level: 'High', score: riskScore, color: 'text-warning' };
  return { level: 'Moderate', score: riskScore, color: 'text-primary' };
};
