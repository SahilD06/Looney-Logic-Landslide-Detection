# 🛡️ Rakshak NER — Landslide Early Warning & AI Disaster Shield

**Rakshak NER** is a Progressive Web Application (PWA) and Disaster Intelligence System built for real-time landslide early warning, geotechnical sensor monitoring, geotagged hazard incident reporting, and NDRF emergency response coordination across the North Eastern Region of India.

---

## 🌟 Key Features

### 1. 📡 Real-Time Telemetry & Spatial GIS Radar
- **Live Location Tracking**: Auto-detects user coordinates and reverse geocodes city/district (e.g. `📍 East Khasi Hills • Meghalaya`).
- **Open-Meteo Weather Integration**: Continuous 24h rainfall, precipitation rate, soil saturation, and relative humidity.
- **Interactive Spatial GIS Map**: Multi-layer Leaflet satellite and topographic maps with real-time hazard markers, active mudslides, and rainfall intensity contours.
- **High-Risk Highway Corridor Monitoring**: Status feeds for critical mountain arteries including **NH-10** (Sevoke–Gangtok), **NH-6** (Shillong–Silchar), **NH-29** (Dimapur–Kohima), and **NH-13** (Tawang).

### 2. 🤖 GeoShield AI Assistant (Google Gemini 2.5 Flash)
- **24/7 Disaster Intelligence**: Conversational assistance powered by Google Gemini API (`gemini-flash-latest`).
- **Domain Guardrails**: Specialized in geological safety, slope failure indicators, early warning signs, sensor interpretation, and evacuation protocols while strictly declining non-project queries.

### 3. 📷 Live Geotagged Camera Reporting & AI Verification
- **Live Camera Stream**: Strict camera-only photo capture with automatic GPS geotagging.
- **Dual AI Authenticity Verification**: Hugging Face Deepfake Vision + Google Gemini Multi-Modal Vision checks to eliminate false reports, screen captures, or non-landslide subjects.

### 4. 🔐 3-Tier Database Authentication (Supabase)
- **NDRF Command Administrator (`admin` / `admin`)**: Real-time database incident feed, live NDRF dispatch control, and sensor threshold alerts.
- **QA & Simulation Tester (`tester` / `tester`)**: Simulation Suite to trigger danger mode alarms, test monsoon rainfall injection, and stress-test risk models.
- **Citizen User (`user` / Google Sign-In)**: Clean disaster monitor with Google OAuth 2.0 and live emergency helplines.

---

## 🚀 Quick Start

### 1. Installation
```bash
# Clone repository
git clone https://github.com/SahilD06/Looney-Logic-Landslide-Detection.git
cd Looney-Logic-Landslide-Detection

# Install dependencies
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Web App / PWA
```bash
npm start
# or
npx expo start --web
```
Open `http://localhost:8082` (or `http://localhost:8081`) in any browser or mobile browser.

---

## 🗄️ Database Setup (Supabase)
Execute the SQL script in [`supabase_schema.sql`](./supabase_schema.sql) in your Supabase SQL Editor to initialize:
- `public.app_users` (role-assigned credentials: `admin`, `tester`, `user`)
- `public.incident_reports` (geotagged field reports with live sync)
- Row Level Security (RLS) public access policies

---

## 📞 Emergency Contacts
- **NDRF Disaster Helpline**: `1078`
- **National Emergency Response**: `112`
- **State Disaster Management Authority (SDMA)**: `1070`
- **Medical Emergency**: `108`
