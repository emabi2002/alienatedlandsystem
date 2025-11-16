# 🔧 QUICK FIX: "relation already exists" Error

You're seeing this error because your Supabase database already has some tables created.

## ✅ **Solution (3 Steps)**

### Step 1: Clean Existing Tables

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Click **"SQL Editor"** (left sidebar)
3. Click **"+ New Query"**
4. Copy the cleanup script below
5. Paste and click **"Run"** ▶️

**Cleanup Script:**
```sql
-- Copy this entire block and paste in SQL Editor

DROP VIEW IF EXISTS application_summary CASCADE;
DROP VIEW IF EXISTS active_leases_summary CASCADE;
DROP VIEW IF EXISTS dashboard_statistics CASCADE;
DROP VIEW IF EXISTS monthly_application_stats CASCADE;

DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS land_board_decisions CASCADE;
DROP TABLE IF EXISTS land_board_meetings CASCADE;
DROP TABLE IF EXISTS leases CASCADE;
DROP TABLE IF EXISTS application_documents CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS land_parcels CASCADE;
DROP TABLE IF EXISTS provinces CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS application_status CASCADE;
DROP TYPE IF EXISTS application_type CASCADE;
DROP TYPE IF EXISTS lease_status CASCADE;
DROP TYPE IF EXISTS parcel_status CASCADE;
DROP TYPE IF EXISTS meeting_status CASCADE;
DROP TYPE IF EXISTS decision_type CASCADE;
DROP TYPE IF EXISTS financing_method CASCADE;
DROP TYPE IF EXISTS applicant_category CASCADE;

DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
DROP FUNCTION IF EXISTS generate_application_number CASCADE;
DROP FUNCTION IF EXISTS generate_lease_number CASCADE;
DROP FUNCTION IF EXISTS set_application_number CASCADE;

SELECT 'Database cleaned! Ready for fresh start.' AS message;
```

✅ You should see: **"Database cleaned! Ready for fresh start."**

---

### Step 2: Run Main Migration

1. Click **"+ New Query"** again
2. Open file: `land-administration-system/supabase/migrations/001_initial_schema.sql`
3. Copy **ALL** the content (it's long - 500+ lines)
4. Paste in SQL Editor
5. Click **"Run"** ▶️

✅ You should see: **"Success. No rows returned"**

---

### Step 3: Load Sample Data

1. Click **"+ New Query"** again
2. Open file: `land-administration-system/supabase/migrations/002_seed_data.sql`
3. Copy **ALL** the content
4. Paste in SQL Editor
5. Click **"Run"** ▶️

✅ You should see: **"Success. Rows affected: X"**

---

## ✅ **Verify It Worked**

Run this query in SQL Editor:

```sql
SELECT
  (SELECT COUNT(*) FROM land_parcels) as parcels,
  (SELECT COUNT(*) FROM applications) as apps,
  (SELECT COUNT(*) FROM events) as events;
```

**Expected result:**
```
parcels | apps | events
--------|------|-------
   8    |  6   |   5
```

---

## 🎉 **Done!**

Your database is now set up with:
- ✅ 11 tables created
- ✅ 8 land parcels
- ✅ 6 sample applications
- ✅ 5 events
- ✅ 17 provinces

---

## ⚠️ **Note About Data Loss**

The cleanup script **deletes all existing data**. This is fine for development, but in production you would:
- Export existing data first
- Modify migrations to handle existing tables
- Use ALTER TABLE instead of CREATE TABLE

For now, since this is development, the clean start is the easiest approach!

---

## 🆘 **Still Having Issues?**

### Error: "permission denied"
**Solution:** Make sure you're logged in to the correct Supabase project

### Error: "extension does not exist"
**Solution:** Extensions are auto-created. If you still see this, run:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;
```

### Nothing shows in queries
**Solution:** Check if RLS is blocking. Temporarily disable:
```sql
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;
```

---

## 📚 **Next Steps**

After fixing the error:
1. ✅ Verify sample data loaded
2. 🔄 Connect your app dashboard to real data
3. 🔄 Make forms save to database
4. 🔄 Load GIS map from database

Need more help? Check `DATABASE_SETUP_GUIDE.md` for full instructions!
