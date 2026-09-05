<<<<<<< HEAD
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/modal.tsx" />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
=======
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ShieldAlert, PhoneCall, CheckCircle, Info } from 'lucide-react-native';
import { EMERGENCY_CONTACTS } from '../services/mockData';
import { useAppTheme } from '../context/ThemeContext';

export default function EmergencyModal() {
  const { colors, isDark } = useAppTheme();

  const handleCall = (num: string) => {
    const cleanNum = num.split('/')[0].trim();
    if (Platform.OS === 'web') {
      window.open(`tel:${cleanNum}`);
    } else {
      Linking.openURL(`tel:${cleanNum}`);
    }
  };

  return (
    <View style={StyleSheet.flatten([styles.container, { backgroundColor: colors.bg }])}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.shieldIcon, { backgroundColor: colors.subPanel, borderColor: colors.border }]}>
            <ShieldAlert size={32} color={colors.steelBlue} />
          </View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Disaster Response & Safety</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>NDRF Landslide Protocol & Emergency Dispatch</Text>
        </View>

        {/* Immediate Action Checklist */}
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Immediate Action Checklist</Text>
          <View style={styles.checkItem}>
            <CheckCircle size={18} color={colors.success} />
            <Text style={[styles.checkText, { color: colors.textPrimary }]}>Evacuate away from the path of mudflow or slope failure.</Text>
          </View>
          <View style={styles.checkItem}>
            <CheckCircle size={18} color={colors.success} />
            <Text style={[styles.checkText, { color: colors.textPrimary }]}>Avoid valley bottoms, stream beds, and drainage ravines.</Text>
          </View>
          <View style={styles.checkItem}>
            <CheckCircle size={18} color={colors.success} />
            <Text style={[styles.checkText, { color: colors.textPrimary }]}>Stay tuned to local NDRF radio & early warning broadcasts.</Text>
          </View>
          <View style={styles.checkItem}>
            <CheckCircle size={18} color={colors.success} />
            <Text style={[styles.checkText, { color: colors.textPrimary }]}>Check on neighbors, elderly individuals, and stranded travelers.</Text>
          </View>
        </View>

        {/* 24x7 Helplines */}
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>24x7 Emergency Helplines</Text>
          {EMERGENCY_CONTACTS.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.contactRow, { borderBottomColor: colors.borderSoft }]}
              onPress={() => handleCall(item.number)}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.contactTitle, { color: colors.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.contactType, { color: colors.textSecondary }]}>{item.type}</Text>
              </View>
              <View style={[styles.callBadge, { backgroundColor: colors.danger }]}>
                <PhoneCall size={14} color="#ffffff" />
                <Text style={styles.callBadgeText}>{item.number.split('/')[0]}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* About System */}
        <View style={styles.footerNote}>
          <Info size={16} color={colors.textMuted} />
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            Rakshak NER early warning AI model is trained on multi-temporal slope displacement, InSAR satellite data, and IoT rainfall thresholds for the North East Region.
          </Text>
        </View>
      </ScrollView>
>>>>>>> b975479ddc28a837af2451e176af696b66432c34
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
=======
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 50,
    maxWidth: 640,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  shieldIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  card: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 14,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  checkText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  contactTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  contactType: {
    fontSize: 11,
    marginTop: 2,
  },
  callBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  callBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 8,
    marginTop: 12,
  },
  footerText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
>>>>>>> b975479ddc28a837af2451e176af696b66432c34
  },
});
