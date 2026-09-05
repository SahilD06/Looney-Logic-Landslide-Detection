import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Header } from '../../components/Header';
import {
  Camera,
  MapPin,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Image as ImageIcon,
  Sparkles,
  Info,
} from 'lucide-react-native';

export default function FieldReportScreen() {
  const [locationName, setLocationName] = useState('Shillong Peak Bypass (NH-6)');
  const [incidentType, setIncidentType] = useState('Active Mudslide');
  const [severity, setSeverity] = useState<'Low' | 'Moderate' | 'High' | 'Critical'>('High');
  const [remarks, setRemarks] = useState('');
  const [imageState, setImageState] = useState<'none' | 'analyzing' | 'verified' | 'rejected'>('none');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const simulatePhotoUpload = () => {
    setImageState('analyzing');
    setTimeout(() => {
      // 95% pass rate for authenticity verification
      const passed = Math.random() > 0.08;
      setImageState(passed ? 'verified' : 'rejected');
    }, 1800);
  };

  const handleSubmit = () => {
    if (imageState !== 'verified') return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        setImageState('none');
        setRemarks('');
      }, 3500);
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerInfo}>
          <Text style={styles.screenTitle}>Ground Incident Reporting</Text>
          <Text style={styles.screenDesc}>
            Submit geotagged observations with AI Authenticity Scanning to prevent false alarms.
          </Text>
        </View>

        {submittedSuccess ? (
          <View style={styles.successCard}>
            <CheckCircle2 size={42} color="#10b981" />
            <Text style={styles.successTitle}>Report Successfully Dispatched!</Text>
            <Text style={styles.successDesc}>
              Incident logged under ID #NER-REP-2026-904. Geotag transmitted to State Disaster Emergency Response Team.
            </Text>
          </View>
        ) : (
          <View style={styles.formCard}>
            {/* GPS Location Tag */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location / Landmark</Text>
              <View style={styles.inputWithIcon}>
                <MapPin size={16} color="#38bdf8" />
                <TextInput
                  style={styles.textInput}
                  value={locationName}
                  onChangeText={setLocationName}
                  placeholder="Enter location or road stretch"
                  placeholderTextColor="#64748b"
                />
              </View>
              <Text style={styles.hint}>Auto-geocoded to GPS coordinates [25.5788° N, 91.8933° E]</Text>
            </View>

            {/* Incident Type Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Hazard Classification</Text>
              <View style={styles.chipRow}>
                {['Active Mudslide', 'Road Cracking', 'Rockfall Hazard', 'Retaining Wall Shift'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.typeChip, incidentType === type && styles.typeChipActive]}
                    onPress={() => setIncidentType(type)}
                  >
                    <Text style={[styles.typeChipText, incidentType === type && styles.typeChipTextActive]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Severity Level */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Severity Level</Text>
              <View style={styles.severityRow}>
                {(['Low', 'Moderate', 'High', 'Critical'] as const).map((lvl) => (
                  <TouchableOpacity
                    key={lvl}
                    style={[
                      styles.severityChip,
                      severity === lvl && {
                        backgroundColor:
                          lvl === 'Critical'
                            ? '#ef4444'
                            : lvl === 'High'
                            ? '#f97316'
                            : lvl === 'Moderate'
                            ? '#eab308'
                            : '#10b981',
                      },
                    ]}
                    onPress={() => setSeverity(lvl)}
                  >
                    <Text
                      style={[
                        styles.severityText,
                        severity === lvl && { color: '#ffffff', fontWeight: '800' },
                      ]}
                    >
                      {lvl}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* AI Authenticity Photo Verification Box */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Photo Verification</Text>
                <View style={styles.aiBadge}>
                  <Sparkles size={11} color="#38bdf8" />
                  <Text style={styles.aiBadgeText}>AI Authenticity Engine</Text>
                </View>
              </View>

              <View
                style={[
                  styles.uploadBox,
                  imageState === 'verified' && styles.uploadBoxVerified,
                  imageState === 'rejected' && styles.uploadBoxRejected,
                ]}
              >
                {imageState === 'none' && (
                  <TouchableOpacity style={styles.uploadTrigger} onPress={simulatePhotoUpload}>
                    <Camera size={28} color="#38bdf8" />
                    <Text style={styles.uploadTriggerTitle}>Take / Select Hazard Photo</Text>
                    <Text style={styles.uploadTriggerSub}>
                      Scans EXIF metadata & integrity to verify on-site capture
                    </Text>
                  </TouchableOpacity>
                )}

                {imageState === 'analyzing' && (
                  <View style={styles.stateCenter}>
                    <ActivityIndicator size="small" color="#38bdf8" style={{ marginBottom: 8 }} />
                    <Text style={styles.stateTitle}>Analyzing Image Integrity...</Text>
                    <Text style={styles.stateSub}>Checking EXIF geotags & detecting AI synthetic artifacts</Text>
                  </View>
                )}

                {imageState === 'verified' && (
                  <View style={styles.stateCenter}>
                    <ShieldCheck size={28} color="#10b981" />
                    <Text style={styles.verifiedTitle}>✓ Authenticity Verified</Text>
                    <Text style={styles.verifiedSub}>
                      Ground-level metadata verified. Timestamp matches local sensor clocks.
                    </Text>
                    <TouchableOpacity onPress={() => setImageState('none')} style={styles.reuploadBtn}>
                      <Text style={styles.reuploadText}>Change Photo</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {imageState === 'rejected' && (
                  <View style={styles.stateCenter}>
                    <AlertTriangle size={28} color="#ef4444" />
                    <Text style={styles.rejectedTitle}>Verification Failed</Text>
                    <Text style={styles.rejectedSub}>
                      Image failed authenticity scan (inconsistent metadata or AI generation detected).
                    </Text>
                    <TouchableOpacity onPress={simulatePhotoUpload} style={styles.retryBtn}>
                      <Text style={styles.retryText}>Try Another Photo</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            {/* Additional Remarks */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Observations & Blockage Details</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={remarks}
                onChangeText={setRemarks}
                placeholder="E.g., Boulders fallen on left lane, water seepage observed from upper slope..."
                placeholderTextColor="#64748b"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Submit Action */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                imageState !== 'verified' && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={imageState !== 'verified' || isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <UploadCloud size={16} color="#ffffff" />
                  <Text style={styles.submitButtonText}>Submit Incident Report</Text>
                </>
              )}
            </TouchableOpacity>
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
  headerInfo: {
    marginBottom: 12,
  },
  screenTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '800',
  },
  screenDesc: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
  },
  formCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  inputGroup: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  hint: {
    color: '#64748b',
    fontSize: 9,
    marginTop: 4,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 8,
  },
  textInput: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 12,
    paddingVertical: 10,
  },
  textArea: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#334155',
    minHeight: 70,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  typeChip: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  typeChipActive: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  typeChipText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
  },
  typeChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  severityRow: {
    flexDirection: 'row',
    gap: 6,
  },
  severityChip: {
    flex: 1,
    backgroundColor: '#1e293b',
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  severityText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  aiBadgeText: {
    color: '#38bdf8',
    fontSize: 9,
    fontWeight: '700',
  },
  uploadBox: {
    backgroundColor: '#131d33',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#334155',
    borderStyle: 'dashed',
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadBoxVerified: {
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderStyle: 'solid',
  },
  uploadBoxRejected: {
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderStyle: 'solid',
  },
  uploadTrigger: {
    alignItems: 'center',
  },
  uploadTriggerTitle: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
  },
  uploadTriggerSub: {
    color: '#64748b',
    fontSize: 9,
    marginTop: 2,
    textAlign: 'center',
  },
  stateCenter: {
    alignItems: 'center',
  },
  stateTitle: {
    color: '#e2e8f0',
    fontSize: 11,
    fontWeight: '700',
  },
  stateSub: {
    color: '#94a3b8',
    fontSize: 9,
    marginTop: 2,
  },
  verifiedTitle: {
    color: '#34d399',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },
  verifiedSub: {
    color: '#cbd5e1',
    fontSize: 9,
    marginTop: 2,
    textAlign: 'center',
  },
  reuploadBtn: {
    marginTop: 6,
    backgroundColor: '#064e3b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  reuploadText: {
    color: '#a7f3d0',
    fontSize: 9,
    fontWeight: '700',
  },
  rejectedTitle: {
    color: '#f87171',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },
  rejectedSub: {
    color: '#fca5a5',
    fontSize: 9,
    marginTop: 2,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 6,
    backgroundColor: '#7f1d1d',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  retryText: {
    color: '#fecaca',
    fontSize: 9,
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: '#0284c7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    marginTop: 6,
  },
  submitButtonDisabled: {
    backgroundColor: '#1e293b',
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  successCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#10b981',
    alignItems: 'center',
    gap: 8,
  },
  successTitle: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
  },
  successDesc: {
    color: '#94a3b8',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
});
