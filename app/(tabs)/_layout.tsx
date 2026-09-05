<<<<<<< HEAD
import { Tabs } from 'expo-router';
import { Home, FileText, Settings } from 'lucide-react-native';

export default function TabLayout() {
=======
import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Activity, AlertOctagon, Camera, Radio, Settings } from 'lucide-react-native';
import { useAppTheme } from '../../context/ThemeContext';

export default function TabLayout() {
  const { colors, isDark } = useAppTheme();

>>>>>>> b975479ddc28a837af2451e176af696b66432c34
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
<<<<<<< HEAD
        tabBarStyle: {
          backgroundColor: '#13131a',
          borderTopColor: 'rgba(255,255,255,0.1)',
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
      }}>
=======
        tabBarActiveTintColor: colors.steelBlue,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.cardBg,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 26 : 10,
          paddingTop: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDark ? 0.2 : 0.05,
          shadowRadius: 6,
          elevation: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
>>>>>>> b975479ddc28a837af2451e176af696b66432c34
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
<<<<<<< HEAD
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
=======
          tabBarIcon: ({ color }) => <Activity size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color }) => <AlertOctagon size={22} color={color} />,
>>>>>>> b975479ddc28a837af2451e176af696b66432c34
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Report',
<<<<<<< HEAD
          tabBarIcon: ({ color }) => <FileText color={color} size={24} />,
=======
          tabBarIcon: ({ color }) => <Camera size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sensors"
        options={{
          title: 'Sensors',
          tabBarIcon: ({ color }) => <Radio size={22} color={color} />,
>>>>>>> b975479ddc28a837af2451e176af696b66432c34
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
<<<<<<< HEAD
          tabBarIcon: ({ color }) => <Settings color={color} size={24} />,
=======
          tabBarIcon: ({ color }) => <Settings size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          href: null,
>>>>>>> b975479ddc28a837af2451e176af696b66432c34
        }}
      />
    </Tabs>
  );
}
