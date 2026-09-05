PROPOSED SOLUTION: Looney Logic
================================

IDEAS/PROTOTYPE OVERVIEW
-----------------------
- Mobile application built with Expo 57.0.20 + React Native 0.86.3
- Landslide detection and disaster monitoring system for Northeast India (NER)
- Modernized from legacy web application (legacy-web/ directory)
- Core functionality: AI-powered risk assessment, emergency reporting, GIS mapping

CORE AI/RISK ENGINE (services/aiEngine.js)
-----------------------------------------
- Function: calculateRisk(location, liveData = null)
- Input: location, live sensor data from Open-Meteo API
- Factor 1: Rainfall (24h sum)
  - > 100mm: +40 risk score
  - > 50mm: +20 risk score
  - Otherwise: no addition
- Factor 2: Soil Moisture (Volumetric Water Content)
  - > 0.4 VC: +40 risk score
  - > 0.3 VC: +20 risk score
  - Range: 0.0 to 0.5 (saturation)
- Fallback: if no live data, default +20 (moderate risk)
- Output: { level, score, color }
  - Critical: score >= 70, color: text-danger
  - High: score >= 40, color: text-warning
  - Moderate: score < 40, color: text-primary

MOCK SENSOR DATA (services/mockData.js)
--------------------------------------
- MOCK_SENSORS array with 5 sensors:
  * S-01: Shillong Peak Sensor
    - Type: soil_moisture
    - Location: [25.5788, 91.8933]
    - Value: 85, Threshold: 80
  * S-02: Gangtok Slope Monitor
    - Type: inclinometer
    - Location: [27.3314, 88.6138]
    - Value: 2.1, Threshold: 2.0
  * S-03: Guwahati Rainfall
    - Type: rain_gauge
    - Location: [26.1445, 91.7362]
    - Value: 120, Threshold: 100
  * S-04: Dibrugarh Flood Sensor
    - Type: water_level
    - Location: [27.4728, 94.9120]
    - Value: 104, Threshold: 105
  * S-05: Aizawl Fault Monitor
    - Type: extensometer
    - Location: [23.7271, 92.7176]
    - Value: 0.5, Threshold: 1.0

- MOCK_RISK_ZONES array (3 zones):
  * Z-01: East Khasi Hills
    - Center: [25.5788, 91.8933]
    - Risk level: high
    - Radius: 15000m
  * Z-02: Tawang Valley
    - Center: [27.5860, 91.8594]
    - Risk level: critical
    - Radius: 12000m
  * Z-03: Dima Hasao
    - Center: [25.1764, 93.0232]
    - Risk level: medium
    - Radius: 20000m

- HISTORICAL_LANDSLIDES array (2 events):
  * L-01: [27.3314, 88.6138], date: 2023-06-15, severity: high, impact: Road Blocked
  * L-02: [25.5788, 91.8933], date: 2024-05-10, severity: medium, impact: Minor Damage

- CURRENT_WEATHER object:
  - Temperature: 24°C
  - Humidity: 92%
  - Rainfall 24h: 115mm
  - Forecast: Heavy rainfall expected in next 48 hours
  - Alert level: Red

- CONNECTIVITY_STATUS array (3 routes):
  * NH-6 (Shillong - Silchar): Blocked - Landslide at Sonapur
  * NH-10 (Siliguri - Gangtok): Vulnerable - Heavy rainfall, slow movement
  * NH-29 (Dimapur - Kohima): Clear - Normal operations

API SERVICES (services/api.js)
------------------------------
- METEO_URL: Open-Meteo API endpoint
- EONET_URL: NASA EONET API endpoint
- NER_BBOX: '88.5,21.5,97.5,29.5' (North East India bounding box)

- fetchLiveTelemetry(lat, lon):
  - Calls: ${METEO_URL}?latitude={lat}&longitude={lon}&hourly=rain,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm&timezone=Asia%2FKolkata
  - Extracts: rain_24h_sum (sum of last 24 hours), current_rain, soil_moisture (0-1cm)
  - Returns object with: rain_24h_sum, current_rain, soil_moisture
  - Fallback: returns null on error

- fetchNasaEvents():
  - Calls: ${EONET_URL}?status=open&bbox=${NER_BBOX}&category=severeStorms,floods,landslides
  - Returns array of active natural events
  - Categories: severeStorms, floods, landslides

DASHBOARD SCREEN (app/(tabs)/index.tsx)
----------------------------------------
- Main screen with SOS/SAFE status broadcasting
- SOS handler: sets sosStatus to 'needs_help', logs location
- Safe handler: sets sosStatus to 'safe', logs status
- RiskMetrics component: displays AI risk level, 24h rainfall, soil moisture, sensor activity
- GISMap component: interactive map with risk zones, sensors, historical landslides, NASA events

SOS/SAFE FUNCTIONALITY:
- When sosStatus = 'triggered': Full-screen emergency alert
  - Shows: "Emergency Alert!" with danger styling
  - Buttons: SOS / NEED HELP, I am safe for now
  - Message: Status broadcast to disaster management officials via SMS
- When sosStatus = 'needs_help': Shows active SOS broadcast
  - Text: "SOS Broadcast Active", "Emergency teams have been dispatched"
- When sosStatus = 'safe': Shows safe status
  - Text: "Status: Safe", "Your safe status has been logged"
- Default: Shows "High Risk Area" warning with "Simulate Local Danger (Demo)" button

RISK METRICS COMPONENT (components/Dashboard/RiskMetrics.tsx)
-------------------------------------------------------------
- Uses useState for liveData and loading
- Fetches live telemetry for coordinates [25.5788, 91.8933] (Shillong)
- Calculates risk via calculateRisk('NER', liveData)
- Three main cards shown side-by-side:
  1. AI Risk Level card: Shows current level (Critical/High/Moderate) with alert triangle icon
  2. 24h Rainfall card: Shows rainfall in mm + current soil moisture reading
  3. Sensor Activity card: Shows count of active sensors
  4. Connectivity Status card: Shows road route statuses (Blocked/Vulnerable/Clear)
- Uses mockData CONNECTIVITY_STATUS for NH-6, NH-10 routes

GIS MAP COMPONENT (components/Map/GISMap.tsx)
---------------------------------------------
- Uses react-native-maps MapView with UrlTile (OpenTopoMap)
- Initial region: latitude 26.1445, longitude 91.7362 (Guwahati), delta 5.0
- Fetches NASA EONET events on mount
- Layers (top to bottom):
  1. UrlTile: OpenTopoMap base layer, mapType="none"
  2. Circle overlays: MOCK_RISK_ZONES (3 zones with color-coded borders/fills)
     - Critical: #ef4444/rgba(239,68,68,0.2)
     - High: #f59e0b/rgba(245,158,11,0.2)
     - Medium: #3b82f6/rgba(59,130,246,0.2)
  3. Markers for MOCK_SENSORS (5 sensors, pinColor:#3b82f6)
     - Each shows: name, type, reading value
     - Alert if value >= threshold: "(Alert!)"
  4. Markers for HISTORICAL_LANDSLIDES (2 events, pinColor:#ef4444)
     - Shows: date, severity, impact
  5. Markers for NASA EONET events
     - pinColor:#f97316
     - Shows: title, category
- Legend overlay in top-left corner showing:
  - Blue circle: Sensors
  - Red circle: Past Events
  - Orange circle: NASA Live

FIELD REPORT FORM (components/Reporting/FieldReportForm.tsx)
------------------------------------------------------------
- State management:
  * submitted: boolean (report submission status)
  * imageState: 'none' | 'analyzing' | 'verified' | 'rejected'
  * severity: 'Moderate' | 'High' | 'Critical'
- Image upload flow:
  1. User taps "Tap to upload photo" -> imageState = 'analyzing'
  2. After 2.5s: AI authenticity check (Math.random() > 0.1 = 90% verified)
  3. If verified: imageState = 'verified', submit button enables
  4. If rejected: imageState = 'rejected', user can retry
- Severity selection: Toggle buttons for Moderate/High/Critical
- Submit flow:
  1. User taps "Submit Incident Report" (only enabled when imageState === 'verified')
  2. 1s delay -> setSubmitted(true)
  3. 3s later -> reset form (submitted=false, imageState='none')
- Geo-tagged location: Auto-detected current location (Lat: 25.5788, Lng: 91.8933)
- Required: Geo-tagged photo for submission

THEME TOGGLE (components/Settings/ThemeToggle.tsx)
---------------------------------------------------
- Props: isDark, onToggle
- Uses react-native-reanimated shared values:
  * progress: 0 (light) to 1 (dark), animated with timing (400ms)
  * sunRotation: 0 to 360deg, withRepeat 15s linear infinite
  * moonTilt: sequence -10→10→0, withRepeat 5s linear infinite
- Animated background: interpolateColor progress [0,1] -> ['#73C0FC', '#183153']
  - Day: #73C0FC (light blue), Night: #183153 (dark blue)
- Animated sun: rotate based on sunRotation, opacity: 1 - progress
- Animated moon: rotate based on moonTilt, opacity: progress
- Switch thumb: translateX: progress.value * 30px (moves from left to right)
- UI structure:
  - Outer switch: width 64, height 34, borderRadius 30
  - Sun container (right): position absolute, right: 4
  - Moon container (left): position absolute, left: 5
  - Sun icon: Sun from lucide-react-native, fill #FFD43B
  - Moon icon: Moon from lucide-react-native, fill #73C0FC
  - Thumb: width 30, height 30, borderRadius 20, bg #e8e8e8, position absolute

SETTINGS SCREEN (app/(tabs)/settings.tsx)
-----------------------------------------
- State variables:
  * isDark: boolean (init true, toggled via ThemeToggle)
  * loading: boolean (for API calls)
  * avatarUrl: string | null (from Supabase profiles table)
  * birthdate: string (YYYY-MM-DD format)
- Profile section:
  - Avatar: Image from avatarUrl or UserX placeholder
  - Camera icon to pick image from library (expo-image-picker)
  - Birthdate TextInput (placeholder: "1990-01-01")
  - Save Profile button (primary bg, disabled during loading)
- Account Security section:
  - Reset Password: Supabase resetPasswordForEmail
  - Sign Out: supabase.auth.signOut()
  - Delete Account: Alert with notice about backend required
- Theme toggle in header: Animated sun/moon switch
- ScrollView with dark/light mode styling:
  - bg-background (dark) or bg-gray-100 (light)
  - Text colors switch based on isDark
  - Cards with bg-surface/10 or bg-white/50 depending on mode

AUTHENTICATION (app/auth.tsx)
------------------------------
- Supabase-based sign-in/sign-up system
- State: email, password, loading, isSignUp
- Functions:
  * signInWithEmail(): supabase.auth.signInWithPassword()
    - On success: router.replace('/(tabs)')
    - On error: Alert.alert('Error', error.message)
  * signUpWithEmail(): supabase.auth.signUp()
    - On success: Alert 'Check your email to verify your account!'
    - If data.session: router.replace('/(tabs)')
- UI: Flex-1 container, text inputs for email/password
- Buttons: Sign Up / Sign In (toggle between modes)
- Link: "Skip for now (Demo)" -> router.replace('/(tabs)')
- Supabase client imported from '../lib/supabase'

NAVIGATION STRUCTURE (app/_layout.tsx)
----------------------------------------
- Root layout with font loading (SpaceMono-Regular.ttf)
- useEffect for auth state management:
  * supabase.auth.getSession() on mount
  * supabase.auth.onAuthStateChange() for session updates
- Routing logic:
  * If no session && not in auth group -> router.replace('/auth')
  * If session && in auth group -> router.replace('/(tabs)')
- unstable_settings: { initialRouteName: '(tabs)' }
- ThemeProvider: DarkTheme if colorScheme='dark', else DefaultTheme
- Stack navigation with screens:
  * "(tabs)": Main dashboard (headerShown: false)
  * "auth": Authentication screen (modal presentation)
  * "modal": Generic modal screen

TAB LAYOUT (app/(tabs)/_layout.tsx)
------------------------------------
- 3 tabs using expo-router Tabs component:
  1. Dashboard (index): tabBarIcon = Home (lucide-react-native)
  2. Report: tabBarIcon = FileText (lucide-react-native)
  3. Settings: tabBarIcon = Settings (lucide-react-native)
- Styling:
  - tabBarBackground: #13131a
  - tabBarActiveTintColor: #3b82f6 (blue)
  - tabBarInactiveTintColor: #6b7280 (gray)
  - headerShown: false (hidden)
- Tab order: Dashboard -> Report -> Settings

LEGACY WEB PORT (legacy-web/ directory)
----------------------------------------
- Original React version of the application
- Being modernized to Expo 57 + React Native 0.86.3
- Header component referenced in app/(tabs)/index.tsx:6
- Contains original UI/components being ported to native
- Serves as historical reference for feature set

REFERENCE LINKS
---------------
- Open-Meteo API: https://open-meteo.com/
- NASA EONET API: https://eonet.gsfc.nasa.gov/api/v3/events
- Supabase Docs: https://supabase.com/docs
- React Native Maps: https://github.com/react-native-maps/react-native-maps
- Expo Router: https://expo.dev/router
- Space Mono Font: assets/fonts/SpaceMono-Regular.ttf
- Legacy web app: legacy-web/ directory
- Academic landslide research: Rainfall/soil moisture prediction thresholds
- Northeast India disaster management protocols