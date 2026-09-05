import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ShieldAlert, PhoneCall, CheckCircle, Info } from 'lucide-react-native';
import { EMERGENCY_CONTACTS } from '../services/mockData';
import { useAppTheme } from '../context/ThemeContext';

export default function EmergencyModal() {
  const { colors, isDark } = useAppTheme();

  const handleCall = (num: string) => {
    const cleanNum = num.replace(/[^0-9+]/g, '').trim();
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

        {/* Toll-Free Emergency Hotlines */}
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Toll-Free Emergency Hotlines</Text>
          <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
            Natively routed shortcodes across local cellular and landline networks for fast-response dispatch.
          </Text>
          {EMERGENCY_CONTACTS.filter(c => c.category === 'Toll-Free Hotline').map((item, idx) => (
            <View key={idx} style={[styles.contactRow, { borderBottomColor: colors.borderSoft }]}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={[styles.contactTitle, { color: colors.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.contactType, { color: colors.textSecondary }]}>{item.type}</Text>
              </View>
              <View style={styles.numberBtnGroup}>
                {item.number.split('/').map((subNum, subIdx) => {
                  const clean = subNum.trim();
                  return (
                    <TouchableOpacity
                      key={subIdx}
                      style={[styles.callBadge, { backgroundColor: colors.danger }]}
                      onPress={() => handleCall(clean)}
                      activeOpacity={0.8}
                    >
                      <PhoneCall size={12} color="#ffffff" />
                      <Text style={styles.callBadgeText}>{clean}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        {/* State Disaster Management Control Rooms */}
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>State Disaster Management Control Rooms</Text>
          <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
            Direct regional command for incident coordinates, ground rescue teams, and relief camp services.
          </Text>
          {EMERGENCY_CONTACTS.filter(c => c.category === 'State Control Room').map((item, idx) => (
            <View key={idx} style={[styles.contactRow, { borderBottomColor: colors.borderSoft }]}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={[styles.contactTitle, { color: colors.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.contactType, { color: colors.textSecondary }]}>{item.type}</Text>
              </View>
              <View style={styles.numberBtnGroup}>
                {item.number.split('/').map((subNum, subIdx) => {
                  const clean = subNum.trim();
                  return (
                    <TouchableOpacity
                      key={subIdx}
                      style={[styles.callBadge, { backgroundColor: colors.steelBlue }]}
                      onPress={() => handleCall(clean)}
                      activeOpacity={0.8}
                    >
                      <PhoneCall size={12} color="#ffffff" />
                      <Text style={styles.callBadgeText}>{clean}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 12,
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
    gap: 8,
    flexWrap: 'wrap',
  },
  contactTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  contactType: {
    fontSize: 11,
    marginTop: 2,
  },
  numberBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  callBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 5,
  },
  callBadgeText: {
    color: '#ffffff',
    fontSize: 11,
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
  },
});
