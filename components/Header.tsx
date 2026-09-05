import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { ShieldAlert, Radio, PhoneCall, Bell } from 'lucide-react-native';
import { Link } from 'expo-router';

interface HeaderProps {
  onRefresh?: () => void;
  isLive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onRefresh, isLive = true }) => {
  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <View style={styles.logoRow}>
          <View style={styles.shieldIconWrapper}>
            <ShieldAlert size={20} color="#38bdf8" />
          </View>
          <View>
            <Text style={styles.appTitle}>RAKSHAK NER</Text>
            <Text style={styles.appSubtitle}>Landslide Early Warning & AI Shield</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionRow}>
        <View style={styles.liveBadge}>
          <View style={styles.pulsingDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>

        <Link href="/modal" asChild>
          <TouchableOpacity style={styles.helplineButton} activeOpacity={0.8}>
            <PhoneCall size={14} color="#ef4444" />
            <Text style={styles.helplineText}>1078</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
    paddingBottom: 14,
    backgroundColor: '#090d16',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  shieldIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: 0.8,
  },
  appSubtitle: {
    fontSize: 10,
    color: '#38bdf8',
    fontWeight: '600',
    marginTop: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  liveText: {
    color: '#34d399',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  helplineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  helplineText: {
    color: '#ef4444',
    fontSize: 11,
    fontWeight: '700',
  },
});
