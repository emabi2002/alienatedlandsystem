# Fix GIS Mapping - Instructions

## Issue
The GIS Mapping page shows error: "supabase is not defined"

## Solution
Run the updated migration to create a public view for land parcels.

## Steps

### 1. Open Supabase Dashboard
Go to: https://supabase.com/dashboard/project/yvnkyjnwvylrweyzvibs

### 2. Navigate to SQL Editor
Click on "SQL Editor" in the left sidebar

### 3. Run This SQL

Copy and paste the following SQL and click "Run":

```sql
-- Create view for land parcels with province names
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

-- Grant permissions
GRANT SELECT ON public.land_parcels_view TO authenticated, anon;

-- Verify it worked
SELECT COUNT(*) as parcel_count FROM public.land_parcels_view;
```

### 4. Verify
You should see a success message and a count of parcels (should be 10 if using the seed data).

### 5. Refresh Application
Refresh the Land Administration System in your browser and navigate to "GIS Mapping" page.

## What This Does
- Creates a view in the `public` schema that Supabase REST API can access
- The view joins land parcels with provinces to include province names
- Grants access permissions to authenticated and anonymous users

## Troubleshooting

**If you get "relation land_admin.land_parcels does not exist":**
- You need to run the initial schema migration first
- Check `.same/DATABASE_SETUP_GUIDE.md` for full setup instructions

**If you still see errors after running the SQL:**
- Clear your browser cache
- Restart the dev server
- Check browser console for detailed error messages
