PROPOSED SOLUTION: Looney Logic

Idea/Prototype: A mobile application (Expo/React Native 0.86.3) that detects landslide risks in real-time using sensor data, weather APIs, and NASA satellite events for Northeast India. Provides risk assessment, emergency reporting, and interactive GIS mapping.

Detailed Explanation:
- AI-powered risk calculation combining 24h rainfall and soil moisture data from Open-Meteo API
- Risk levels: Critical (≥70), High (≥40), Moderate (<40) with color coding (text-danger/text-warning/text-primary)
- Interactive map showing risk zones, sensor networks, historical landslide locations, NASA EONET active events
- Field incident reporting with AI authenticity verification of geo-tagged photos (none → analyzing → verified/rejected)
- User authentication via Supabase with SOS/SAFE status broadcasting
- Theme toggle (dark/light) with animated sun/moon rotation/tilt using react-native-reanimated
- Real-time road condition monitoring (NH-6, NH-10, NH-29)

How It Addresses the Problem:
- Real-time monitoring of landslide triggers (rainfall >50mm/+20 risk, >100mm/+40 risk; soil moisture >0.3VC/+20, >0.4VC/+40)
- Early warning system for at-risk communities in Northeast India (NER bounding box: 88.5,21.5,97.5,29.5)
- Emergency response coordination via SOS functionality that broadcasts to disaster management officials
- Geo-tagged field reports with AI verification to prevent false alarms
- Road condition data for safe evacuation routing

Innovation and Uniqueness:
- Combines multiple data sources: local sensors, Open-Meteo weather API, NASA EONET satellite events
- First mobile-first landslide detection app for NER region with AI photo tampering verification
- Real-time risk calculation from live sensor data vs historical thresholds
- Integrated emergency SOS with status broadcasting to officials
- Animated UI with theme-aware design (sun/moon transitions using reanimated, 15s sun rotation, 5s moon tilt)
- Modernized from legacy web application (legacy-web directory) to Expo 57 + React Native 0.86.3

Feasibility Analysis:
- Technical: Expo 57.0.20 + React Native 0.86.3 proven stack; Supabase backend functional; Open-Meteo/NASA APIs accessible
- Data: Mock sensor data established (5 sensors: Shillong Peak, Gangtok Slope, Guwahati Rainfall, Dibrugarh Flood, Aizawl Fault); rainfall/soil moisture APIs working; NASA EONET events integrated
- Region-specific: Northeast India bounding box with 5 key locations pre-configured in mockData.js
- Team: Existing codebase with auth, mapping, reporting, AI engine, and settings already implemented
- Core risk calculation logic: aiEngine.js:3-27 with live data fallback

Potential Challenges and Risks:
- Sensor network deployment and maintenance in remote Northeast India areas
- API rate limits for real-time weather and satellite data (Open-Meteo, NASA EONET)
- AI model accuracy for photo tampering verification (FieldReportForm: Math.random() > 0.1 simulation)
- Internet connectivity gaps in mountainous regions of Northeast India
- User adoption in rural/affected communities

Strategies for Overcoming Challenges:
- Offline data caching with sync when connectivity restores (RiskMetrics useState + useEffect pattern)
- Fallback to historical data when live APIs unavailable (mockData.js MOCK_SENSORS, MOCK_RISK_ZONES)
- Continuous AI model training with user-reported data (FieldReportForm image verification loop)
- Partnerships with local disaster management authorities (Supabase profiles table)
- USSD/IVR fallback for areas with no smartphone access

Potential Impact on Target Audience:
- Direct: 50M+ people in Northeast India living in landslide-prone areas
- Indirect: Disaster management officials, evacuation teams, transportation departments
- Warning time: Hours ahead of potential landslide events based on rainfall/soil moisture thresholds
- Evacuation routing: Real-time road condition data (CONNECTIVITY_STATUS: NH-6/NH-10/NH-29 statuses)

Benefits:
- Social: Saves lives through early warnings; reduces evacuation panic; empowers communities with risk data
- Economic: Reduces property damage; lowers disaster response costs; protects infrastructure (NH-6/NH-10/NH-29)
- Environmental: Minimizes unnecessary land disturbance; supports sustainable land use planning

Reference / Research Work Links:
- Open-Meteo API documentation: https://open-meteo.com/
- NASA EONET API: https://eonet.gsfc.nasa.gov/api/v3/events
- Supabase authentication: https://supabase.com/docs
- React Native Maps: https://github.com/react-native-maps/react-native-maps
- Expo Router documentation: https://expo.dev/router
- Legacy web application (modernized from): legacy-web/ directory in codebase
- Space Mono font: assets/fonts/SpaceMono-Regular.ttf
- Academic research on landslide prediction using rainfall & soil moisture thresholds
- Disaster management protocols for Northeast India region

Core Technical Details (from codebase):

AI Risk Engine (services/aiEngine.js:3-27):
- calculateRisk(location, liveData) function
- Factor 1: Rainfall (24h sum) - >100mm: +40 risk, >50mm: +20 risk
- Factor 2: Soil Moisture (VC) - >0.4: +40 risk, >0.3: +20 risk
- Returns: { level: 'Critical'|'High'|'Moderate', score: number, color: 'text-danger'|'text-warning'|'text-primary' }

Mock Data (services/mockData.js:1-35):
- MOCK_SENSORS: 5 sensors with IDs, locations, types, values, thresholds
  - S-01: Shillong Peak Sensor (soil_moisture, value:85, threshold:80)
  - S-02: Gangtok Slope Monitor (inclinometer, value:2.1, threshold:2.0)
  - S-03: Guwahati Rainfall (rain_gauge, value:120, threshold:100)
  - S-04: Dibrugarh Flood Sensor (water_level, value:104, threshold:105)
  - S-05: Aizawl Fault Monitor (extensometer, value:0.5, threshold:1.0)
- MOCK_RISK_ZONES: 3 zones (East Khasi Hills, Tawang Valley, Dima Hasao)
- HISTORICAL_LANDSLIDES: 2 past events
- CURRENT_WEATHER: temperature:24, humidity:92, rainfall_24h:115mm, alert_level:'Red'
- CONNECTIVITY_STATUS: 3 routes (NH-6 Blocked, NH-10 Vulnerable, NH-29 Clear)

API Services (services/api.js:1-44):
- NER_BBOX: '88.5,21.5,97.5,29.5'
- fetchLiveTelemetry(lat, lon): Open-Meteo API for rain_24h_sum, soil_moisture
- fetchNasaEvents(): NASA EONET events within NER bounding box, categories: severeStorms,floods,landslides

Dashboard Components (app/(tabs)/index.tsx:1-117):
- SOS/SAFE status broadcasting
- RiskMetrics card with live telemetry
- GISMap integration
- Historical landslide markers, sensor markers, NASA event markers

Authentication (app/auth.tsx:1-84):
- Supabase sign-in/sign-up with email/password
- Session persistence via AsyncStorage
- Router redirect based on auth state

Settings (app/(tabs)/settings.tsx:1-199):
- ThemeToggle with animated sun/moon (reanimated useSharedValue, 15s rotation, 5s tilt)
- Profile management (avatar, birthdate)
- Password reset, sign-out, account deletion
- Supabase profiles table integration

Field Reporting (components/Reporting/FieldReportForm.tsx:1-175):
- Image authenticity verification flow: none → analyzing → verified/rejected
- AI scanning: Math.random() > 0.1 (90% verification rate)
- Severity selection: Moderate/High/Critical
- Geo-tagged photo submission with SMS notification

Map Components (components/Map/GISMap.tsx:1-127):
- UrlTile: OpenTopoMap tile layer
- Markers: sensors (pinColor:#3b82f6), historical landslides (pinColor:#ef4444), NASA events (pinColor:#f97316)
- Circle overlays for risk zones
- Legend overlay with sensor/Nasa/Events indicators

Theme System (components/Settings/ThemeToggle.tsx:1-132):
- Animated background color transition (progress.value: 0→1, #73C0FC → #183153)
- Sun rotation: 15s linear infinite
- Moon tilt: 5s sequence (-10→10→0) linear infinite
- Switch thumb: translateX based on progress value

Navigation (app/_layout.tsx:1-79):
- Root layout with font loading (SpaceMono-Regular.ttf)
- Supabase auth state management
- Redirects: unauthenticated → /auth, authenticated → /(tabs)
- ThemeProvider with DarkTheme/DefaultTheme

Tab Layout (app/(tabs)/_layout.tsx:1-39):
- 3 tabs: Dashboard (Home), Report, Settings
- Custom styling: #13131a background, #3b82f6 active tint
- lucide-react-native icons: Home, FileText, Settings

Legacy Web Port (legacy-web/ directory):
- Original React version of the application
- Being modernized to Expo/React Native stack
- Header component referenced in app/(tabs)/index.tsx line 6