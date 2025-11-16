-- =============================================
-- LAND ADMINISTRATION SYSTEM - NAMESPACED SCHEMA
-- =============================================
-- This creates all tables in a dedicated 'land_admin' schema
-- to avoid conflicts with other subsystems
-- =============================================

-- Enable PostGIS for GIS functionality (global)
-- Note: UUID generation uses gen_random_uuid() which is built-in to PostgreSQL 13+
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create dedicated schema for Land Administration
CREATE SCHEMA IF NOT EXISTS land_admin;

-- Set search path to include our schema
SET search_path TO land_admin, public;

-- Grant usage on schema
GRANT USAGE ON SCHEMA land_admin TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA land_admin TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA land_admin TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA land_admin TO postgres, anon, authenticated, service_role;

-- =============================================
-- ENUM TYPES (in land_admin schema)
-- =============================================

CREATE TYPE land_admin.user_role AS ENUM ('admin', 'land_officer', 'applicant', 'land_board_member', 'viewer');

CREATE TYPE land_admin.application_status AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'pending_land_board',
  'approved',
  'rejected',
  'on_hold',
  'requires_revision'
);

CREATE TYPE land_admin.application_type AS ENUM (
  'business_commercial',
  'business_industrial',
  'residential_high',
  'residential_medium',
  'residential_low',
  'agricultural',
  'pastoral',
  'mission',
  'special_purpose',
  'urban_development',
  'renewal',
  'subdivision',
  'consolidation',
  'license',
  'rent_reduction'
);

CREATE TYPE land_admin.lease_status AS ENUM ('active', 'expired', 'terminated', 'pending_renewal', 'forfeited');

CREATE TYPE land_admin.parcel_status AS ENUM ('available', 'leased', 'reserved', 'under_review', 'unavailable');

CREATE TYPE land_admin.meeting_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled', 'postponed');

CREATE TYPE land_admin.decision_type AS ENUM ('approved', 'rejected', 'deferred', 'requires_revision');

CREATE TYPE land_admin.financing_method AS ENUM ('savings', 'bank_loan', 'housing_scheme', 'posf', 'nasfund', 'other');

CREATE TYPE land_admin.applicant_category AS ENUM ('individual', 'company', 'government');

-- =============================================
-- CORE TABLES (in land_admin schema)
-- =============================================

-- User Profiles (extends Supabase auth.users)
CREATE TABLE land_admin.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role land_admin.user_role NOT NULL DEFAULT 'applicant',
  department TEXT,
  phone TEXT,
  postal_address TEXT,
  province TEXT,
  district TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Provinces Reference Table
CREATE TABLE land_admin.provinces (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert PNG Provinces
INSERT INTO land_admin.provinces (code, name) VALUES
  ('NCD', 'National Capital District'),
  ('CPK', 'Central Province'),
  ('GPK', 'Gulf Province'),
  ('MBP', 'Milne Bay Province'),
  ('NPP', 'Oro Province'),
  ('SHP', 'Southern Highlands'),
  ('WPD', 'Western Province'),
  ('EHG', 'Eastern Highlands'),
  ('MPL', 'Morobe Province'),
  ('MPM', 'Madang Province'),
  ('ESW', 'East Sepik Province'),
  ('SAN', 'Sandaun Province'),
  ('MRL', 'Manus Province'),
  ('NIK', 'New Ireland Province'),
  ('EBR', 'East New Britain'),
  ('WBK', 'West New Britain'),
  ('NSB', 'Bougainville');

-- Land Parcels
CREATE TABLE land_admin.land_parcels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  province_id INTEGER REFERENCES land_admin.provinces(id),
  district TEXT,
  location_description TEXT NOT NULL,
  area_hectares DECIMAL(10,4),
  area_sqm DECIMAL(12,2),
  coordinates GEOGRAPHY(POINT, 4326),
  boundaries GEOGRAPHY(POLYGON, 4326),
  status land_admin.parcel_status NOT NULL DEFAULT 'available',
  parcel_type land_admin.application_type,
  valuation_amount DECIMAL(15,2),
  valuation_date DATE,
  last_survey_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications
CREATE TABLE land_admin.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_number TEXT UNIQUE NOT NULL,
  applicant_id UUID REFERENCES land_admin.profiles(id),

  -- Application Details
  application_type land_admin.application_type NOT NULL,
  status land_admin.application_status NOT NULL DEFAULT 'draft',
  submitted_at TIMESTAMPTZ,

  -- Applicant Information
  applicant_category land_admin.applicant_category NOT NULL,
  company_name TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  postal_address TEXT NOT NULL,

  -- Land Details
  parcel_id UUID REFERENCES land_admin.land_parcels(id),
  province_id INTEGER REFERENCES land_admin.provinces(id),
  district TEXT,
  location_description TEXT NOT NULL,
  area_requested DECIMAL(10,4),
  lease_duration_years INTEGER,

  -- Purpose
  intended_use TEXT NOT NULL,
  development_description TEXT,

  -- Financial Details
  financing_method land_admin.financing_method,
  estimated_development_value DECIMAL(15,2),

  -- Processing
  assigned_officer_id UUID REFERENCES land_admin.profiles(id),
  land_board_meeting_id UUID,
  decision_date DATE,
  decision_notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Application Documents
CREATE TABLE land_admin.application_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES land_admin.applications(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES land_admin.profiles(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leases
CREATE TABLE land_admin.leases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lease_number TEXT UNIQUE NOT NULL,
  application_id UUID REFERENCES land_admin.applications(id),
  parcel_id UUID REFERENCES land_admin.land_parcels(id) NOT NULL,
  leaseholder_id UUID REFERENCES land_admin.profiles(id) NOT NULL,

  -- Lease Terms
  lease_type land_admin.application_type NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration_years INTEGER NOT NULL,

  -- Financial
  annual_rent DECIMAL(15,2) NOT NULL,
  rent_reduction_percentage DECIMAL(5,2) DEFAULT 0,
  total_value DECIMAL(15,2),

  -- Status
  status land_admin.lease_status NOT NULL DEFAULT 'active',

  -- Covenants and Conditions
  covenants JSONB,
  special_conditions TEXT,

  -- Compliance
  last_inspection_date DATE,
  compliance_status TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Land Board Meetings
CREATE TABLE land_admin.land_board_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_number TEXT UNIQUE NOT NULL,
  meeting_date DATE NOT NULL,
  meeting_time TIME NOT NULL,
  location TEXT NOT NULL,
  status land_admin.meeting_status NOT NULL DEFAULT 'scheduled',

  -- Attendees
  chairman_id UUID REFERENCES land_admin.profiles(id),
  members JSONB,

  -- Agenda
  agenda_items JSONB,

  -- Publication
  published_in_gazette BOOLEAN DEFAULT FALSE,
  gazette_date DATE,

  -- Minutes
  minutes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Land Board Decisions
CREATE TABLE land_admin.land_board_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES land_admin.land_board_meetings(id),
  application_id UUID REFERENCES land_admin.applications(id) NOT NULL,

  decision_type land_admin.decision_type NOT NULL,
  decision_date DATE NOT NULL,
  decision_notes TEXT,

  -- Conditions attached to approval
  conditions JSONB,

  -- Voting details
  votes_for INTEGER,
  votes_against INTEGER,
  abstentions INTEGER,

  created_by UUID REFERENCES land_admin.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE land_admin.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES land_admin.profiles(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,

  -- Links
  link_url TEXT,
  link_text TEXT,

  -- Related entities
  application_id UUID REFERENCES land_admin.applications(id),
  meeting_id UUID REFERENCES land_admin.land_board_meetings(id),

  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events/Calendar
CREATE TABLE land_admin.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL,

  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,

  -- Related entities
  meeting_id UUID REFERENCES land_admin.land_board_meetings(id),

  -- Attendees
  attendees JSONB,
  max_attendees INTEGER,

  created_by UUID REFERENCES land_admin.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Log
CREATE TABLE land_admin.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  changed_by UUID REFERENCES land_admin.profiles(id),
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_land_admin_profiles_role ON land_admin.profiles(role);
CREATE INDEX idx_land_admin_applications_status ON land_admin.applications(status);
CREATE INDEX idx_land_admin_applications_applicant ON land_admin.applications(applicant_id);
CREATE INDEX idx_land_admin_applications_number ON land_admin.applications(application_number);
CREATE INDEX idx_land_admin_parcels_status ON land_admin.land_parcels(status);
CREATE INDEX idx_land_admin_parcels_coordinates ON land_admin.land_parcels USING GIST(coordinates);
CREATE INDEX idx_land_admin_leases_status ON land_admin.leases(status);
CREATE INDEX idx_land_admin_notifications_user ON land_admin.notifications(user_id);
CREATE INDEX idx_land_admin_events_dates ON land_admin.events(start_date, end_date);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

CREATE OR REPLACE FUNCTION land_admin.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON land_admin.profiles
  FOR EACH ROW EXECUTE FUNCTION land_admin.update_updated_at_column();

CREATE TRIGGER update_land_parcels_updated_at BEFORE UPDATE ON land_admin.land_parcels
  FOR EACH ROW EXECUTE FUNCTION land_admin.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON land_admin.applications
  FOR EACH ROW EXECUTE FUNCTION land_admin.update_updated_at_column();

CREATE TRIGGER update_leases_updated_at BEFORE UPDATE ON land_admin.leases
  FOR EACH ROW EXECUTE FUNCTION land_admin.update_updated_at_column();

CREATE TRIGGER update_land_board_meetings_updated_at BEFORE UPDATE ON land_admin.land_board_meetings
  FOR EACH ROW EXECUTE FUNCTION land_admin.update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON land_admin.events
  FOR EACH ROW EXECUTE FUNCTION land_admin.update_updated_at_column();

-- Function to generate application number
CREATE OR REPLACE FUNCTION land_admin.generate_application_number()
RETURNS TEXT AS $$
DECLARE
  year TEXT;
  sequence_num INTEGER;
BEGIN
  year := TO_CHAR(NOW(), 'YYYY');

  SELECT COALESCE(MAX(CAST(SUBSTRING(application_number FROM 9) AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM land_admin.applications
  WHERE application_number LIKE 'APP-' || year || '-%';

  RETURN 'APP-' || year || '-' || LPAD(sequence_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to generate lease number
CREATE OR REPLACE FUNCTION land_admin.generate_lease_number()
RETURNS TEXT AS $$
DECLARE
  year TEXT;
  sequence_num INTEGER;
BEGIN
  year := TO_CHAR(NOW(), 'YYYY');

  SELECT COALESCE(MAX(CAST(SUBSTRING(lease_number FROM 6) AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM land_admin.leases
  WHERE lease_number LIKE 'L-' || year || '-%';

  RETURN 'L-' || year || '-' || LPAD(sequence_num::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate application number
CREATE OR REPLACE FUNCTION land_admin.set_application_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.application_number IS NULL THEN
    NEW.application_number := land_admin.generate_application_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_application_number_trigger
  BEFORE INSERT ON land_admin.applications
  FOR EACH ROW
  EXECUTE FUNCTION land_admin.set_application_number();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE land_admin.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_admin.land_parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_admin.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_admin.application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_admin.leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_admin.land_board_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_admin.land_board_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_admin.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_admin.events ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, update only their own
CREATE POLICY "Profiles are viewable by everyone" ON land_admin.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON land_admin.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Applications: Applicants see their own, officers/admins see all
CREATE POLICY "Applicants can view own applications" ON land_admin.applications
  FOR SELECT USING (
    applicant_id = auth.uid() OR
    EXISTS (SELECT 1 FROM land_admin.profiles WHERE id = auth.uid() AND role IN ('admin', 'land_officer', 'land_board_member'))
  );

CREATE POLICY "Applicants can create applications" ON land_admin.applications
  FOR INSERT WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "Officers can update applications" ON land_admin.applications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM land_admin.profiles WHERE id = auth.uid() AND role IN ('admin', 'land_officer'))
  );

-- Notifications: Users see only their own
CREATE POLICY "Users can view own notifications" ON land_admin.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON land_admin.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Events: All authenticated users can view
CREATE POLICY "Events are viewable by authenticated users" ON land_admin.events
  FOR SELECT USING (auth.role() = 'authenticated');

-- Land Parcels: Viewable by all authenticated users
CREATE POLICY "Parcels viewable by authenticated users" ON land_admin.land_parcels
  FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON SCHEMA land_admin IS 'Land Administration System - Dedicated schema to avoid conflicts with other subsystems';
COMMENT ON TABLE land_admin.profiles IS 'User profiles for Land Administration System';
COMMENT ON TABLE land_admin.applications IS 'Land lease applications';
COMMENT ON TABLE land_admin.land_parcels IS 'Land parcels with GIS data';

-- Success message
SELECT 'Land Administration schema created successfully! All tables prefixed with land_admin.' AS message;
