import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RiskEvaluation } from '../services/aiEngine';
import { AlertTriangle, CloudRain, Droplets, Mountain } from 'lucide-react-native';

interface RiskGaugeProps {
  risk: RiskEvaluation;
  telemetry: any;
  loading?: boolean;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ risk, telemetry, loading }) => {
  return (
    <View style={styles.container}>
      {/* Main Risk Card */}
      <View style={[styles.mainCard, { borderColor: risk.badgeBorder }]}>
        <View style={styles.topRow}>
          <View style={styles.titleWithIcon}>
            <AlertTriangle size={18} color={risk.color} />
            <Text style={styles.cardHeader}>AI SUSCEPTIBILITY INDEX</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: risk.bgColor, borderColor: risk.color }]}>
            <Text style={[styles.statusBadgeText, { color: risk.color }]}>{risk.level.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.scoreRow}>
          <Text style={[styles.scoreValue, { color: risk.color }]}>{risk.score}</Text>
          <Text style={styles.scoreMax}>/100</Text>
          <View style={styles.probabilityWrapper}>
            <Text style={styles.probabilityLabel}>Failure Probability</Text>
            <Text style={[styles.probabilityValue, { color: risk.color }]}>{risk.probabilityPercent}%</Text>
          </View>
        </View>

        {/* Dynamic Progress Meter */}
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.max(5, Math.min(100, risk.score))}%`,
                backgroundColor: risk.color,
              },
            ]}
          />
        </View>

        {/* Advisory Banner */}
        <View style={[styles.advisoryBox, { backgroundColor: risk.bgColor }]}>
          <Text style={[styles.advisoryText, { color: '#e2e8f0' }]}>{risk.recommendation}</Text>
        </View>

        {/* Factor Breakdown Grid */}
        <View style={styles.factorsGrid}>
          <View style={styles.factorItem}>
            <View style={styles.factorHeader}>
              <CloudRain size={13} color="#38bdf8" />
              <Text style={styles.factorName}>24h Rain</Text>
            </View>
            <Text style={styles.factorValue}>{telemetry?.rain_24h_sum ?? 0} mm</Text>
            <Text style={styles.factorScore}>+{risk.factors.rainfallScore} pts</Text>
          </View>

          <View style={styles.factorItem}>
            <View style={styles.factorHeader}>
              <Droplets size={13} color="#06b6d4" />
              <Text style={styles.factorName}>Soil Moisture</Text>
            </View>
            <Text style={styles.factorValue}>{((telemetry?.soil_moisture ?? 0.35) * 100).toFixed(0)}% sat</Text>
            <Text style={styles.factorScore}>+{risk.factors.soilScore} pts</Text>
          </View>

          <View style={styles.factorItem}>
            <View style={styles.factorHeader}>
              <Mountain size={13} color="#a855f7" />
              <Text style={styles.factorName}>Slope Baseline</Text>
            </View>
            <Text style={styles.factorValue}>42° Avg</Text>
            <Text style={styles.factorScore}>+{risk.factors.slopeScore} pts</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  mainCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardHeader: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  scoreValue: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1,
  },
  scoreMax: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
    marginLeft: 4,
  },
  probabilityWrapper: {
    marginLeft: 'auto',
    alignItems: 'flex-end',
  },
  probabilityLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },
  probabilityValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#1e293b',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  advisoryBox: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  advisoryText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
  },
  factorsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 12,
  },
  factorItem: {
    flex: 1,
    backgroundColor: '#131d33',
    padding: 8,
    borderRadius: 10,
  },
  factorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  factorName: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
  factorValue: {
    fontSize: 13,
    color: '#f1f5f9',
    fontWeight: '700',
  },
  factorScore: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
  },
});
