# 🚀 Quick Start: Database Setup

## Step-by-Step Guide to Set Up Your Database

### 📝 What You'll Be Creating

A complete database for your Land Administration System with:
- ✅ 11 core tables
- ✅ Sample data (8 parcels, 6 applications, 5 events)
- ✅ Auto-generated application numbers
- ✅ GIS/mapping support
- ✅ Role-based security
- ✅ Dashboard views

---

## 🎯 Method 1: Supabase Dashboard (EASIEST)

### 1. Open Supabase Dashboard

Go to: https://supabase.com/dashboard/project/YOUR_PROJECT_ID

### 2. Navigate to SQL Editor

Click on **"SQL Editor"** in the left sidebar

### 3. Clean Existing Tables (If You Have Errors)

**Only if you get "relation already exists" error:**

1. Click **"+ New Query"** button
2. Copy **ALL** content from: `land-administration-system/supabase/migrations/000_cleanup.sql`
3. Paste into the query editor
4. Click **"Run"** (▶️)
5. You'll see: **"Database cleaned successfully!"**

⚠️ **This deletes all existing data!** Only safe in development.

### 4. Run First Migration

1. Click **"+ New Query"** button
2. Copy **ALL** content from: `land-administration-system/supabase/migrations/001_initial_schema.sql`
3. Paste into the query editor
4. Click **"Run"** (▶️ button at bottom right)
5. Wait for success message: **"Success. No rows returned"**

### 5. Run Second Migration (Sample Data)

1. Click **"+ New Query"** button again
2. Copy **ALL** content from: `land-administration-system/supabase/migrations/002_seed_data.sql`
3. Paste into the query editor
4. Click **"Run"** (▶️)
5. Should see: **"Success. Rows affected: X"**

### 6. Verify Setup

Run this query to check:

```sql
-- Check tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' ORDER BY table_name;

-- Check sample data
SELECT COUNT(*) as land_parcels FROM land_parcels;
SELECT COUNT(*) as applications FROM applications;
SELECT * FROM dashboard_statistics;
```

You should see:
- 11+ tables listed
- 8 land parcels
- 6 applications
- Dashboard statistics with real numbers

---

## 🎯 Method 2: Copy-Paste SQL (QUICK)

If you prefer, you can simply:

### 1. Get Database Connection

From Supabase Dashboard → Settings → Database:
- Look for **"Connection string"**
- Copy the **"URI"** connection string

### 2. Use Any SQL Client

Options:
- Supabase SQL Editor (easiest)
- pgAdmin
- DBeaver
- TablePlus
- Command line `psql`

### 3. Run Migration Files

Execute in order:
1. `001_initial_schema.sql` - Creates all tables
2. `002_seed_data.sql` - Loads sample data

---

## ✅ Verification Checklist

After running migrations, verify:

- [ ] All tables created
- [ ] Sample land parcels loaded (8 rows)
- [ ] Sample applications loaded (6 rows)
- [ ] Events loaded (5 rows)
- [ ] Provinces loaded (17 rows)
- [ ] Dashboard view works

### Quick Verification Queries

```sql
-- 1. Check tables exist
\dt public.*

-- 2. Count sample data
SELECT
  (SELECT COUNT(*) FROM land_parcels) as parcels,
  (SELECT COUNT(*) FROM applications) as apps,
  (SELECT COUNT(*) FROM events) as events,
  (SELECT COUNT(*) FROM provinces) as provinces;

-- 3. Test dashboard view
SELECT * FROM dashboard_statistics;

-- 4. Test application summary view
SELECT * FROM application_summary LIMIT 5;
```

Expected output:
```
parcels | apps | events | provinces
--------|------|--------|----------
   8    |  6   |   5    |    17
```

---

## 📊 What Got Created?

### Tables

1. **profiles** - User accounts and roles
2. **provinces** - 17 PNG provinces
3. **land_parcels** - Land available for leasing (with GPS coordinates)
4. **applications** - Lease applications
5. **application_documents** - File attachments
6. **leases** - Active leases
7. **land_board_meetings** - Meeting schedules
8. **land_board_decisions** - Approval/rejection records
9. **notifications** - User notifications
10. **events** - Calendar events
11. **audit_log** - System audit trail

### Sample Data Loaded

**Land Parcels** (8):
- Business district (Port Moresby)
- Residential zones
- Agricultural land
- Industrial zones
- Coastal resort property

**Applications** (6):
- Status: Approved, Under Review, Pending, Draft, etc.
- Types: Residential, Commercial, Agricultural, Industrial

**Events** (5):
- Land Board meetings
- Workshops
- Application deadlines
- Training sessions

---

## 🔧 Next Steps

Now that your database is set up:

### 1. Test From Your App

```typescript
import { supabase, db } from '@/lib/supabase'

// Get all applications
const { data } = await db.applications().select('*')
console.log(data)

// Get dashboard stats
const { data: stats } = await supabase
  .from('dashboard_statistics')
  .select('*')
  .single()
console.log(stats)
```

### 2. Connect Dashboard to Real Data

Update `src/app/page.tsx` to fetch from database instead of mock data

### 3. Make Forms Functional

Connect the submit request form to save applications

### 4. Load GIS Map Data

Display real land parcels on the map

---

## 🆘 Common Issues

### Issue: "Extension does not exist"

**Solution:** Extensions are auto-enabled in the migration. If you see this error, run:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;
```

### Issue: "Permission denied"

**Solution:** Make sure you're running as the postgres user or have superuser privileges

### Issue: "Table already exists"

**Solution:** Drop existing tables first or modify the migration

```sql
-- Drop all tables (⚠️ THIS DELETES ALL DATA!)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

### Issue: No data showing in queries

**Solution:** Check Row Level Security policies

```sql
-- Temporarily disable RLS for testing
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;
```

---

## 📱 Using the Database in Your App

### Get Applications

```typescript
const { data, error } = await db.applications()
  .select(`
    *,
    provinces(name),
    land_parcels(parcel_number, name)
  `)
  .order('created_at', { ascending: false })
```

### Create New Application

```typescript
const { data, error } = await db.applications().insert({
  application_type: 'residential_high',
  applicant_category: 'individual',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  phone: '+675 7123 4567',
  postal_address: 'PO Box 123',
  province_id: 1,
  location_description: 'Port Moresby',
  intended_use: 'Family home'
})

// Application number is auto-generated!
```

### Get Dashboard Statistics

```typescript
const { data } = await supabase
  .from('dashboard_statistics')
  .select('*')
  .single()

console.log(data.total_applications) // Real count
console.log(data.pending_review) // Real count
console.log(data.total_annual_revenue) // Calculated
```

---

## 🎉 You're Done!

Your database is now ready to use. The next step is to connect your application dashboard and forms to this real data.

**Files to reference:**
- Database types: `src/lib/database.types.ts`
- Supabase client: `src/lib/supabase.ts`
- Full docs: `supabase/README.md`

Need help? Check the migration files - they have detailed comments explaining everything!
