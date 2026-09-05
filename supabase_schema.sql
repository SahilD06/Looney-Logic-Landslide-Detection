-- =========================================================================
-- RAKSHAK NER - SUPABASE DATABASE SCHEMA & INITIAL USERS
-- Run this entire script in your Supabase Dashboard -> SQL Editor -> Run
-- =========================================================================

-- 1. Create app_users table (Handles Username/Password & Assigned Roles)
CREATE TABLE IF NOT EXISTS public.app_users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'tester')),
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create incident_reports table (Stores Verified Landslide Ground Incidents)
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
    status TEXT DEFAULT 'PENDING_REVIEW' CHECK (status IN ('PENDING_REVIEW', 'DISPATCHED_NDRF', 'RESOLVED', 'REJECTED')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable Row Level Security (RLS) and grant Anonymous Access
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;

-- Allow Public / Anon Read & Write Policies
DROP POLICY IF EXISTS "Allow public read app_users" ON public.app_users;
CREATE POLICY "Allow public read app_users" ON public.app_users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert app_users" ON public.app_users;
CREATE POLICY "Allow public insert app_users" ON public.app_users FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update app_users" ON public.app_users;
CREATE POLICY "Allow public update app_users" ON public.app_users FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public read incident_reports" ON public.incident_reports;
CREATE POLICY "Allow public read incident_reports" ON public.incident_reports FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert incident_reports" ON public.incident_reports;
CREATE POLICY "Allow public insert incident_reports" ON public.incident_reports FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update incident_reports" ON public.incident_reports;
CREATE POLICY "Allow public update incident_reports" ON public.incident_reports FOR UPDATE USING (true);

-- 4. Seed Initial Users (Admin, Tester, and Citizen)
INSERT INTO public.app_users (id, username, password, name, email, role, photo_url)
VALUES
    (
        'usr-adm-01',
        'admin',
        'admin',
        'admin',
        'admin@rakshak-ner.gov.in',
        'admin',
        ''
    ),
    (
        'usr-tst-01',
        'tester',
        'tester',
        'tester',
        'tester@rakshak-ner.dev',
        'tester',
        ''
    ),
    (
        'usr-cit-01',
        'user',
        'user',
        'user',
        'user@rakshak-ner.in',
        'user',
        ''
    )
ON CONFLICT (username) DO UPDATE SET
    password = EXCLUDED.password,
    role = EXCLUDED.role,
    name = EXCLUDED.name;

-- 5. Seed Initial Incident Reports for Command Center
INSERT INTO public.incident_reports (id, incident_type, severity, latitude, longitude, location_name, reported_by, reporter_email, reporter_role, remarks, hazard_confidence, is_authentic, status)
VALUES
    (
        'NER-REP-904211',
        'Active Mudslide',
        'CRITICAL',
        27.2415,
        88.5132,
        'NH-10 Km 29 (Sevoke - Gangtok)',
        'Rajesh Sharma (Field Officer)',
        'r.sharma@ndrf.gov.in',
        'admin',
        'Continuous soil slide across highway lanes. Debris depth approx 1.8m. Rain continuing.',
        98.4,
        true,
        'DISPATCHED_NDRF'
    ),
    (
        'NER-REP-904189',
        'Rockfall Hazard',
        'HIGH',
        30.1245,
        78.4312,
        'NH-58 Rishikesh - Devprayag Sector',
        'Anita Roy (Citizen Reporter)',
        'anita.roy@gmail.com',
        'user',
        'Multiple boulders on highway shoulder, single lane passable.',
        94.7,
        true,
        'PENDING_REVIEW'
    )
ON CONFLICT (id) DO NOTHING;
