import { TelemetryData } from './api';

export interface RiskEvaluation {
  level: 'Critical' | 'High' | 'Moderate' | 'Low';
  score: number; // 0 to 100
  color: string;
  bgColor: string;
  badgeBorder: string;
  recommendation: string;
  factors: {
    rainfallScore: number; // max 40
    soilScore: number;     // max 35
    slopeScore: number;    // max 25
  };
  probabilityPercent: number;
}

/**
 * Multi-factor AI Landslide Risk Prediction algorithm
 */
export const calculateRisk = (
  locationName: string = 'NER Regional',
  telemetry: TelemetryData | null,
  simulatedEmergency: boolean = false
): RiskEvaluation => {
  if (simulatedEmergency) {
    return {
      level: 'Critical',
      score: 94,
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.15)',
      badgeBorder: '#ef4444',
      recommendation: 'IMMEDIATE EVACUATION ADVISED. Hill slope threshold exceeded. Avoid vulnerable valley corridors.',
      factors: {
        rainfallScore: 38,
        soilScore: 34,
        slopeScore: 22,
      },
      probabilityPercent: 94,
    };
  }

  let rainfallScore = 15;
  let soilScore = 12;
  let slopeScore = 15;

  if (telemetry) {
    // 1. Rainfall score (24h sum)
    const rain = telemetry.rain_24h_sum;
    if (rain > 120) rainfallScore = 38;
    else if (rain > 80) rainfallScore = 30;
    else if (rain > 45) rainfallScore = 20;
    else if (rain > 20) rainfallScore = 12;
    else rainfallScore = 5;

    // 2. Soil Moisture Volumetric saturation (0.0 to 0.5)
    const moisture = telemetry.soil_moisture;
    if (moisture >= 0.45) soilScore = 33;
    else if (moisture >= 0.38) soilScore = 26;
    else if (moisture >= 0.30) soilScore = 18;
    else if (moisture >= 0.20) soilScore = 10;
    else soilScore = 4;

    // 3. Slope geological baseline (NER hilly terrain average: 18)
    slopeScore = 18;
  }

  const totalScore = Math.min(100, rainfallScore + soilScore + slopeScore);

  if (totalScore >= 75) {
    return {
      level: 'Critical',
      score: totalScore,
      color: '#ef4444', // Red
      bgColor: 'rgba(239, 68, 68, 0.15)',
      badgeBorder: '#ef4444',
      recommendation: 'RED ALERT: Severe landslide susceptibility. Restrict non-essential highway travel.',
      factors: { rainfallScore, soilScore, slopeScore },
      probabilityPercent: totalScore,
    };
  } else if (totalScore >= 50) {
    return {
      level: 'High',
      score: totalScore,
      color: '#f97316', // Orange
      bgColor: 'rgba(249, 115, 22, 0.15)',
      badgeBorder: '#f97316',
      recommendation: 'ORANGE WARNING: Saturated soil conditions. Monitor slope drainage and road alerts.',
      factors: { rainfallScore, soilScore, slopeScore },
      probabilityPercent: totalScore,
    };
  } else if (totalScore >= 30) {
    return {
      level: 'Moderate',
      score: totalScore,
      color: '#eab308', // Yellow
      bgColor: 'rgba(234, 179, 8, 0.15)',
      badgeBorder: '#eab308',
      recommendation: 'YELLOW WATCH: Moderate rainfall recorded. Routine surveillance active.',
      factors: { rainfallScore, soilScore, slopeScore },
      probabilityPercent: totalScore,
    };
  } else {
    return {
      level: 'Low',
      score: totalScore,
      color: '#10b981', // Green
      bgColor: 'rgba(16, 185, 129, 0.15)',
      badgeBorder: '#10b981',
      recommendation: 'GREEN: Slopes are stable. Normal traffic operations across corridors.',
      factors: { rainfallScore, soilScore, slopeScore },
      probabilityPercent: totalScore,
    };
  }
};
