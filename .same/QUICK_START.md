# 🚀 Quick Start - Fix GIS Mapping

## ⚠️ Action Required

The GIS Mapping page needs one SQL migration to be run in your Supabase dashboard.

## 📋 Steps (2 minutes)

### 1. Open Supabase SQL Editor
Visit: https://supabase.com/dashboard/project/yvnkyjnwvylrweyzvibs/sql/new

### 2. Copy and Paste This SQL

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
SELECT COUNT(*) as parcel_count, 'SUCCESS! View created.' as status
FROM public.land_parcels_view;
```

### 3. Click "Run"

You should see:
- `parcel_count: 10` (or however many parcels you have)
- `status: SUCCESS! View created.`

### 4. Refresh Your Application

Go back to the Land Administration System and click on **GIS Mapping** in the sidebar.

The map should now load with all land parcels! 🎉

---

## ✅ What Was Fixed

- Fixed import error (`supabase is not defined`)
- Changed GIS page to use a public database view instead of RPC functions
- Created `land_parcels_view` that includes province names through a JOIN
- Fixed TypeScript type errors with parcel IDs

## 🗺️ What You'll See

After running the migration, the GIS Mapping page will show:
- Interactive map with 10 land parcels across PNG
- Color-coded markers by status (Available, Leased, Reserved, etc.)
- Click on markers to see parcel details
- Search and filter functionality
- Complete parcel information in the sidebar

## 📚 Additional Documentation

- Full database setup: `.same/DATABASE_SETUP_GUIDE.md`
- Schema details: `.same/SCHEMA_SETUP_GUIDE.md`
- Auth setup (dev mode): `.same/AUTH_SETUP.md`
- Detailed GIS fix guide: `.same/GIS_FIX_INSTRUCTIONS.md`

## 🆘 Troubleshooting

**Error: "relation land_admin.land_parcels does not exist"**
- You need to run the initial schema migrations first
- See `DATABASE_SETUP_GUIDE.md` for complete setup

**Error: "permission denied for schema land_admin"**
- The migration above should fix this by creating a view in the `public` schema
- Make sure you ran the GRANT permissions line

**Still seeing errors?**
- Clear browser cache and refresh
- Check browser console (F12) for detailed error messages
- Verify the migration ran successfully in Supabase

## 🎯 Next Steps

After the GIS mapping is working, suggested enhancements:
1. Add file upload functionality for applications
2. Build application detail/edit pages
3. Create Land Board meeting management
4. Add reporting and analytics features
5. Separate other subsystems into dedicated schemas
