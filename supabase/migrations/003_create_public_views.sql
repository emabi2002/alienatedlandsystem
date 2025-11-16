-- =============================================
-- CREATE VIEWS IN PUBLIC SCHEMA
-- =============================================
-- Supabase REST API only supports 'public' schema
-- So we create views in public that query land_admin tables
-- =============================================

-- View: Provinces
CREATE OR REPLACE VIEW public.provinces_view AS
SELECT * FROM land_admin.provinces ORDER BY name;

GRANT SELECT ON public.provinces_view TO authenticated, anon;

-- View: Application Summary
CREATE OR REPLACE VIEW public.application_summary AS
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
FROM land_admin.applications a
LEFT JOIN land_admin.provinces p ON a.province_id = p.id
LEFT JOIN land_admin.land_parcels lp ON a.parcel_id = lp.id;

-- View: Active Leases Summary
CREATE OR REPLACE VIEW public.active_leases_summary AS
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
FROM land_admin.leases l
JOIN land_admin.land_parcels lp ON l.parcel_id = lp.id
LEFT JOIN land_admin.provinces pr ON lp.province_id = pr.id
WHERE l.status = 'active';

-- View: Dashboard Statistics
CREATE OR REPLACE VIEW public.dashboard_statistics AS
SELECT
  (SELECT COUNT(*) FROM land_admin.applications) AS total_applications,
  (SELECT COUNT(*) FROM land_admin.applications WHERE status IN ('submitted', 'under_review')) AS pending_review,
  (SELECT COUNT(*) FROM land_admin.applications WHERE status = 'approved') AS approved_applications,
  (SELECT COUNT(*) FROM land_admin.leases WHERE status = 'active') AS active_leases,
  (SELECT COUNT(*) FROM land_admin.leases WHERE end_date <= CURRENT_DATE + INTERVAL '3 months' AND status = 'active') AS expiring_soon,
  (SELECT COUNT(*) FROM land_admin.applications WHERE submitted_at >= DATE_TRUNC('month', CURRENT_DATE)) AS applications_this_month,
  (SELECT SUM(annual_rent * (1 - rent_reduction_percentage / 100)) FROM land_admin.leases WHERE status = 'active') AS total_annual_revenue,
  (SELECT COUNT(*) FROM land_admin.land_parcels WHERE status = 'available') AS available_parcels;

-- View: Monthly Application Statistics
CREATE OR REPLACE VIEW public.monthly_application_stats AS
SELECT
  DATE_TRUNC('month', submitted_at) AS month,
  COUNT(*) AS total_applications,
  COUNT(*) FILTER (WHERE status = 'approved') AS approved,
  COUNT(*) FILTER (WHERE status = 'rejected') AS rejected,
  COUNT(*) FILTER (WHERE status IN ('submitted', 'under_review', 'pending_land_board')) AS pending,
  SUM(estimated_development_value) AS total_estimated_value
FROM land_admin.applications
WHERE submitted_at IS NOT NULL
GROUP BY DATE_TRUNC('month', submitted_at)
ORDER BY month DESC;

-- View: Land Parcels with Province Names
CREATE OR REPLACE VIEW public.land_parcels_view AS
SELECT
  lp.id,
  lp.parcel_number,
  lp.name,
  lp.parcel_type,
  lp.status,
  lp.area_hectares,
  lp.area_sqm,
  lp.province_id,
  p.name AS province_name,
  lp.district,
  lp.location_description,
  lp.coordinates,
  lp.boundaries,
  lp.valuation_amount,
  lp.valuation_date,
  lp.last_survey_date,
  lp.notes,
  lp.created_at,
  lp.updated_at
FROM land_admin.land_parcels lp
LEFT JOIN land_admin.provinces p ON lp.province_id = p.id;

-- Grant permissions to authenticated users
GRANT SELECT ON public.application_summary TO authenticated, anon;
GRANT SELECT ON public.active_leases_summary TO authenticated, anon;
GRANT SELECT ON public.dashboard_statistics TO authenticated, anon;
GRANT SELECT ON public.monthly_application_stats TO authenticated, anon;
GRANT SELECT ON public.land_parcels_view TO authenticated, anon;

-- Success message
SELECT 'Public views created successfully! Views now accessible via Supabase API.' AS message;
