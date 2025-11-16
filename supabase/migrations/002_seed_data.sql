-- =============================================
-- SEED DATA FOR DEVELOPMENT
-- =============================================

-- Sample Land Parcels
INSERT INTO land_parcels (parcel_number, name, province_id, district, location_description, area_hectares, area_sqm, coordinates, status, parcel_type, valuation_amount) VALUES
  ('P-2025-0001', 'Parcel A - Business District', 1, 'Port Moresby', 'Prime commercial land in Port Moresby CBD, near Waigani', 2.5, 25000, ST_SetSRID(ST_MakePoint(147.1803, -9.4438), 4326), 'available', 'business_commercial', 5000000),
  ('P-2025-0002', 'Parcel B - Residential Zone', 1, 'Port Moresby', 'Residential development area in Boroko', 1.2, 12000, ST_SetSRID(ST_MakePoint(147.1900, -9.4400), 4326), 'leased', 'residential_high', 2500000),
  ('P-2025-0003', 'Parcel C - Agricultural', 2, 'Kairuku-Hiri', 'Agricultural land suitable for farming, near Kwikila', 15.0, 150000, ST_SetSRID(ST_MakePoint(147.2000, -9.5000), 4326), 'available', 'agricultural', 800000),
  ('P-2025-0004', 'Parcel D - Industrial', 1, 'Port Moresby', 'Industrial development zone in Hohola', 5.8, 58000, ST_SetSRID(ST_MakePoint(147.1700, -9.4300), 4326), 'under_review', 'business_industrial', 3500000),
  ('P-2025-0005', 'Parcel E - Coastal Resort', 4, 'Alotau', 'Beachfront property suitable for tourism development', 8.0, 80000, ST_SetSRID(ST_MakePoint(150.4583, -10.3167), 4326), 'available', 'special_purpose', 6000000),
  ('P-2025-0006', 'Parcel F - Residential Medium', 1, 'Port Moresby', 'Medium covenant residential area in Gerehu', 0.8, 8000, ST_SetSRID(ST_MakePoint(147.1500, -9.4600), 4326), 'available', 'residential_medium', 1200000),
  ('P-2025-0007', 'Parcel G - Agricultural Pastoral', 6, 'Tari', 'Pastoral land in Southern Highlands', 25.0, 250000, ST_SetSRID(ST_MakePoint(142.9500, -5.8500), 4326), 'available', 'pastoral', 1500000),
  ('P-2025-0008', 'Parcel H - Urban Development', 1, 'Port Moresby', 'Mixed-use urban development site in Waigani', 10.0, 100000, ST_SetSRID(ST_MakePoint(147.1950, -9.4250), 4326), 'reserved', 'urban_development', 8000000);

-- Sample Applications (Note: You'll need real user IDs from auth.users after users sign up)
-- For now, we'll create placeholders that can be updated later

INSERT INTO applications (
  application_number,
  application_type,
  status,
  applicant_category,
  first_name,
  last_name,
  email,
  phone,
  postal_address,
  province_id,
  district,
  location_description,
  area_requested,
  lease_duration_years,
  intended_use,
  financing_method,
  estimated_development_value,
  submitted_at
) VALUES
  (
    'APP-2025-0001',
    'residential_high',
    'approved',
    'individual',
    'John',
    'Doe',
    'john.doe@example.com',
    '+675 7123 4567',
    'PO Box 123, Port Moresby, NCD',
    1,
    'Port Moresby',
    'Residential property in Boroko suburb',
    0.5,
    99,
    'Construction of family residence with modern amenities',
    'bank_loan',
    1500000,
    NOW() - INTERVAL '15 days'
  ),
  (
    'APP-2025-0002',
    'business_commercial',
    'under_review',
    'company',
    'Mary',
    'Smith',
    'mary.smith@abccorp.com',
    '+675 7234 5678',
    'PO Box 456, Port Moresby, NCD',
    1,
    'Port Moresby',
    'Commercial office building in CBD',
    2.0,
    50,
    'Development of 5-story commercial office complex',
    'bank_loan',
    8000000,
    NOW() - INTERVAL '10 days'
  ),
  (
    'APP-2025-0003',
    'agricultural',
    'pending_land_board',
    'individual',
    'Peter',
    'Kila',
    'peter.kila@example.com',
    '+675 7345 6789',
    'PO Box 789, Kokopo, ENBP',
    15,
    'Gazelle',
    'Agricultural land for cocoa and copra farming',
    20.0,
    99,
    'Establishment of commercial cocoa and copra plantation',
    'savings',
    500000,
    NOW() - INTERVAL '5 days'
  ),
  (
    'APP-2025-0004',
    'business_industrial',
    'submitted',
    'company',
    'James',
    'Wilson',
    'james.wilson@industries.com',
    '+675 7456 7890',
    'PO Box 321, Lae, Morobe',
    9,
    'Lae',
    'Industrial warehouse and manufacturing facility',
    5.0,
    30,
    'Construction of food processing and packaging facility',
    'bank_loan',
    12000000,
    NOW() - INTERVAL '2 days'
  ),
  (
    'APP-2025-0005',
    'residential_medium',
    'draft',
    'individual',
    'Sarah',
    'Nami',
    'sarah.nami@example.com',
    '+675 7567 8901',
    'PO Box 654, Port Moresby, NCD',
    1,
    'Port Moresby',
    'Residential lot in Gerehu Stage 6',
    0.3,
    99,
    'Family home construction',
    'housing_scheme',
    800000,
    NULL
  ),
  (
    'APP-2025-0006',
    'special_purpose',
    'requires_revision',
    'company',
    'David',
    'Toka',
    'david.toka@resort.com',
    '+675 7678 9012',
    'PO Box 987, Alotau, Milne Bay',
    4,
    'Alotau',
    'Beachfront resort development',
    10.0,
    50,
    'Eco-tourism resort with bungalows and facilities',
    'bank_loan',
    15000000,
    NOW() - INTERVAL '20 days'
  );

-- Sample Land Board Meetings
INSERT INTO land_board_meetings (meeting_number, meeting_date, meeting_time, location, status, published_in_gazette, gazette_date) VALUES
  ('LBM-2025-001', '2025-01-20', '09:00:00', 'Department of Lands, Port Moresby', 'scheduled', true, '2025-01-10'),
  ('LBM-2025-002', '2025-02-05', '09:00:00', 'Department of Lands, Port Moresby', 'scheduled', false, NULL),
  ('LBM-2024-012', '2024-12-15', '09:00:00', 'Department of Lands, Port Moresby', 'completed', true, '2024-12-01');

-- Sample Events
INSERT INTO events (title, description, event_type, start_date, end_date, location, attendees) VALUES
  ('Land Board Meeting - Regular Session', 'Regular Land Board meeting to consider new lease applications', 'meeting', '2025-01-20 09:00:00+10', '2025-01-20 16:00:00+10', 'Department of Lands, Port Moresby', '{"count": 12}'::jsonb),
  ('Application Deadline - January Batch', 'Last day to submit applications for January Land Board meeting', 'deadline', '2025-01-15 17:00:00+10', '2025-01-15 17:00:00+10', 'Online Submission', '{}'::jsonb),
  ('Lease Renewal Workshop', 'Workshop for leaseholders on renewal processes and requirements', 'workshop', '2025-01-25 10:00:00+10', '2025-01-25 14:00:00+10', 'Training Room A', '{"count": 30}'::jsonb),
  ('Land Board Meeting - Special Session', 'Special session for urgent lease considerations', 'meeting', '2025-02-05 09:00:00+10', '2025-02-05 12:00:00+10', 'Department of Lands, Port Moresby', '{"count": 12}'::jsonb),
  ('GIS Training for Staff', 'Training session on GIS system usage and land mapping', 'training', '2025-02-10 13:00:00+10', '2025-02-10 16:00:00+10', 'Computer Lab', '{"count": 15}'::jsonb);

-- Sample Leases
INSERT INTO leases (
  lease_number,
  parcel_id,
  lease_type,
  start_date,
  end_date,
  duration_years,
  annual_rent,
  rent_reduction_percentage,
  status
) VALUES
  (
    'L-2024-00001',
    (SELECT id FROM land_parcels WHERE parcel_number = 'P-2025-0002'),
    'residential_high',
    '2024-06-01',
    '2123-06-01',
    99,
    15000,
    25.0,
    'active'
  );

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- View: Application Summary with Related Data
CREATE OR REPLACE VIEW application_summary AS
SELECT
  a.id,
  a.application_number,
  a.first_name || ' ' || a.last_name AS applicant_name,
  a.email,
  a.application_type,
  a.status,
  a.submitted_at,
  p.name AS province_name,
  lp.parcel_number,
  lp.name AS parcel_name,
  a.area_requested,
  a.estimated_development_value,
  a.created_at
FROM applications a
LEFT JOIN provinces p ON a.province_id = p.id
LEFT JOIN land_parcels lp ON a.parcel_id = lp.id;

-- View: Active Leases Summary
CREATE OR REPLACE VIEW active_leases_summary AS
SELECT
  l.id,
  l.lease_number,
  l.lease_type,
  lp.parcel_number,
  lp.name AS parcel_name,
  lp.area_hectares,
  pr.name AS province_name,
  l.start_date,
  l.end_date,
  l.annual_rent,
  l.rent_reduction_percentage,
  l.annual_rent * (1 - l.rent_reduction_percentage / 100) AS effective_annual_rent,
  l.status,
  EXTRACT(YEAR FROM AGE(l.end_date, CURRENT_DATE)) AS years_remaining
FROM leases l
JOIN land_parcels lp ON l.parcel_id = lp.id
LEFT JOIN provinces pr ON lp.province_id = pr.id
WHERE l.status = 'active';

-- View: Dashboard Statistics
CREATE OR REPLACE VIEW dashboard_statistics AS
SELECT
  (SELECT COUNT(*) FROM applications) AS total_applications,
  (SELECT COUNT(*) FROM applications WHERE status IN ('submitted', 'under_review')) AS pending_review,
  (SELECT COUNT(*) FROM applications WHERE status = 'approved') AS approved_applications,
  (SELECT COUNT(*) FROM leases WHERE status = 'active') AS active_leases,
  (SELECT COUNT(*) FROM leases WHERE end_date <= CURRENT_DATE + INTERVAL '3 months' AND status = 'active') AS expiring_soon,
  (SELECT COUNT(*) FROM applications WHERE submitted_at >= DATE_TRUNC('month', CURRENT_DATE)) AS applications_this_month,
  (SELECT SUM(annual_rent * (1 - rent_reduction_percentage / 100)) FROM leases WHERE status = 'active') AS total_annual_revenue,
  (SELECT COUNT(*) FROM land_parcels WHERE status = 'available') AS available_parcels;

-- View: Monthly Application Statistics
CREATE OR REPLACE VIEW monthly_application_stats AS
SELECT
  DATE_TRUNC('month', submitted_at) AS month,
  COUNT(*) AS total_applications,
  COUNT(*) FILTER (WHERE status = 'approved') AS approved,
  COUNT(*) FILTER (WHERE status = 'rejected') AS rejected,
  COUNT(*) FILTER (WHERE status IN ('submitted', 'under_review', 'pending_land_board')) AS pending,
  SUM(estimated_development_value) AS total_estimated_value
FROM applications
WHERE submitted_at IS NOT NULL
GROUP BY DATE_TRUNC('month', submitted_at)
ORDER BY month DESC;

COMMENT ON VIEW application_summary IS 'Summary view of applications with related parcel and province data';
COMMENT ON VIEW active_leases_summary IS 'Summary view of active leases with calculated fields';
COMMENT ON VIEW dashboard_statistics IS 'Real-time dashboard statistics';
COMMENT ON VIEW monthly_application_stats IS 'Monthly aggregated application statistics';
