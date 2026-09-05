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
  Lock,
  ArrowRight,
  UserCheck,
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { theme, colors, isDark } = useAppTheme();
  const {
    user,
    currentRole,
    isAuthenticated,
    isLoading,
    loginAsRole,
    loginWithCredentials,
    signInWithGoogle,
    signOut,
  } = useAuth();

  const [soundAlerts, setSoundAlerts] = useState(true);
  const [vibrationAlerts, setVibrationAlerts] = useState(true);
  const [offlineCache, setOfflineCache] = useState(true);

  // Authentication states
  const [isAuthMode, setIsAuthMode] = useState(false);
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
      setTimeout(() => {
        setAuthMessage('');
        setIsAuthMode(false);
      }, 800);
    } else {
      setAuthMessage(res.message || 'Invalid credentials');
    }
  };

  return (
    <View style={StyleSheet.flatten([styles.container, { backgroundColor: colors.bg }])}>
      <Header />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Screen Title */}
        <View style={styles.headerInfo}>
          <Text style={[styles.screenTitle, { color: colors.textPrimary }]}>
            {currentRole === 'admin'
              ? '🛡️ Admin Command Center'
              : currentRole === 'tester'
              ? '🧪 QA Tester Dashboard'
              : 'Citizen Settings & Profile'}
          </Text>
          <Text style={[styles.screenDesc, { color: colors.textSecondary }]}>
            {currentRole === 'admin'
              ? 'Real-time database incident feed, NDRF dispatch control, and system health.'
              : currentRole === 'tester'
              ? 'Simulate risk alarms, rainfall thresholds, and telemetry test controls.'
              : 'Manage siren alerts, app appearance, and citizen authentication.'}
          </Text>
        </View>

        {/* 1. AUTHENTICATION SECTION */}
        {(!isAuthenticated || isAuthMode) ? (
          /* LOGIN SCREEN */
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardHeaderIcon, { backgroundColor: colors.subPanel }]}>
                <Lock size={18} color={colors.steelBlue} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Sign In to Rakshak NER</Text>
                <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
                  Log in with Google or enter role-assigned credentials
                </Text>
              </View>
              {isAuthenticated && (
                <TouchableOpacity
                  style={[styles.cancelAuthBtn, { backgroundColor: colors.subPanel, borderColor: colors.border }]}
                  onPress={() => setIsAuthMode(false)}
                >
                  <Text style={[styles.cancelAuthText, { color: colors.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* OPTION 1: GOOGLE LOGIN */}
            <View style={styles.authOptionBox}>
              <Text style={[styles.authOptionTitle, { color: colors.textPrimary }]}>1. Quick Google Login</Text>
              <TouchableOpacity
                style={[styles.googleSignInBtn, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
                onPress={async () => {
                  await signInWithGoogle();
                }}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={colors.steelBlue} />
                ) : (
                  <>
                    <View style={styles.googleIconContainer}>
                      <Text style={styles.googleLetter}>G</Text>
                    </View>
                    <Text style={[styles.googleSignInText, { color: colors.textPrimary }]}>
                      Continue with Google Account
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* DIVIDER */}
            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textMuted, backgroundColor: colors.cardBg }]}>
                OR SIGN IN WITH USERNAME & PASSWORD
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            {/* OPTION 2: USERNAME & PASSWORD CREDENTIALS */}
            <View style={styles.authOptionBox}>
              <Text style={[styles.authOptionTitle, { color: colors.textPrimary }]}>
                2. Role-Assigned Database Login
              </Text>
              <Text style={[styles.authOptionDesc, { color: colors.textSecondary }]}>
                Logging in with <Text style={{ fontWeight: 'bold' }}>admin</Text> grants the Admin Command Center. Logging in with <Text style={{ fontWeight: 'bold' }}>tester</Text> grants the QA Tester Suite.
              </Text>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Username</Text>
                <TextInput
                  style={[styles.inputBox, { backgroundColor: colors.subPanel, color: colors.textPrimary, borderColor: colors.border }]}
                  placeholder="admin, tester, or user"
                  placeholderTextColor={colors.textMuted}
                  value={loginUsername}
                  onChangeText={setLoginUsername}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Password</Text>
                <TextInput
                  style={[styles.inputBox, { backgroundColor: colors.subPanel, color: colors.textPrimary, borderColor: colors.border }]}
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

              <TouchableOpacity
                style={[styles.primarySignInBtn, { backgroundColor: colors.steelBlue }]}
                onPress={handleCredentialLogin}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Text style={styles.primarySignInText}>Sign In</Text>
                    <ArrowRight size={16} color="#ffffff" />
                  </>
                )}
              </TouchableOpacity>

              {/* Quick Fill Presets */}
              <View style={styles.quickFillBox}>
                <Text style={[styles.quickFillLabel, { color: colors.textMuted }]}>Quick Fill Test Credentials:</Text>
                <View style={styles.quickFillRow}>
                  <TouchableOpacity
                    style={[styles.quickFillChip, { backgroundColor: colors.subPanel, borderColor: colors.dangerBorder }]}
                    onPress={() => {
                      setLoginUsername('admin');
                      setLoginPassword('admin');
                    }}
                  >
                    <Text style={[styles.quickFillChipText, { color: colors.danger }]}>🛡️ admin / admin</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.quickFillChip, { backgroundColor: colors.subPanel, borderColor: colors.warningBorder }]}
                    onPress={() => {
                      setLoginUsername('tester');
                      setLoginPassword('tester');
                    }}
                  >
                    <Text style={[styles.quickFillChipText, { color: colors.warning }]}>🧪 tester / tester</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.quickFillChip, { backgroundColor: colors.subPanel, borderColor: colors.successBorder }]}
                    onPress={() => {
                      setLoginUsername('user');
                      setLoginPassword('user');
                    }}
                  >
                    <Text style={[styles.quickFillChipText, { color: colors.success }]}>👤 user / user</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ) : (
          /* SIGNED IN USER PROFILE CARD */
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={styles.profileRow}>
              <Image source={{ uri: user?.photoUrl }} style={styles.avatar} />
              <View style={styles.profileInfoCol}>
                <View style={styles.profileNameRow}>
                  <Text style={[styles.profileName, { color: colors.textPrimary }]}>{user?.name}</Text>
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
                <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{user?.email}</Text>
                <Text style={[styles.profileRoleTitle, { color: colors.textMuted }]}>{user?.roleTitle}</Text>
              </View>

              <View style={styles.profileActions}>
                <TouchableOpacity
                  style={[styles.switchAccountBtn, { backgroundColor: colors.subPanel, borderColor: colors.border }]}
                  onPress={() => setIsAuthMode(true)}
                  activeOpacity={0.8}
                >
                  <RefreshCw size={13} color={colors.steelBlue} />
                  <Text style={[styles.switchAccountText, { color: colors.steelBlue }]}>Switch Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.signOutBtn, { backgroundColor: colors.dangerBg, borderColor: colors.dangerBorder }]}
                  onPress={() => signOut()}
                  activeOpacity={0.8}
                >
                  <LogOut size={13} color={colors.danger} />
                  <Text style={[styles.signOutText, { color: colors.danger }]}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* 2. ADMIN DASHBOARD & INCIDENT COMMAND CENTER (Only when logged in as admin) */}
        {currentRole === 'admin' && (
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.dangerBorder }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardHeaderIcon, { backgroundColor: colors.dangerBg }]}>
                <ShieldAlert size={18} color={colors.danger} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: colors.danger }]}>NDRF Incident Command Center</Text>
                <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
                  Live database reports ({adminReports.length} incidents logged)
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
                    <Text style={[styles.refreshText, { color: colors.steelBlue }]}>Refresh Feed</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Admin Stats Row */}
            <View style={styles.adminStatsRow}>
              <View style={[styles.adminStatCard, { backgroundColor: colors.subPanel, borderColor: colors.border }]}>
                <Text style={[styles.adminStatVal, { color: colors.danger }]}>2</Text>
                <Text style={[styles.adminStatLabel, { color: colors.textMuted }]}>Active Hazards</Text>
              </View>
              <View style={[styles.adminStatCard, { backgroundColor: colors.subPanel, borderColor: colors.border }]}>
                <Text style={[styles.adminStatVal, { color: colors.steelBlue }]}>NH-10</Text>
                <Text style={[styles.adminStatLabel, { color: colors.textMuted }]}>Critical Corridor</Text>
              </View>
              <View style={[styles.adminStatCard, { backgroundColor: colors.subPanel, borderColor: colors.border }]}>
                <Text style={[styles.adminStatVal, { color: colors.success }]}>1078</Text>
                <Text style={[styles.adminStatLabel, { color: colors.textMuted }]}>NDRF Hotline</Text>
              </View>
            </View>

            {/* Database Reports List */}
            <Text style={[styles.sectionSubtitle, { color: colors.textPrimary }]}>Live Database Incident Submissions:</Text>
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

        {/* 3. TESTER DASHBOARD & SIMULATION SUITE (Only when logged in as tester) */}
        {currentRole === 'tester' && (
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.warningBorder }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardHeaderIcon, { backgroundColor: colors.warningBg }]}>
                <FlaskConical size={18} color={colors.warning} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: colors.warning }]}>QA Tester Dashboard & Simulation Suite</Text>
                <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
                  Dev triggers & hazard simulation tools (Hidden from citizens)
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
                  Simulates critical slope failure across telemetry monitors and highway corridor maps.
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

        {/* 4. SUPABASE DATABASE SCHEMA */}
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardHeaderIcon, { backgroundColor: colors.subPanel }]}>
              <Database size={18} color={colors.steelBlue} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Supabase Real-Time Database</Text>
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
              <Text style={[styles.dbInfoLabel, { color: colors.textSecondary }]}>Auth & Role Table:</Text>
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
        </View>

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
                <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Emergency Audio Siren</Text>
              </View>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                Acoustic alarm when Red Alert landslide threshold is triggered.
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
                Preload offline terrain maps for areas with intermittent connectivity.
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
            Rakshak NER v1.5.0 • Supabase Database Active • Google Gemini 2.5 Flash Calibrated
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
  cancelAuthBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  cancelAuthText: {
    fontSize: 11,
    fontWeight: '700',
  },
  authOptionBox: {
    gap: 8,
    marginTop: 4,
  },
  authOptionTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  authOptionDesc: {
    fontSize: 11.5,
    lineHeight: 16,
    marginBottom: 4,
  },
  googleSignInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  googleIconContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EA4335',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleLetter: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
  googleSignInText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    paddingHorizontal: 6,
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  inputBox: {
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  authMessageText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  primarySignInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 6,
  },
  primarySignInText: {
    color: '#ffffff',
    fontSize: 13.5,
    fontWeight: '800',
  },
  quickFillBox: {
    marginTop: 10,
    gap: 6,
  },
  quickFillLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  quickFillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickFillChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  quickFillChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 14,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#6B7C98',
  },
  profileInfoCol: {
    flex: 1,
    minWidth: 200,
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  profileName: {
    fontSize: 16,
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
  profileRoleTitle: {
    fontSize: 11,
    marginTop: 1,
  },
  profileActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchAccountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  switchAccountText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  signOutText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  adminStatsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  adminStatCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  adminStatVal: {
    fontSize: 18,
    fontWeight: '900',
  },
  adminStatLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    marginTop: 2,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 10,
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
