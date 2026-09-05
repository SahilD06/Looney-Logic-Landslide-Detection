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
 * Multi-factor AI Landslide Risk Prediction algorithm (Urban Slate Theme)
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
      color: '#B84A4A',
      bgColor: '#F8ECEC',
      badgeBorder: '#D89696',
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
    const rain = telemetry.rain_24h_sum;
    if (rain > 120) rainfallScore = 38;
    else if (rain > 80) rainfallScore = 30;
    else if (rain > 45) rainfallScore = 20;
    else if (rain > 20) rainfallScore = 12;
    else rainfallScore = 5;

    const moisture = telemetry.soil_moisture;
    if (moisture >= 0.45) soilScore = 33;
    else if (moisture >= 0.38) soilScore = 26;
    else if (moisture >= 0.30) soilScore = 18;
    else if (moisture >= 0.20) soilScore = 10;
    else soilScore = 4;

    slopeScore = 18;
  }

  const totalScore = Math.min(100, rainfallScore + soilScore + slopeScore);

  if (totalScore >= 75) {
    return {
      level: 'Critical',
      score: totalScore,
      color: '#B84A4A',
      bgColor: '#F8ECEC',
      badgeBorder: '#D89696',
      recommendation: 'RED ALERT: Severe landslide susceptibility. Restrict non-essential highway travel.',
      factors: { rainfallScore, soilScore, slopeScore },
      probabilityPercent: totalScore,
    };
  } else if (totalScore >= 50) {
    return {
      level: 'High',
      score: totalScore,
      color: '#C28B52',
      bgColor: '#FAF2EA',
      badgeBorder: '#E0BA92',
      recommendation: 'ORANGE WARNING: Saturated soil conditions. Monitor slope drainage and road alerts.',
      factors: { rainfallScore, soilScore, slopeScore },
      probabilityPercent: totalScore,
    };
  } else if (totalScore >= 30) {
    return {
      level: 'Moderate',
      score: totalScore,
      color: '#AB978C',
      bgColor: '#F5F0EC',
      badgeBorder: '#D1C4BC',
      recommendation: 'YELLOW WATCH: Moderate rainfall recorded. Routine surveillance active.',
      factors: { rainfallScore, soilScore, slopeScore },
      probabilityPercent: totalScore,
    };
  } else {
    return {
      level: 'Low',
      score: totalScore,
      color: '#4D8067',
      bgColor: '#EEF5F1',
      badgeBorder: '#A3C7B5',
      recommendation: 'GREEN: Slopes are stable. Normal traffic operations across corridors.',
      factors: { rainfallScore, soilScore, slopeScore },
      probabilityPercent: totalScore,
    };
  }
};
