import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { ShieldAlert, PhoneCall, Sun, Moon, User } from 'lucide-react-native';
import { Link, useRouter } from 'expo-router';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ThemeToggleSwitch } from './ThemeToggleSwitch';

interface HeaderProps {
  onRefresh?: () => void;
  isLive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onRefresh, isLive = true }) => {
  const { colors, isDark } = useAppTheme();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <View style={[styles.header, { backgroundColor: colors.cardBg, borderBottomColor: colors.border }]}>
      <View style={styles.titleContainer}>
        <View style={styles.logoRow}>
          <View style={[styles.shieldIconWrapper, { backgroundColor: colors.subPanel, borderColor: colors.border }]}>
            <ShieldAlert size={24} color={colors.steelBlue} />
          </View>
          <View>
            <Text style={[styles.appTitle, { color: colors.textPrimary }]}>RAKSHAK NER</Text>
            <Text style={[styles.appSubtitle, { color: colors.steelBlue }]}>Landslide Early Warning & AI Shield</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionRow}>
        {/* Live Indicator */}
        <View style={[styles.liveBadge, { backgroundColor: colors.successBg, borderColor: colors.successBorder }]}>
          <View style={[styles.pulsingDot, { backgroundColor: colors.success }]} />
          <Text style={[styles.liveText, { color: colors.success }]}>LIVE</Text>
        </View>

        {/* Uiverse Theme Switcher */}
        <ThemeToggleSwitch scale={0.88} />

        {/* Helpline Button */}
        <TouchableOpacity
          style={[styles.helplineButton, { backgroundColor: colors.dangerBg, borderColor: colors.dangerBorder }]}
          onPress={() => router.push('/modal')}
          activeOpacity={0.8}
        >
          <PhoneCall size={15} color={colors.danger} />
          <Text style={[styles.helplineText, { color: colors.danger }]}>1078</Text>
        </TouchableOpacity>

        {/* User Avatar / Login Shortcut */}
        <TouchableOpacity
          style={[styles.userButton, { backgroundColor: colors.subPanel, borderColor: colors.border }]}
          onPress={() => router.push('/(tabs)/settings')}
          activeOpacity={0.8}
        >
          {isAuthenticated && user?.photoUrl ? (
            <Image source={{ uri: user.photoUrl }} style={styles.userAvatarImg} />
          ) : (
            <User size={18} color={colors.steelBlue} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'ios' ? 14 : 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  titleContainer: {
    flex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  shieldIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  appSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  pulsingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helplineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  helplineText: {
    fontSize: 12,
    fontWeight: '800',
  },
  userButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  userAvatarImg: {
    width: '100%',
    height: '100%',
  },
});
