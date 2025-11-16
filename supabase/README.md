# Supabase Database Setup

## 📋 Overview

This directory contains the complete database schema for the Land Administration System including:
- Table definitions
- Relationships and constraints
- Row Level Security (RLS) policies
- Functions and triggers
- Sample seed data
- Views for common queries

## 🗄️ Database Structure

### Core Tables

1. **profiles** - User profiles (extends auth.users)
2. **provinces** - PNG provinces reference
3. **land_parcels** - Land parcels with GIS data
4. **applications** - Land lease applications
5. **application_documents** - Documents attached to applications
6. **leases** - Active and historical leases
7. **land_board_meetings** - Land Board meeting schedules
8. **land_board_decisions** - Decisions made by Land Board
9. **notifications** - User notifications
10. **events** - Calendar events
11. **audit_log** - System audit trail

### Views

1. **application_summary** - Applications with joined data
2. **active_leases_summary** - Active leases with calculated fields
3. **dashboard_statistics** - Real-time dashboard stats
4. **monthly_application_stats** - Monthly aggregations

## 🚀 Setup Instructions

### Option 1: Using Supabase Dashboard (Recommended for beginners)

1. **Go to your Supabase project** at https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Click **+ New Query**
4. Copy the contents of `migrations/001_initial_schema.sql`
5. Paste into the query editor
6. Click **Run** (⏵) button
7. Wait for "Success. No rows returned"
8. Repeat steps 3-7 for `migrations/002_seed_data.sql`

### Option 2: Using Supabase CLI (For advanced users)

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push

# Or run individual migration files
psql -h YOUR_DB_HOST -U postgres -d postgres -f migrations/001_initial_schema.sql
psql -h YOUR_DB_HOST -U postgres -d postgres -f migrations/002_seed_data.sql
```

### Option 3: Using SQL Client

1. Get your database connection string from Supabase Dashboard → Settings → Database
2. Use any PostgreSQL client (pgAdmin, DBeaver, etc.)
3. Run the migration files in order:
   - `001_initial_schema.sql`
   - `002_seed_data.sql`

## 🔍 Verification

After running migrations, verify the setup:

```sql
-- Check tables were created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check sample data was loaded
SELECT COUNT(*) FROM land_parcels;
SELECT COUNT(*) FROM applications;
SELECT COUNT(*) FROM events;

-- Test dashboard statistics view
SELECT * FROM dashboard_statistics;
```

Expected results:
- Should see all 11+ tables
- Land parcels: 8 rows
- Applications: 6 rows
- Events: 5 rows

## 📊 Key Features

### 1. Auto-Generated Numbers
- Application numbers: `APP-YYYY-0001` (auto-increments)
- Lease numbers: `L-YYYY-00001` (auto-increments)

### 2. GIS/Spatial Support
- PostGIS extension enabled
- Land parcels have `coordinates` (POINT) and `boundaries` (POLYGON)
- Spatial queries supported

### 3. Row Level Security (RLS)
- Enabled on all tables
- Applicants see only their own data
- Officers/Admins see all data
- Based on authenticated user's role

### 4. Automatic Timestamps
- `created_at` set on insert
- `updated_at` auto-updates on changes

### 5. Audit Logging
- Track all changes to critical tables
- Store old and new values
- Record who made changes

## 🔐 Security Policies

Current RLS policies (from migration):

```sql
-- Applicants can view own applications
-- Officers/Admins can view all applications
-- Users can only view their own notifications
-- Events viewable by all authenticated users
```

## 🧪 Sample Data Included

The seed migration includes:

- **8 Land Parcels** across different provinces
- **6 Applications** in various statuses
- **3 Land Board Meetings**
- **5 Calendar Events**
- **1 Active Lease**
- **17 PNG Provinces**

## 📱 API Access

After setup, access data from your app:

```typescript
import { supabase, db } from '@/lib/supabase'

// Get all applications
const { data: applications } = await db.applications()
  .select('*')
  .order('created_at', { ascending: false })

// Get dashboard statistics
const { data: stats } = await supabase
  .from('dashboard_statistics')
  .select('*')
  .single()

// Get applications with related data
const { data: summary } = await supabase
  .from('application_summary')
  .select('*')
```

## 🛠️ Common Operations

### Add a new application

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
  location_description: 'Boroko suburb',
  area_requested: 0.5,
  lease_duration_years: 99,
  intended_use: 'Family residence',
  financing_method: 'bank_loan'
})
```

### Query land parcels by status

```typescript
const { data } = await db.landParcels()
  .select('*, provinces(name)')
  .eq('status', 'available')
```

### Get upcoming Land Board meetings

```typescript
const { data } = await db.landBoardMeetings()
  .select('*')
  .gte('meeting_date', new Date().toISOString())
  .order('meeting_date', { ascending: true })
```

## 🔄 Updating Schema

When you need to modify the database:

1. Create a new migration file: `003_your_changes.sql`
2. Add your ALTER TABLE or other DDL statements
3. Run the migration
4. Update TypeScript types in `src/lib/database.types.ts`

## ⚠️ Important Notes

1. **PostGIS Required**: Make sure PostGIS extension is enabled for GIS features
2. **UUID Extension**: Required for auto-generating UUIDs
3. **Auth Integration**: Profiles table references `auth.users` from Supabase Auth
4. **RLS Enabled**: Row Level Security is ON - policies control access
5. **Cascade Deletes**: Some foreign keys cascade deletes (be careful!)

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostGIS Documentation](https://postgis.net/documentation/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🆘 Troubleshooting

### "Extension does not exist" error
```sql
-- Run as superuser or request Supabase to enable
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;
```

### "Permission denied" on tables
```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'applications';
```

### Data not showing in app
```sql
-- Verify data exists
SELECT COUNT(*) FROM applications;

-- Check if RLS is blocking
SET ROLE authenticated;
SELECT * FROM applications;
```

## ✅ Next Steps

After setting up the database:

1. ✅ Verify all tables created successfully
2. ✅ Check sample data loaded
3. ✅ Test queries from your application
4. 🔄 Connect dashboard to real data (next task!)
5. 🔄 Implement form submissions to database
6. 🔄 Add authentication and user profiles

---

Need help? Check the migration files for detailed comments or contact the development team.
