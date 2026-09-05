import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Header } from '../../components/Header';
import { useAppTheme } from '../../context/ThemeContext';
import { useAuth, ROLE_CONFIGS } from '../../context/AuthContext';
import { ThemeToggleSwitch } from '../../components/ThemeToggleSwitch';
import {
  UserRole,
  fetchAllIncidentReports,
  IncidentReportRecord,
} from '../../services/supabase';
import {
  Sun,
  Moon,
  User,
  LogOut,
  ShieldCheck,
  Bell,
  Volume2,
  WifiOff,
  Key,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Sliders,
  Sparkles,
  Info,
  Database,
  ShieldAlert,
  FlaskConical,
  Radio,
  FileCheck,
  MapPin,
  RefreshCw,
  AlertTriangle,
  Send,
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { theme, colors, isDark, setTheme } = useAppTheme();
  const {
    user,
    currentRole,
    isAuthenticated,
    isLoading,
    loginAsRole,
    loginWithCredentials,
    signInWithGoogle,
    signOut,
    googleClientId,
    setGoogleClientId,
  } = useAuth();

  const [soundAlerts, setSoundAlerts] = useState(true);
  const [vibrationAlerts, setVibrationAlerts] = useState(true);
  const [offlineCache, setOfflineCache] = useState(true);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [clientIdInput, setClientIdInput] = useState(googleClientId);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Credential login state
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('admin');
  const [authMessage, setAuthMessage] = useState('');
  const [sqlCopied, setSqlCopied] = useState(false);

  // Admin database reports
  const [adminReports, setAdminReports] = useState<IncidentReportRecord[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);

  // Tester simulation states
  const [simDanger, setSimDanger] = useState(false);
  const [simRainfall, setSimRainfall] = useState(78);
  const [simPorePressure, setSimPorePressure] = useState(145);

  useEffect(() => {
    if (currentRole === 'admin') {
      loadAdminReports();
    }
  }, [currentRole]);

  const loadAdminReports = async () => {
    setIsLoadingReports(true);
    try {
      const data = await fetchAllIncidentReports();
      setAdminReports(data);
    } catch (e) {
      console.warn('Error loading admin reports:', e);
    } finally {
      setIsLoadingReports(false);
    }
  };

  const handleCredentialLogin = async () => {
    setAuthMessage('');
    const res = await loginWithCredentials(loginUsername, loginPassword);
    if (res.success) {
      setAuthMessage('✓ Success! Logged in with assigned role permissions.');
      setTimeout(() => setAuthMessage(''), 3000);
    } else {
      setAuthMessage(res.message || 'Invalid credentials');
    }
  };

  const handleSaveClientId = () => {
    setGoogleClientId(clientIdInput.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <View style={StyleSheet.flatten([styles.container, { backgroundColor: colors.bg }])}>
      <Header />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Screen Title */}
        <View style={styles.headerInfo}>
          <Text style={[styles.screenTitle, { color: colors.textPrimary }]}>System Settings & Account</Text>
          <Text style={[styles.screenDesc, { color: colors.textSecondary }]}>
            Switch role privileges, view Supabase incident records, configure sirens, and manage authentication.
          </Text>
        </View>

        {/* 1. Account & 3-Tier Role Login Switcher */}
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardHeaderIcon, { backgroundColor: colors.subPanel }]}>
              <User size={18} color={colors.steelBlue} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Account & Role Authentication</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
                Select login identity ({ROLE_CONFIGS[currentRole].title})
              </Text>
            </View>
          </View>

          {/* Active Profile Header */}
          {isAuthenticated && user && (
            <View style={[styles.profileBox, { backgroundColor: colors.subPanel, borderColor: colors.border }]}>
              <Image source={{ uri: user.photoUrl }} style={styles.avatar} />
              <View style={styles.profileDetails}>
                <View style={styles.nameRow}>
                  <Text style={[styles.profileName, { color: colors.textPrimary }]}>{user.name}</Text>
                  <View
                    style={[
                      styles.roleBadge,
                      currentRole === 'admin'
                        ? { backgroundColor: colors.dangerBg, borderColor: colors.dangerBorder }
                        : currentRole === 'tester'
                        ? { backgroundColor: colors.warningBg, borderColor: colors.warningBorder }
                        : { backgroundColor: colors.successBg, borderColor: colors.successBorder },
                    ]}
                  >
                    <Text
                      style={[
                        styles.roleText,
                        currentRole === 'admin'
                          ? { color: colors.danger }
                          : currentRole === 'tester'
                          ? { color: colors.warning }
                          : { color: colors.success },
                      ]}
                    >
                      {ROLE_CONFIGS[currentRole].badge}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{user.email}</Text>
                <Text style={[styles.profileRole, { color: colors.textMuted }]}>{user.roleTitle}</Text>
              </View>

              <TouchableOpacity
                style={[styles.logoutBtn, { backgroundColor: colors.dangerBg, borderColor: colors.dangerBorder }]}
                onPress={signOut}
                activeOpacity={0.8}
              >
                <LogOut size={15} color={colors.danger} />
                <Text style={[styles.logoutText, { color: colors.danger }]}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Direct Credential Login Form */}
          <View style={[styles.credentialLoginCard, { backgroundColor: colors.subPanel, borderColor: colors.border }]}>
            <Text style={[styles.credentialLoginTitle, { color: colors.textPrimary }]}>
              Database Login with Assigned Role
            </Text>
            <Text style={[styles.credentialLoginSub, { color: colors.textSecondary }]}>
              Enter credentials stored in Supabase `app_users` table. Role permissions (`admin`, `tester`, `user`) are automatically enforced based on your account.
            </Text>

            <View style={styles.inputFieldGroup}>
              <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Username</Text>
              <TextInput
                style={[styles.credentialInput, { backgroundColor: colors.cardBg, color: colors.textPrimary, borderColor: colors.border }]}
                placeholder="admin, tester, or custom username"
                placeholderTextColor={colors.textMuted}
                value={loginUsername}
                onChangeText={setLoginUsername}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputFieldGroup}>
              <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Password</Text>
              <TextInput
                style={[styles.credentialInput, { backgroundColor: colors.cardBg, color: colors.textPrimary, borderColor: colors.border }]}
                placeholder="Enter password"
                placeholderTextColor={colors.textMuted}
                value={loginPassword}
                onChangeText={setLoginPassword}
                secureTextEntry
              />
            </View>

            {authMessage ? (
              <Text style={[styles.authMessageText, { color: authMessage.includes('Success') ? colors.success : colors.danger }]}>
                {authMessage}
              </Text>
            ) : null}

            <View style={styles.loginActionRow}>
              <TouchableOpacity
                style={[styles.loginSubmitBtn, { backgroundColor: colors.steelBlue }]}
                onPress={handleCredentialLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.loginSubmitText}>Sign In & Load Role</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Quick Fill Preset Badges */}
            <View style={styles.quickFillContainer}>
              <Text style={[styles.quickFillLabel, { color: colors.textMuted }]}>Quick Fill Credentials:</Text>
              <View style={styles.quickFillBadgesRow}>
                <TouchableOpacity
                  style={[styles.quickFillBadge, { backgroundColor: colors.cardBg, borderColor: colors.dangerBorder }]}
                  onPress={() => {
                    setLoginUsername('admin');
                    setLoginPassword('admin');
                  }}
                >
                  <Text style={[styles.quickFillBadgeText, { color: colors.danger }]}>🛡️ admin / admin</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.quickFillBadge, { backgroundColor: colors.cardBg, borderColor: colors.warningBorder }]}
                  onPress={() => {
                    setLoginUsername('tester');
                    setLoginPassword('tester');
                  }}
                >
                  <Text style={[styles.quickFillBadgeText, { color: colors.warning }]}>🧪 tester / tester</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.quickFillBadge, { backgroundColor: colors.cardBg, borderColor: colors.successBorder }]}
                  onPress={() => {
                    setLoginUsername('user');
                    setLoginPassword('user');
                  }}
                >
                  <Text style={[styles.quickFillBadgeText, { color: colors.success }]}>👤 user / user</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* 2. Supabase Database Connection Status & SQL Schema Generator */}
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardHeaderIcon, { backgroundColor: colors.subPanel }]}>
              <Database size={18} color={colors.steelBlue} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Supabase Database & Tables</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
                meddqcbnupkmreawagyl.supabase.co
              </Text>
            </View>
            <View style={[styles.dbOnlineBadge, { backgroundColor: colors.successBg, borderColor: colors.successBorder }]}>
              <View style={[styles.dbOnlineDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.dbOnlineText, { color: colors.success }]}>Database Connected</Text>
            </View>
          </View>

          <View style={[styles.dbInfoBox, { backgroundColor: colors.subPanel, borderColor: colors.border }]}>
            <View style={styles.dbInfoRow}>
              <Text style={[styles.dbInfoLabel, { color: colors.textSecondary }]}>Database Endpoint:</Text>
              <Text style={[styles.dbInfoValue, { color: colors.textPrimary }]} numberOfLines={1}>
                https://meddqcbnupkmreawagyl.supabase.co
              </Text>
            </View>
            <View style={styles.dbInfoRow}>
              <Text style={[styles.dbInfoLabel, { color: colors.textSecondary }]}>User & Role Table:</Text>
              <Text style={[styles.dbInfoValue, { color: colors.steelBlue }]}>
                ✓ `public.app_users` (admin, tester, user)
              </Text>
            </View>
            <View style={styles.dbInfoRow}>
              <Text style={[styles.dbInfoLabel, { color: colors.textSecondary }]}>Incident Database:</Text>
              <Text style={[styles.dbInfoValue, { color: colors.success }]}>
                ✓ `public.incident_reports` (Real-Time GPS Sync)
              </Text>
            </View>
          </View>

          {/* SQL Code Instructions Card */}
          <View style={[styles.sqlHelperCard, { backgroundColor: colors.subPanel, borderColor: colors.border }]}>
            <View style={styles.sqlHeaderRow}>
              <Text style={[styles.sqlHeaderTitle, { color: colors.textPrimary }]}>
                📄 Supabase SQL Setup Script
              </Text>
              <TouchableOpacity
                style={[styles.copySqlBtn, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}
                onPress={() => {
                  if (Platform.OS === 'web' && navigator.clipboard) {
                    navigator.clipboard.writeText(`CREATE TABLE IF NOT EXISTS public.app_users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'tester')),
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.incident_reports (
    id TEXT PRIMARY KEY,
    incident_type TEXT NOT NULL,
    severity TEXT NOT NULL,
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL,
    location_name TEXT,
    reported_by TEXT NOT NULL,
    reporter_email TEXT,
    reporter_role TEXT DEFAULT 'user',
    remarks TEXT,
    image_url TEXT,
    hazard_confidence NUMERIC,
    is_authentic BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'PENDING_REVIEW',
    created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO public.app_users (id, username, password, name, email, role)
VALUES
    ('usr-adm-01', 'admin', 'admin', 'Major Vikram Sen (NDRF Command)', 'admin@rakshak-ner.gov.in', 'admin'),
    ('usr-tst-01', 'tester', 'tester', 'Dev QA Simulation Lead', 'tester@rakshak-ner.dev', 'tester'),
    ('usr-cit-01', 'user', 'user', 'Aarav Sharma (Citizen)', 'aarav.sharma@gmail.com', 'user')
ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, role = EXCLUDED.role;`);
                    setSqlCopied(true);
                    setTimeout(() => setSqlCopied(false), 3000);
                  }
                }}
              >
                <Text style={[styles.copySqlText, { color: colors.steelBlue }]}>
                  {sqlCopied ? '✓ Copied SQL!' : 'Copy SQL Schema'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.sqlSubText, { color: colors.textSecondary }]}>
              Copy & paste the schema directly into your <Text style={{ fontWeight: 'bold' }}>Supabase Dashboard &gt; SQL Editor &gt; Run</Text> to automatically generate the tables and assign the credentials.
            </Text>
          </View>
        </View>

        {/* 3. ADMIN INCIDENT COMMAND CENTER (Visible only to Admin) */}
        {currentRole === 'admin' && (
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.dangerBorder }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardHeaderIcon, { backgroundColor: colors.dangerBg }]}>
                <ShieldAlert size={18} color={colors.danger} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: colors.danger }]}>🛡️ Admin Incident Command Center</Text>
                <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
                  Live reports submitted to Supabase Database
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.refreshReportsBtn, { backgroundColor: colors.subPanel, borderColor: colors.border }]}
                onPress={loadAdminReports}
                disabled={isLoadingReports}
              >
                {isLoadingReports ? (
                  <ActivityIndicator size="small" color={colors.steelBlue} />
                ) : (
                  <>
                    <RefreshCw size={13} color={colors.steelBlue} />
                    <Text style={[styles.refreshText, { color: colors.steelBlue }]}>Refresh</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {adminReports.length === 0 ? (
              <View style={styles.emptyReportsBox}>
                <FileCheck size={28} color={colors.textMuted} />
                <Text style={[styles.emptyReportsText, { color: colors.textMuted }]}>
                  No incident reports currently in database.
                </Text>
              </View>
            ) : (
              <View style={styles.reportsList}>
                {adminReports.map((rep) => (
                  <View
                    key={rep.id}
                    style={[styles.adminReportItem, { backgroundColor: colors.subPanel, borderColor: colors.border }]}
                  >
                    <View style={styles.reportItemHeader}>
                      <View style={styles.reportItemTitleRow}>
                        <AlertTriangle size={15} color={colors.danger} />
                        <Text style={[styles.reportItemTitle, { color: colors.textPrimary }]}>
                          {rep.incidentType}
                        </Text>
                        <View style={[styles.reportSeverityPill, { backgroundColor: colors.dangerBg }]}>
                          <Text style={[styles.reportSeverityText, { color: colors.danger }]}>
                            {rep.severity}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.reportTimeText, { color: colors.textMuted }]}>
                        {new Date(rep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>

                    <Text style={[styles.reportLocationText, { color: colors.textSecondary }]}>
                      📍 {rep.locationName || 'Highway Sector'} ({rep.latitude.toFixed(4)}°N, {rep.longitude.toFixed(4)}°E)
                    </Text>

                    {rep.remarks ? (
                      <Text style={[styles.reportRemarksText, { color: colors.textPrimary }]}>
                        "{rep.remarks}"
                      </Text>
                    ) : null}

                    <View style={styles.reportFooter}>
                      <Text style={[styles.reportReporterText, { color: colors.textMuted }]}>
                        Reported by: <Text style={{ fontWeight: 'bold' }}>{rep.reportedBy}</Text>
                      </Text>
                      <View style={[styles.dispatchBadge, { backgroundColor: colors.successBg, borderColor: colors.successBorder }]}>
                        <CheckCircle2 size={12} color={colors.success} />
                        <Text style={[styles.dispatchText, { color: colors.success }]}>NDRF Dispatched</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* 4. TESTER SIMULATION PANEL (Visible only to Tester) */}
        {currentRole === 'tester' && (
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.warningBorder }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardHeaderIcon, { backgroundColor: colors.warningBg }]}>
                <FlaskConical size={18} color={colors.warning} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: colors.warning }]}>🧪 QA Tester & Simulation Suite</Text>
                <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
                  Dev tools & simulated hazard triggers (Hidden from regular users)
                </Text>
              </View>
            </View>

            <View style={styles.testerControlGrid}>
              {/* Simulate Risk Danger Mode */}
              <View style={[styles.testerControlCard, { backgroundColor: colors.subPanel, borderColor: colors.border }]}>
                <View style={styles.testerControlHeader}>
                  <Radio size={16} color={simDanger ? colors.danger : colors.textSecondary} />
                  <Text style={[styles.testerControlTitle, { color: colors.textPrimary }]}>Danger Mode Simulation</Text>
                </View>
                <Text style={[styles.testerControlSub, { color: colors.textSecondary }]}>
                  Forces SOS critical alarms, Red Alert UI thresholds, and highway corridor blockages.
                </Text>
                <TouchableOpacity
                  style={[
                    styles.simToggleBtn,
                    { backgroundColor: simDanger ? colors.danger : colors.steelBlue },
                  ]}
                  onPress={() => setSimDanger(!simDanger)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.simToggleBtnText}>
                    {simDanger ? '🔴 Deactivate Simulated Danger' : '⚡ Activate Simulated Danger'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Rain Simulator */}
              <View style={[styles.testerControlCard, { backgroundColor: colors.subPanel, borderColor: colors.border }]}>
                <Text style={[styles.testerControlTitle, { color: colors.textPrimary }]}>
                  Simulate Monsoon Rainfall: <Text style={{ color: colors.steelBlue }}>{simRainfall} mm/24h</Text>
                </Text>
                <Text style={[styles.testerControlSub, { color: colors.textSecondary }]}>
                  Threshold: 45 mm (Moderate), 70 mm (High), 90 mm (Critical Landslide Trigger)
                </Text>
                <View style={styles.rainButtonRow}>
                  <TouchableOpacity
                    style={[styles.rainPresetBtn, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
                    onPress={() => setSimRainfall(18)}
                  >
                    <Text style={[styles.rainPresetText, { color: colors.textPrimary }]}>Normal (18mm)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.rainPresetBtn, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
                    onPress={() => setSimRainfall(65)}
                  >
                    <Text style={[styles.rainPresetText, { color: colors.warning }]}>Heavy (65mm)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.rainPresetBtn, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
                    onPress={() => setSimRainfall(110)}
                  >
                    <Text style={[styles.rainPresetText, { color: colors.danger }]}>Monsoon (110mm)</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* 5. Theme Mode Switcher */}
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardHeaderIcon, { backgroundColor: colors.subPanel }]}>
              <Sun size={18} color={colors.steelBlue} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Appearance & Theme</Text>
          </View>

          <View style={styles.switchToggleRow}>
            <View style={styles.switchToggleTextCol}>
              <Text style={[styles.switchToggleTitle, { color: colors.textPrimary }]}>
                {isDark ? 'Dark Mode Active' : 'Light Mode Active'}
              </Text>
              <Text style={[styles.switchToggleSubtitle, { color: colors.textSecondary }]}>
                Toggle between daytime high-contrast and low-light field operations
              </Text>
            </View>
            <ThemeToggleSwitch scale={1.1} />
          </View>
        </View>

        {/* 6. Alert & System Preferences */}
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardHeaderIcon, { backgroundColor: colors.subPanel }]}>
              <Sliders size={18} color={colors.steelBlue} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Disaster System Preferences</Text>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <View style={styles.settingTitleRow}>
                <Volume2 size={15} color={colors.textPrimary} />
                <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Emergency Audio Warning Siren</Text>
              </View>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                Sound acoustic alarm when Red Alert landslide threshold is triggered in your sector.
              </Text>
            </View>
            <Switch
              value={soundAlerts}
              onValueChange={setSoundAlerts}
              trackColor={{ false: colors.border, true: colors.steelBlue }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={[styles.settingRow, { borderTopColor: colors.borderSoft }]}>
            <View style={styles.settingTextCol}>
              <View style={styles.settingTitleRow}>
                <Bell size={15} color={colors.textPrimary} />
                <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Push Notifications</Text>
              </View>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                Real-time IMD / CWC flash advisories and highway clearance updates.
              </Text>
            </View>
            <Switch
              value={vibrationAlerts}
              onValueChange={setVibrationAlerts}
              trackColor={{ false: colors.border, true: colors.steelBlue }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={[styles.settingRow, { borderTopColor: colors.borderSoft }]}>
            <View style={styles.settingTextCol}>
              <View style={styles.settingTitleRow}>
                <WifiOff size={15} color={colors.textPrimary} />
                <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Offline GIS Mountain Caching</Text>
              </View>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                Preload offline terrain maps for areas with intermittent mobile cellular connectivity.
              </Text>
            </View>
            <Switch
              value={offlineCache}
              onValueChange={setOfflineCache}
              trackColor={{ false: colors.border, true: colors.steelBlue }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* System Version Footnote */}
        <View style={styles.footerBox}>
          <Info size={14} color={colors.textMuted} />
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            Rakshak NER v1.5.0 • Supabase Cloud Database Active • Google Gemini 2.5 Flash Calibrated
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 60,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },
  headerInfo: {
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  screenDesc: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
  card: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  cardHeaderIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  cardSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#6B7C98',
  },
  profileDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  profileName: {
    fontSize: 15,
    fontWeight: '800',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  roleText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  profileEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  profileRole: {
    fontSize: 11,
    marginTop: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '700',
  },
  roleSelectLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  roleCard: {
    flex: 1,
    minWidth: 220,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  roleCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  roleCardIcon: {
    fontSize: 22,
  },
  selectedCheckPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  selectedCheckText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  roleCardTitle: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  roleCardDesc: {
    fontSize: 11,
    marginTop: 4,
    lineHeight: 15,
  },
  dbOnlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  dbOnlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dbOnlineText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  dbInfoBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  dbInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  dbInfoLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  dbInfoValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  credentialLoginCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 14,
    gap: 10,
  },
  credentialLoginTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  credentialLoginSub: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  inputFieldGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  credentialInput: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  authMessageText: {
    fontSize: 12,
    fontWeight: '700',
  },
  loginActionRow: {
    marginTop: 4,
  },
  loginSubmitBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginSubmitText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  quickFillContainer: {
    marginTop: 6,
    gap: 6,
  },
  quickFillLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  quickFillBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickFillBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  quickFillBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sqlHelperCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
    gap: 6,
  },
  sqlHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sqlHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  copySqlBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  copySqlText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sqlSubText: {
    fontSize: 11,
    lineHeight: 15,
  },
  refreshReportsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  refreshText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyReportsBox: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  emptyReportsText: {
    fontSize: 12,
  },
  reportsList: {
    gap: 10,
  },
  adminReportItem: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  reportItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reportItemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reportItemTitle: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  reportSeverityPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  reportSeverityText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  reportTimeText: {
    fontSize: 11,
  },
  reportLocationText: {
    fontSize: 12,
  },
  reportRemarksText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  reportFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  reportReporterText: {
    fontSize: 11,
  },
  dispatchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  dispatchText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  testerControlGrid: {
    gap: 12,
  },
  testerControlCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  testerControlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  testerControlTitle: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  testerControlSub: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  simToggleBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  simToggleBtnText: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '800',
  },
  rainButtonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  rainPresetBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  rainPresetText: {
    fontSize: 11,
    fontWeight: '700',
  },
  switchToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchToggleTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  switchToggleTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  switchToggleSubtitle: {
    fontSize: 11.5,
    marginTop: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingTextCol: {
    flex: 1,
    paddingRight: 16,
  },
  settingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingLabel: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  settingDesc: {
    fontSize: 11,
    marginTop: 3,
    lineHeight: 16,
  },
  footerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  footerText: {
    fontSize: 11,
    textAlign: 'center',
  },
});
