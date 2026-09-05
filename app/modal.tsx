import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ShieldAlert, PhoneCall, AlertTriangle, CheckCircle, Info, ExternalLink } from 'lucide-react-native';
import { EMERGENCY_CONTACTS } from '../services/mockData';

export default function EmergencyModal() {
  const handleCall = (num: string) => {
    const cleanNum = num.split('/')[0].trim();
    if (Platform.OS === 'web') {
      window.open(`tel:${cleanNum}`);
    } else {
      Linking.openURL(`tel:${cleanNum}`);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.shieldIcon}>
            <ShieldAlert size={28} color="#ef4444" />
          </View>
          <Text style={styles.title}>Disaster Response & Safety</Text>
          <Text style={styles.subtitle}>NDRF Landslide Protocol & Emergency Dispatch</Text>
        </View>

        {/* Immediate Action Checklist */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Immediate Action Checklist</Text>
          <View style={styles.checkItem}>
            <CheckCircle size={16} color="#10b981" />
            <Text style={styles.checkText}>Evacuate away from the path of mudflow or slope failure.</Text>
          </View>
          <View style={styles.checkItem}>
            <CheckCircle size={16} color="#10b981" />
            <Text style={styles.checkText}>Avoid valley bottoms, stream beds, and drainage ravines.</Text>
          </View>
          <View style={styles.checkItem}>
            <CheckCircle size={16} color="#10b981" />
            <Text style={styles.checkText}>Stay tuned to local NDRF radio & early warning broadcasts.</Text>
          </View>
          <View style={styles.checkItem}>
            <CheckCircle size={16} color="#10b981" />
            <Text style={styles.checkText}>Check on neighbors, elderly individuals, and stranded travelers.</Text>
          </View>
        </View>

        {/* 24x7 Helplines */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>24x7 Emergency Helplines</Text>
          {EMERGENCY_CONTACTS.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.contactRow}
              onPress={() => handleCall(item.number)}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.contactTitle}>{item.title}</Text>
                <Text style={styles.contactType}>{item.type}</Text>
              </View>
              <View style={styles.callBadge}>
                <PhoneCall size={12} color="#ffffff" />
                <Text style={styles.callBadgeText}>{item.number.split('/')[0]}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* About System */}
        <View style={styles.footerNote}>
          <Info size={14} color="#64748b" />
          <Text style={styles.footerText}>
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
    backgroundColor: '#090d16',
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 40,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  shieldIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 3,
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 14,
  },
  cardTitle: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 12,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 10,
  },
  checkText: {
    flex: 1,
    color: '#cbd5e1',
    fontSize: 12,
    lineHeight: 16,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  contactTitle: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '700',
  },
  contactType: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 1,
  },
  callBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc2626',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 4,
  },
  callBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 6,
    marginTop: 10,
  },
  footerText: {
    flex: 1,
    color: '#64748b',
    fontSize: 10,
    lineHeight: 14,
  },
});
