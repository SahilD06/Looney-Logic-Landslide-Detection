import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { AlertCircle, ShieldCheck, Siren, PhoneForwarded, Radio } from 'lucide-react-native';

interface SOSBannerProps {
  sosStatus: 'none' | 'needs_help' | 'safe';
  onTriggerSOS: () => void;
  onMarkSafe: () => void;
  onSimulateDanger: () => void;
  isSimulatedDanger: boolean;
}

export const SOSBanner: React.FC<SOSBannerProps> = ({
  sosStatus,
  onTriggerSOS,
  onMarkSafe,
  onSimulateDanger,
  isSimulatedDanger,
}) => {
  const [broadcastSent, setBroadcastSent] = useState(false);

  const handleSOSPress = () => {
    onTriggerSOS();
    setBroadcastSent(true);
  };

  const handleSafePress = () => {
    onMarkSafe();
    setBroadcastSent(false);
  };

  return (
    <View style={styles.container}>
      {/* SOS State Active Alert */}
      {sosStatus === 'needs_help' && (
        <View style={styles.activeSOSCard}>
          <View style={styles.activeSOSHeader}>
            <View style={styles.pulseRedCircle}>
              <Siren size={20} color="#ffffff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.activeSOSTitle}>EMERGENCY SOS BROADCAST ACTIVE</Text>
              <Text style={styles.activeSOSSubtitle}>
                GPS Beacon transmitting (Lat: 25.5788, Lon: 91.8933) to NDRF & State Control.
              </Text>
            </View>
          </View>

          <View style={styles.actionButtonRow}>
            <TouchableOpacity
              style={styles.safeButton}
              onPress={handleSafePress}
              activeOpacity={0.8}
            >
              <ShieldCheck size={16} color="#10b981" />
              <Text style={styles.safeButtonText}>I am Safe Now</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.callControlBtn}
              onPress={() => {
                if (Platform.OS === 'web') {
                  window.open('tel:1078');
                }
              }}
              activeOpacity={0.8}
            >
              <PhoneForwarded size={14} color="#ffffff" />
              <Text style={styles.callControlText}>Call NDRF (1078)</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Safe Confirmation Card */}
      {sosStatus === 'safe' && (
        <View style={styles.safeCard}>
          <ShieldCheck size={18} color="#10b981" />
          <Text style={styles.safeCardText}>Status Confirmed: Marked as SAFE with Response Hub.</Text>
          <TouchableOpacity onPress={() => onMarkSafe()} style={styles.dismissBtn}>
            <Text style={styles.dismissText}>Reset</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Normal Trigger Buttons */}
      {sosStatus === 'none' && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.sosButton}
            onPress={handleSOSPress}
            activeOpacity={0.85}
          >
            <AlertCircle size={18} color="#ffffff" />
            <Text style={styles.sosButtonText}>SOS EMERGENCY</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.simDangerBtn, isSimulatedDanger && styles.simDangerBtnActive]}
            onPress={onSimulateDanger}
            activeOpacity={0.8}
          >
            <Radio size={14} color={isSimulatedDanger ? '#f87171' : '#94a3b8'} />
            <Text style={[styles.simDangerText, isSimulatedDanger && styles.simDangerTextActive]}>
              {isSimulatedDanger ? 'Danger Mode ON' : 'Simulate Risk'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sosButton: {
    flex: 1.5,
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  sosButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  simDangerBtn: {
    flex: 1,
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 6,
  },
  simDangerBtnActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#ef4444',
  },
  simDangerText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  simDangerTextActive: {
    color: '#f87171',
  },
  activeSOSCard: {
    backgroundColor: '#7f1d1d',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  activeSOSHeader: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  pulseRedCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeSOSTitle: {
    color: '#fef2f2',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  activeSOSSubtitle: {
    color: '#fca5a5',
    fontSize: 10,
    marginTop: 2,
    lineHeight: 14,
  },
  actionButtonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  safeButton: {
    flex: 1,
    backgroundColor: '#064e3b',
    borderWidth: 1,
    borderColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 8,
    gap: 6,
  },
  safeButtonText: {
    color: '#a7f3d0',
    fontSize: 11,
    fontWeight: '700',
  },
  callControlBtn: {
    flex: 1,
    backgroundColor: '#991b1b',
    borderWidth: 1,
    borderColor: '#f87171',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 8,
    gap: 6,
  },
  callControlText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  safeCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  safeCardText: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  dismissBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#064e3b',
    borderRadius: 6,
  },
  dismissText: {
    color: '#a7f3d0',
    fontSize: 10,
    fontWeight: '700',
  },
});
