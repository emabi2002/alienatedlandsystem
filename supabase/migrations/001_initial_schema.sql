-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for GIS functionality
CREATE EXTENSION IF NOT EXISTS postgis;

-- =============================================
-- ENUM TYPES
-- =============================================

CREATE TYPE user_role AS ENUM ('admin', 'land_officer', 'applicant', 'land_board_member', 'viewer');

CREATE TYPE application_status AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'pending_land_board',
  'approved',
  'rejected',
  'on_hold',
  'requires_revision'
);

CREATE TYPE application_type AS ENUM (
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

CREATE TYPE lease_status AS ENUM ('active', 'expired', 'terminated', 'pending_renewal', 'forfeited');

CREATE TYPE parcel_status AS ENUM ('available', 'leased', 'reserved', 'under_review', 'unavailable');

CREATE TYPE meeting_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled', 'postponed');

CREATE TYPE decision_type AS ENUM ('approved', 'rejected', 'deferred', 'requires_revision');

CREATE TYPE financing_method AS ENUM ('savings', 'bank_loan', 'housing_scheme', 'posf', 'nasfund', 'other');

CREATE TYPE applicant_category AS ENUM ('individual', 'company', 'government');

-- =============================================
-- CORE TABLES
-- =============================================

-- User Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'applicant',
  department TEXT,
  phone TEXT,
  postal_address TEXT,
  province TEXT,
  district TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Provinces Reference Table
CREATE TABLE provinces (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert PNG Provinces
INSERT INTO provinces (code, name) VALUES
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
CREATE TABLE land_parcels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parcel_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  province_id INTEGER REFERENCES provinces(id),
  district TEXT,
  location_description TEXT NOT NULL,
  area_hectares DECIMAL(10,4),
  area_sqm DECIMAL(12,2),
  coordinates GEOGRAPHY(POINT, 4326), -- PostGIS point
  boundaries GEOGRAPHY(POLYGON, 4326), -- PostGIS polygon for parcel boundaries
  status parcel_status NOT NULL DEFAULT 'available',
  parcel_type application_type,
  valuation_amount DECIMAL(15,2),
  valuation_date DATE,
  last_survey_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_number TEXT UNIQUE NOT NULL,
  applicant_id UUID REFERENCES profiles(id),

  -- Application Details
  application_type application_type NOT NULL,
  status application_status NOT NULL DEFAULT 'draft',
  submitted_at TIMESTAMPTZ,

  -- Applicant Information
  applicant_category applicant_category NOT NULL,
  company_name TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  postal_address TEXT NOT NULL,

  -- Land Details
  parcel_id UUID REFERENCES land_parcels(id),
  province_id INTEGER REFERENCES provinces(id),
  district TEXT,
  location_description TEXT NOT NULL,
  area_requested DECIMAL(10,4),
  lease_duration_years INTEGER,

  -- Purpose
  intended_use TEXT NOT NULL,
  development_description TEXT,

  -- Financial Details
  financing_method financing_method,
  estimated_development_value DECIMAL(15,2),

  -- Processing
  assigned_officer_id UUID REFERENCES profiles(id),
  land_board_meeting_id UUID,
  decision_date DATE,
  decision_notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Application Documents
CREATE TABLE application_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- 'id', 'bank_statement', 'building_plans', 'other'
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Supabase Storage path
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES profiles(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leases
CREATE TABLE leases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lease_number TEXT UNIQUE NOT NULL,
  application_id UUID REFERENCES applications(id),
  parcel_id UUID REFERENCES land_parcels(id) NOT NULL,
  leaseholder_id UUID REFERENCES profiles(id) NOT NULL,

  -- Lease Terms
  lease_type application_type NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration_years INTEGER NOT NULL,

  -- Financial
  annual_rent DECIMAL(15,2) NOT NULL,
  rent_reduction_percentage DECIMAL(5,2) DEFAULT 0,
  total_value DECIMAL(15,2),

  -- Status
  status lease_status NOT NULL DEFAULT 'active',

  -- Covenants and Conditions
  covenants JSONB, -- Array of covenant conditions
  special_conditions TEXT,

  -- Compliance
  last_inspection_date DATE,
  compliance_status TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Land Board Meetings
CREATE TABLE land_board_meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_number TEXT UNIQUE NOT NULL,
  meeting_date DATE NOT NULL,
  meeting_time TIME NOT NULL,
  location TEXT NOT NULL,
  status meeting_status NOT NULL DEFAULT 'scheduled',

  -- Attendees
  chairman_id UUID REFERENCES profiles(id),
  members JSONB, -- Array of member IDs

  -- Agenda
  agenda_items JSONB, -- Array of application IDs and topics

  -- Publication
  published_in_gazette BOOLEAN DEFAULT FALSE,
  gazette_date DATE,

  -- Minutes
  minutes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Land Board Decisions
CREATE TABLE land_board_decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES land_board_meetings(id),
  application_id UUID REFERENCES applications(id) NOT NULL,

  decision_type decision_type NOT NULL,
  decision_date DATE NOT NULL,
  decision_notes TEXT,

  -- Conditions attached to approval
  conditions JSONB,

  -- Voting details
  votes_for INTEGER,
  votes_against INTEGER,
  abstentions INTEGER,

  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'info', 'success', 'warning', 'error'

  -- Links
  link_url TEXT,
  link_text TEXT,

  -- Related entities
  application_id UUID REFERENCES applications(id),
  meeting_id UUID REFERENCES land_board_meetings(id),

  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events/Calendar
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL, -- 'meeting', 'deadline', 'workshop', 'training'

  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,

  -- Related entities
  meeting_id UUID REFERENCES land_board_meetings(id),

  -- Attendees
  attendees JSONB,
  max_attendees INTEGER,

  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  old_data JSONB,
  new_data JSONB,
  changed_by UUID REFERENCES profiles(id),
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

-- Profiles
CREATE INDEX idx_profiles_role ON profiles(role);

-- Applications
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applicant ON applications(applicant_id);
CREATE INDEX idx_applications_number ON applications(application_number);
CREATE INDEX idx_applications_type ON applications(application_type);
CREATE INDEX idx_applications_submitted ON applications(submitted_at);

-- Land Parcels
CREATE INDEX idx_parcels_status ON land_parcels(status);
CREATE INDEX idx_parcels_province ON land_parcels(province_id);
CREATE INDEX idx_parcels_type ON land_parcels(parcel_type);
CREATE INDEX idx_parcels_coordinates ON land_parcels USING GIST(coordinates);

-- Leases
CREATE INDEX idx_leases_status ON leases(status);
CREATE INDEX idx_leases_leaseholder ON leases(leaseholder_id);
CREATE INDEX idx_leases_parcel ON leases(parcel_id);
CREATE INDEX idx_leases_dates ON leases(start_date, end_date);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE read_at IS NULL;

-- Events
CREATE INDEX idx_events_dates ON events(start_date, end_date);
CREATE INDEX idx_events_type ON events(event_type);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_land_parcels_updated_at BEFORE UPDATE ON land_parcels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leases_updated_at BEFORE UPDATE ON leases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_land_board_meetings_updated_at BEFORE UPDATE ON land_board_meetings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate application number
CREATE OR REPLACE FUNCTION generate_application_number()
RETURNS TEXT AS $$
DECLARE
  year TEXT;
  sequence_num INTEGER;
BEGIN
  year := TO_CHAR(NOW(), 'YYYY');

  SELECT COALESCE(MAX(CAST(SUBSTRING(application_number FROM 9) AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM applications
  WHERE application_number LIKE 'APP-' || year || '-%';

  RETURN 'APP-' || year || '-' || LPAD(sequence_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to generate lease number
CREATE OR REPLACE FUNCTION generate_lease_number()
RETURNS TEXT AS $$
DECLARE
  year TEXT;
  sequence_num INTEGER;
BEGIN
  year := TO_CHAR(NOW(), 'YYYY');

  SELECT COALESCE(MAX(CAST(SUBSTRING(lease_number FROM 6) AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM leases
  WHERE lease_number LIKE 'L-' || year || '-%';

  RETURN 'L-' || year || '-' || LPAD(sequence_num::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate application number
CREATE OR REPLACE FUNCTION set_application_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.application_number IS NULL THEN
    NEW.application_number := generate_application_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_application_number_trigger
  BEFORE INSERT ON applications
  FOR EACH ROW
  EXECUTE FUNCTION set_application_number();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_board_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_board_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, update only their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Applications: Applicants see their own, officers/admins see all
CREATE POLICY "Applicants can view own applications" ON applications
  FOR SELECT USING (
    applicant_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'land_officer', 'land_board_member'))
  );

CREATE POLICY "Applicants can create applications" ON applications
  FOR INSERT WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "Officers can update applications" ON applications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'land_officer'))
  );

-- Notifications: Users see only their own
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Events: All authenticated users can view
CREATE POLICY "Events are viewable by authenticated users" ON events
  FOR SELECT USING (auth.role() = 'authenticated');

-- Land Parcels: Viewable by all authenticated users
CREATE POLICY "Parcels viewable by authenticated users" ON land_parcels
  FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE applications IS 'Land lease applications submitted by users';
COMMENT ON TABLE land_parcels IS 'Land parcels available for leasing with GIS data';
COMMENT ON TABLE leases IS 'Active and historical land leases';
COMMENT ON TABLE land_board_meetings IS 'Land Board meeting schedules and details';
COMMENT ON TABLE land_board_decisions IS 'Decisions made by Land Board on applications';
COMMENT ON TABLE notifications IS 'User notifications for application updates';
COMMENT ON TABLE events IS 'Calendar events including meetings, deadlines, workshops';
