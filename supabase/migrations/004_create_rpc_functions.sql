-- =============================================
-- CREATE RPC FUNCTIONS FOR TABLE ACCESS
-- =============================================
-- Supabase REST API can't access custom schemas directly
-- So we create RPC functions in public schema
-- These functions provide CRUD access to land_admin tables
-- =============================================

-- Function: Get all provinces
CREATE OR REPLACE FUNCTION public.get_provinces()
RETURNS SETOF land_admin.provinces
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM land_admin.provinces ORDER BY name;
$$;

-- Function: Get all land parcels
CREATE OR REPLACE FUNCTION public.get_land_parcels()
RETURNS SETOF land_admin.land_parcels
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM land_admin.land_parcels ORDER BY created_at DESC;
$$;

-- Function: Get all applications
CREATE OR REPLACE FUNCTION public.get_applications()
RETURNS SETOF land_admin.applications
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM land_admin.applications ORDER BY created_at DESC;
$$;

-- Function: Insert application
CREATE OR REPLACE FUNCTION public.insert_application(
  p_application_type text,
  p_applicant_category text,
  p_status text,
  p_company_name text,
  p_first_name text,
  p_last_name text,
  p_email text,
  p_phone text,
  p_postal_address text,
  p_province_id integer,
  p_district text,
  p_location_description text,
  p_area_requested numeric,
  p_lease_duration_years integer,
  p_intended_use text,
  p_development_description text,
  p_financing_method text,
  p_estimated_development_value numeric,
  p_submitted_at timestamptz
)
RETURNS land_admin.applications
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result land_admin.applications;
BEGIN
  INSERT INTO land_admin.applications (
    application_type, applicant_category, status,
    company_name, first_name, last_name, email, phone, postal_address,
    province_id, district, location_description,
    area_requested, lease_duration_years,
    intended_use, development_description,
    financing_method, estimated_development_value,
    submitted_at
  ) VALUES (
    p_application_type::land_admin.application_type,
    p_applicant_category::land_admin.applicant_category,
    p_status::land_admin.application_status,
    p_company_name, p_first_name, p_last_name, p_email, p_phone, p_postal_address,
    p_province_id, p_district, p_location_description,
    p_area_requested, p_lease_duration_years,
    p_intended_use, p_development_description,
    p_financing_method::land_admin.financing_method,
    p_estimated_development_value,
    p_submitted_at
  )
  RETURNING * INTO v_result;

  RETURN v_result;
END;
$$;

-- Function: Get all events
CREATE OR REPLACE FUNCTION public.get_events()
RETURNS SETOF land_admin.events
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM land_admin.events ORDER BY start_date DESC;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_provinces() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_land_parcels() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_applications() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.insert_application TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_events() TO authenticated, anon;

-- Success message
SELECT 'RPC functions created successfully!' AS message;
