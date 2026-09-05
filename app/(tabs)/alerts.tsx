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
  Navigation,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react-native';

export default function AlertsScreen() {
  const [selectedTab, setSelectedTab] = useState<'advisories' | 'shelters' | 'helplines'>('advisories');

  const handleCall = (number: string) => {
    const cleanNum = number.split('/')[0].trim();
    if (Platform.OS === 'web') {
      window.open(`tel:${cleanNum}`);
    } else {
      Linking.openURL(`tel:${cleanNum}`);
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'advisories' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('advisories')}
        >
          <AlertOctagon size={14} color={selectedTab === 'advisories' ? '#ffffff' : '#94a3b8'} />
          <Text style={[styles.tabButtonText, selectedTab === 'advisories' && styles.tabButtonTextActive]}>
            Early Warnings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'shelters' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('shelters')}
        >
          <Home size={14} color={selectedTab === 'shelters' ? '#ffffff' : '#94a3b8'} />
          <Text style={[styles.tabButtonText, selectedTab === 'shelters' && styles.tabButtonTextActive]}>
            Shelters
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'helplines' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('helplines')}
        >
          <PhoneCall size={14} color={selectedTab === 'helplines' ? '#ffffff' : '#94a3b8'} />
          <Text style={[styles.tabButtonText, selectedTab === 'helplines' && styles.tabButtonTextActive]}>
            Helplines
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {selectedTab === 'advisories' && (
          <View style={styles.section}>
            {/* Red Alert Card */}
            <View style={[styles.alertCard, styles.redAlert]}>
              <View style={styles.alertHeader}>
                <AlertOctagon size={18} color="#ef4444" />
                <Text style={styles.alertBadgeRed}>RED ALERT - LEVEL 4</Text>
                <Text style={styles.alertTime}>Issued 35 mins ago</Text>
              </View>
              <Text style={styles.alertTitle}>East Khasi & South Garo Hills Flash Warning</Text>
              <Text style={styles.alertBody}>
                Precipitation threshold exceeded (140mm / 24h). Critical instability detected in Sohra and Mawsynram slope cuts. Evacuation from unstable downhill settlements strongly advised.
              </Text>
              <View style={styles.alertFooter}>
                <Text style={styles.authorityTag}>Issued by IMD & State Disaster Management Authority</Text>
              </View>
            </View>

            {/* Orange Warning Card */}
            <View style={[styles.alertCard, styles.orangeAlert]}>
              <View style={styles.alertHeader}>
                <ShieldAlert size={18} color="#f97316" />
                <Text style={styles.alertBadgeOrange}>ORANGE WARNING - LEVEL 3</Text>
                <Text style={styles.alertTime}>Issued 2 hours ago</Text>
              </View>
              <Text style={styles.alertTitle}>Sikkim Highway NH-10 Mudflow Precaution</Text>
              <Text style={styles.alertBody}>
                Continuous seepage on 29th Mile and Teesta Valley roads. Heavy goods traffic restricted between 19:00 - 06:00. Use Lava - Algarah bypass if traveling.
              </Text>
              <View style={styles.alertFooter}>
                <Text style={styles.authorityTag}>BRO 144 Task Force Advisory</Text>
              </View>
            </View>

            {/* Yellow Watch Card */}
            <View style={[styles.alertCard, styles.yellowAlert]}>
              <View style={styles.alertHeader}>
                <Info size={18} color="#eab308" />
                <Text style={styles.alertBadgeYellow}>YELLOW WATCH - LEVEL 2</Text>
                <Text style={styles.alertTime}>Issued 5 hours ago</Text>
              </View>
              <Text style={styles.alertTitle}>Dima Hasao Railway Section Surveillance</Text>
              <Text style={styles.alertBody}>
                Inclinometer ground sensors showing 0.4mm slow creep. Engineering teams deployed for slope anchoring.
              </Text>
            </View>
          </View>
        )}

        {selectedTab === 'shelters' && (
          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>Designated Emergency Relief Camps & Safe Zones</Text>
            {EMERGENCY_SHELTERS.map((sh) => (
              <View key={sh.id} style={styles.shelterCard}>
                <View style={styles.shelterTop}>
                  <Text style={styles.shelterName}>{sh.name}</Text>
                  <View style={[styles.supplyBadge, { backgroundColor: sh.suppliesStatus === 'Adequate' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' }]}>
                    <Text style={[styles.supplyText, { color: sh.suppliesStatus === 'Adequate' ? '#34d399' : '#f87171' }]}>
                      Supplies: {sh.suppliesStatus}
                    </Text>
                  </View>
                </View>

                <Text style={styles.shelterLocation}>{sh.locationName}</Text>

                <View style={styles.shelterStats}>
                  <View style={styles.shelterStatItem}>
                    <Users size={12} color="#94a3b8" />
                    <Text style={styles.shelterStatVal}>
                      {sh.currentOccupancy} / {sh.capacity} Capacity
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.callShelterBtn}
                    onPress={() => handleCall(sh.contact)}
                  >
                    <PhoneCall size={12} color="#38bdf8" />
                    <Text style={styles.callShelterText}>{sh.contact}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {selectedTab === 'helplines' && (
          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>24x7 Quick-Dial Disaster Control Directory</Text>
            {EMERGENCY_CONTACTS.map((contact, index) => (
              <TouchableOpacity
                key={index}
                style={styles.contactCard}
                onPress={() => handleCall(contact.number)}
                activeOpacity={0.8}
              >
                <View style={styles.contactIconCircle}>
                  <PhoneCall size={18} color="#ef4444" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactTitle}>{contact.title}</Text>
                  <Text style={styles.contactType}>{contact.type}</Text>
                  <Text style={styles.contactNumber}>{contact.number}</Text>
                </View>
                <ChevronRight size={18} color="#64748b" />
              </TouchableOpacity>
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
    backgroundColor: '#090d16',
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    padding: 6,
    marginHorizontal: 14,
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    maxWidth: 900,
    alignSelf: 'center',
    width: '93%',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: '#0284c7',
  },
  tabButtonText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  tabButtonTextActive: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 40,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },
  section: {
    gap: 12,
  },
  sectionSubtitle: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  alertCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  redAlert: {
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  orangeAlert: {
    borderColor: '#f97316',
    backgroundColor: 'rgba(249, 115, 22, 0.08)',
  },
  yellowAlert: {
    borderColor: '#eab308',
    backgroundColor: 'rgba(234, 179, 8, 0.08)',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  alertBadgeRed: {
    color: '#ef4444',
    fontSize: 11,
    fontWeight: '900',
  },
  alertBadgeOrange: {
    color: '#f97316',
    fontSize: 11,
    fontWeight: '900',
  },
  alertBadgeYellow: {
    color: '#eab308',
    fontSize: 11,
    fontWeight: '900',
  },
  alertTime: {
    marginLeft: 'auto',
    color: '#64748b',
    fontSize: 10,
  },
  alertTitle: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 6,
  },
  alertBody: {
    color: '#cbd5e1',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 10,
  },
  alertFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 8,
  },
  authorityTag: {
    color: '#94a3b8',
    fontSize: 9,
    fontStyle: 'italic',
  },
  shelterCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  shelterTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  shelterName: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '800',
  },
  supplyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  supplyText: {
    fontSize: 9,
    fontWeight: '700',
  },
  shelterLocation: {
    color: '#94a3b8',
    fontSize: 11,
    marginBottom: 10,
  },
  shelterStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 8,
  },
  shelterStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shelterStatVal: {
    color: '#e2e8f0',
    fontSize: 11,
    fontWeight: '600',
  },
  callShelterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#131d33',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  callShelterText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '700',
  },
  contactCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '800',
  },
  contactType: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 1,
  },
  contactNumber: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
});
