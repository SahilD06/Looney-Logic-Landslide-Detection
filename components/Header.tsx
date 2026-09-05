import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { ShieldAlert, PhoneCall, Sun, Moon, User, FlaskConical } from 'lucide-react-native';
import { Link, useRouter } from 'expo-router';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ThemeToggleSwitch } from './ThemeToggleSwitch';

interface HeaderProps {
  onRefresh?: () => void;
  isLive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onRefresh }) => {
  const { colors, isDark } = useAppTheme();
  const { user, isAuthenticated, currentRole } = useAuth();
  const router = useRouter();

  return (
    <View style={[styles.header, { backgroundColor: colors.cardBg, borderBottomColor: colors.border }]}>
      <View style={styles.titleContainer}>
        <View style={styles.logoRow}>
          <View style={[styles.shieldIconWrapper, { backgroundColor: colors.subPanel, borderColor: colors.border }]}>
            <ShieldAlert size={20} color={colors.steelBlue} />
          </View>
          <View style={styles.titleTextCol}>
            <Text style={[styles.appTitle, { color: colors.textPrimary }]} numberOfLines={1}>
              RAKSHAK NER
            </Text>
            <Text style={[styles.appSubtitle, { color: colors.steelBlue }]} numberOfLines={1}>
              Landslide Early Warning
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionRow}>
        {/* Uiverse Theme Switcher */}
        <ThemeToggleSwitch scale={0.82} />

        {/* Helpline Button */}
        <TouchableOpacity
          style={[styles.helplineButton, { backgroundColor: colors.dangerBg, borderColor: colors.dangerBorder }]}
          onPress={() => router.push('/modal')}
          activeOpacity={0.8}
        >
          <PhoneCall size={14} color={colors.danger} />
          <Text style={[styles.helplineText, { color: colors.danger }]}>1078</Text>
        </TouchableOpacity>

        {/* User Avatar / Login Shortcut */}
        <TouchableOpacity
          style={[
            styles.userButton,
            {
              backgroundColor:
                currentRole === 'admin'
                  ? colors.dangerBg
                  : currentRole === 'tester'
                  ? colors.warningBg
                  : colors.subPanel,
              borderColor:
                currentRole === 'admin'
                  ? colors.dangerBorder
                  : currentRole === 'tester'
                  ? colors.warningBorder
                  : colors.border,
            },
          ]}
          onPress={() => router.push('/(tabs)/settings')}
          activeOpacity={0.8}
        >
          {isAuthenticated && currentRole === 'admin' ? (
            <ShieldAlert size={17} color={colors.danger} />
          ) : isAuthenticated && currentRole === 'tester' ? (
            <FlaskConical size={17} color={colors.warning} />
          ) : isAuthenticated && user?.photoUrl ? (
            <Image source={{ uri: user.photoUrl }} style={styles.userAvatarImg} />
          ) : (
            <User size={16} color={colors.steelBlue} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 12 : 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    gap: 8,
  },
  titleContainer: {
    flex: 1,
    minWidth: 0,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
  },
  titleTextCol: {
    flex: 1,
    minWidth: 0,
  },
  shieldIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  appTitle: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
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
