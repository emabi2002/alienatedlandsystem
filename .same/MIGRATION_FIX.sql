-- =====================================================
-- CORRECTED MIGRATION - Drop and Recreate Views
-- =====================================================
-- Run this in Supabase SQL Editor to fix the views
-- =====================================================

-- Drop existing views first (if they exist)
DROP VIEW IF EXISTS public.provinces_view CASCADE;
DROP VIEW IF EXISTS public.land_parcels_view CASCADE;

-- Create provinces view
CREATE VIEW public.provinces_view AS
SELECT * FROM land_admin.provinces ORDER BY name;

GRANT SELECT ON public.provinces_view TO authenticated, anon;

-- Create land parcels view with province names
CREATE VIEW public.land_parcels_view AS
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

GRANT SELECT ON public.land_parcels_view TO authenticated, anon;

-- Verify the views were created successfully
SELECT
  'provinces_view' as view_name,
  COUNT(*) as record_count
FROM public.provinces_view
UNION ALL
SELECT
  'land_parcels_view' as view_name,
  COUNT(*) as record_count
FROM public.land_parcels_view;
