import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { Header } from '../../components/Header';
import { EMERGENCY_SHELTERS, EMERGENCY_CONTACTS } from '../../services/mockData';
import {
  AlertOctagon,
  ShieldAlert,
  PhoneCall,
  Home,
  Users,
  ChevronRight,
  Info,
} from 'lucide-react-native';
import { useAppTheme } from '../../context/ThemeContext';

export default function AlertsScreen() {
  const { colors, isDark } = useAppTheme();
  const [selectedTab, setSelectedTab] = useState<'advisories' | 'shelters' | 'helplines'>('advisories');

  const handleCall = (number: string) => {
    const cleanNum = number.replace(/[^0-9+]/g, '').trim();
    if (Platform.OS === 'web') {
      window.open(`tel:${cleanNum}`);
    } else {
      Linking.openURL(`tel:${cleanNum}`);
    }
  };

  return (
    <View style={StyleSheet.flatten([styles.container, { backgroundColor: colors.bg }])}>
      <Header />

      <View style={[styles.tabSelector, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'advisories' && { backgroundColor: colors.steelBlue }]}
          onPress={() => setSelectedTab('advisories')}
        >
          <AlertOctagon size={16} color={selectedTab === 'advisories' ? '#ffffff' : colors.textSecondary} />
          <Text style={[styles.tabButtonText, { color: selectedTab === 'advisories' ? '#ffffff' : colors.textSecondary }]}>
            Early Warnings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'shelters' && { backgroundColor: colors.steelBlue }]}
          onPress={() => setSelectedTab('shelters')}
        >
          <Home size={16} color={selectedTab === 'shelters' ? '#ffffff' : colors.textSecondary} />
          <Text style={[styles.tabButtonText, { color: selectedTab === 'shelters' ? '#ffffff' : colors.textSecondary }]}>
            Shelters
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'helplines' && { backgroundColor: colors.steelBlue }]}
          onPress={() => setSelectedTab('helplines')}
        >
          <PhoneCall size={16} color={selectedTab === 'helplines' ? '#ffffff' : colors.textSecondary} />
          <Text style={[styles.tabButtonText, { color: selectedTab === 'helplines' ? '#ffffff' : colors.textSecondary }]}>
            Helplines
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {selectedTab === 'advisories' && (
          <View style={styles.section}>
            {/* Red Alert Card */}
            <View style={[styles.alertCard, { backgroundColor: colors.dangerBg, borderColor: colors.dangerBorder }]}>
              <View style={styles.alertHeader}>
                <AlertOctagon size={22} color={colors.danger} />
                <Text style={[styles.alertBadgeRed, { color: colors.danger }]}>RED ALERT - LEVEL 4</Text>
                <Text style={[styles.alertTime, { color: colors.textMuted }]}>Issued 35 mins ago</Text>
              </View>
              <Text style={[styles.alertTitle, { color: colors.textPrimary }]}>East Khasi & South Garo Hills Flash Warning</Text>
              <Text style={[styles.alertBody, { color: colors.textPrimary }]}>
                Precipitation threshold exceeded (140mm / 24h). Critical instability detected in Sohra and Mawsynram slope cuts. Evacuation from unstable downhill settlements strongly advised.
              </Text>
              <View style={[styles.alertFooter, { borderTopColor: colors.dangerBorder }]}>
                <Text style={[styles.authorityTag, { color: colors.textSecondary }]}>Issued by IMD & State Disaster Management Authority</Text>
              </View>
            </View>

            {/* Orange Warning Card */}
            <View style={[styles.alertCard, { backgroundColor: colors.warningBg, borderColor: colors.warningBorder }]}>
              <View style={styles.alertHeader}>
                <ShieldAlert size={22} color={colors.warning} />
                <Text style={[styles.alertBadgeOrange, { color: colors.warning }]}>ORANGE WARNING - LEVEL 3</Text>
                <Text style={[styles.alertTime, { color: colors.textMuted }]}>Issued 2 hours ago</Text>
              </View>
              <Text style={[styles.alertTitle, { color: colors.textPrimary }]}>Sikkim Highway NH-10 Mudflow Precaution</Text>
              <Text style={[styles.alertBody, { color: colors.textPrimary }]}>
                Continuous seepage on 29th Mile and Teesta Valley roads. Heavy goods traffic restricted between 19:00 - 06:00. Use Lava - Algarah bypass if traveling.
              </Text>
              <View style={[styles.alertFooter, { borderTopColor: colors.warningBorder }]}>
                <Text style={[styles.authorityTag, { color: colors.textSecondary }]}>BRO 144 Task Force Advisory</Text>
              </View>
            </View>

            {/* Yellow Watch Card */}
            <View style={[styles.alertCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <View style={styles.alertHeader}>
                <Info size={22} color={colors.taupe} />
                <Text style={[styles.alertBadgeYellow, { color: colors.taupe }]}>YELLOW WATCH - LEVEL 2</Text>
                <Text style={[styles.alertTime, { color: colors.textMuted }]}>Issued 5 hours ago</Text>
              </View>
              <Text style={[styles.alertTitle, { color: colors.textPrimary }]}>Dima Hasao Railway Section Surveillance</Text>
              <Text style={[styles.alertBody, { color: colors.textPrimary }]}>
                Inclinometer ground sensors showing 0.4mm slow creep. Engineering teams deployed for slope anchoring.
              </Text>
            </View>
          </View>
        )}

        {selectedTab === 'shelters' && (
          <View style={styles.section}>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>Designated Emergency Relief Camps & Safe Zones</Text>
            {EMERGENCY_SHELTERS.map((sh) => (
              <View key={sh.id} style={[styles.shelterCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                <View style={styles.shelterTop}>
                  <Text style={[styles.shelterName, { color: colors.textPrimary }]}>{sh.name}</Text>
                  <View style={[styles.supplyBadge, { backgroundColor: sh.suppliesStatus === 'Adequate' ? colors.successBg : colors.dangerBg, borderColor: sh.suppliesStatus === 'Adequate' ? colors.successBorder : colors.dangerBorder }]}>
                    <Text style={[styles.supplyText, { color: sh.suppliesStatus === 'Adequate' ? colors.success : colors.danger }]}>
                      Supplies: {sh.suppliesStatus}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.shelterLocation, { color: colors.textSecondary }]}>{sh.locationName}</Text>

                <View style={[styles.shelterStats, { borderTopColor: colors.borderSoft }]}>
                  <View style={styles.shelterStatItem}>
                    <Users size={14} color={colors.textSecondary} />
                    <Text style={[styles.shelterStatVal, { color: colors.textPrimary }]}>
                      {sh.currentOccupancy} / {sh.capacity} Capacity
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.callShelterBtn, { backgroundColor: colors.subPanel, borderColor: colors.border }]}
                    onPress={() => handleCall(sh.contact)}
                  >
                    <PhoneCall size={14} color={colors.steelBlue} />
                    <Text style={[styles.callShelterText, { color: colors.steelBlue }]}>{sh.contact}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {selectedTab === 'helplines' && (
          <View style={styles.section}>
            {/* Toll-Free Emergency Hotlines */}
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginTop: 4 }]}>
              Toll-Free Emergency Hotlines
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Native emergency shortcodes for immediate multi-agency and district dispatch
            </Text>

            {EMERGENCY_CONTACTS.filter(c => c.category === 'Toll-Free Hotline').map((contact, index) => (
              <View
                key={index}
                style={[styles.contactCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
              >
                <View style={[styles.contactIconCircle, { backgroundColor: colors.dangerBg, borderColor: colors.dangerBorder }]}>
                  <PhoneCall size={20} color={colors.danger} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactTitle, { color: colors.textPrimary }]}>{contact.title}</Text>
                  <Text style={[styles.contactType, { color: colors.textSecondary }]}>{contact.type}</Text>
                  <View style={styles.numberBtnRow}>
                    {contact.number.split('/').map((subNum, sIdx) => {
                      const clean = subNum.trim();
                      return (
                        <TouchableOpacity
                          key={sIdx}
                          style={[styles.contactCallPill, { backgroundColor: colors.dangerBg, borderColor: colors.dangerBorder }]}
                          onPress={() => handleCall(clean)}
                          activeOpacity={0.8}
                        >
                          <PhoneCall size={12} color={colors.danger} />
                          <Text style={[styles.contactCallPillText, { color: colors.danger }]}>{clean}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>
            ))}

            {/* State Disaster Management Control Rooms */}
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginTop: 18 }]}>
              State Disaster Management Control Rooms
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Dedicated regional operations, rescue coordinates, and localized relief camp desks
            </Text>

            {EMERGENCY_CONTACTS.filter(c => c.category === 'State Control Room').map((contact, index) => (
              <View
                key={index}
                style={[styles.contactCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
              >
                <View style={[styles.contactIconCircle, { backgroundColor: colors.subPanel, borderColor: colors.border }]}>
                  <ShieldAlert size={20} color={colors.steelBlue} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactTitle, { color: colors.textPrimary }]}>{contact.title}</Text>
                  <Text style={[styles.contactType, { color: colors.textSecondary }]}>{contact.type}</Text>
                  <View style={styles.numberBtnRow}>
                    {contact.number.split('/').map((subNum, sIdx) => {
                      const clean = subNum.trim();
                      return (
                        <TouchableOpacity
                          key={sIdx}
                          style={[styles.contactCallPill, { backgroundColor: colors.subPanel, borderColor: colors.border }]}
                          onPress={() => handleCall(clean)}
                          activeOpacity={0.8}
                        >
                          <PhoneCall size={12} color={colors.steelBlue} />
                          <Text style={[styles.contactCallPillText, { color: colors.textPrimary }]}>{clean}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabSelector: {
    flexDirection: 'row',
    padding: 8,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    maxWidth: 960,
    alignSelf: 'center',
    width: '93%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '800',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 50,
    maxWidth: 960,
    alignSelf: 'center',
    width: '100%',
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  alertCard: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  alertBadgeRed: {
    fontSize: 13,
    fontWeight: '900',
  },
  alertBadgeOrange: {
    fontSize: 13,
    fontWeight: '900',
  },
  alertBadgeYellow: {
    fontSize: 13,
    fontWeight: '900',
  },
  alertTime: {
    marginLeft: 'auto',
    fontSize: 11,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 8,
  },
  alertBody: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  alertFooter: {
    borderTopWidth: 1,
    paddingTop: 10,
  },
  authorityTag: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  shelterCard: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  shelterTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  shelterName: {
    fontSize: 15,
    fontWeight: '900',
  },
  supplyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  supplyText: {
    fontSize: 10,
    fontWeight: '800',
  },
  shelterLocation: {
    fontSize: 12,
    marginBottom: 12,
  },
  shelterStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  shelterStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shelterStatVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  callShelterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  callShelterText: {
    fontSize: 12,
    fontWeight: '800',
  },
  contactCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  contactIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '900',
  },
  contactType: {
    fontSize: 11,
    marginTop: 2,
    marginBottom: 6,
  },
  numberBtnRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  contactCallPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  contactCallPillText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
