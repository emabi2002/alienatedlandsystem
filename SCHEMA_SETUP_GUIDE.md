# 🏗️ Schema-Based Setup (Multi-Subsystem Database)

## 📋 Important: For Shared Databases

Since you have **multiple subsystems** sharing the same Supabase database, we use a **dedicated schema** called `land_admin` to keep the Land Administration System completely separate.

---

## 🎯 What This Means

### Traditional Approach (Single System):
```
public schema
  ├── profiles
  ├── applications
  └── leases
```

### Our Approach (Multiple Subsystems):
```
public schema
  ├── (other subsystems' tables)
  └── ...

land_admin schema (isolated)
  ├── profiles
  ├── applications
  ├── leases
  └── (all land admin tables)
```

**Benefits:**
- ✅ No naming conflicts with other subsystems
- ✅ Clean separation of concerns
- ✅ Easy to manage permissions
- ✅ Can have same table names across subsystems

---

## 🚀 Setup Instructions

### Step 1: Run Schema Migration

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **"+ New Query"**
3. Copy content from: `supabase/migrations/001_initial_schema_with_namespace.sql`
4. Paste and click **"Run"** ▶️

✅ Should see: **"Land Administration schema created successfully! All tables prefixed with land_admin."**

---

### Step 2: Load Sample Data

1. Click **"+ New Query"** again
2. Copy content from: `supabase/migrations/002_seed_data_with_namespace.sql`
3. Paste and click **"Run"** ▶️

✅ Should see message with counts:
- parcels_loaded: 8
- applications_loaded: 6
- events_loaded: 5

---

## ✅ Verify Setup

Run this in SQL Editor:

```sql
-- Check schema exists
SELECT schema_name
FROM information_schema.schemata
WHERE schema_name = 'land_admin';

-- Check tables in land_admin schema
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'land_admin'
ORDER BY table_name;

-- Check sample data
SELECT
  (SELECT COUNT(*) FROM land_admin.land_parcels) as parcels,
  (SELECT COUNT(*) FROM land_admin.applications) as apps,
  (SELECT COUNT(*) FROM land_admin.events) as events;
```

**Expected:**
- Schema: `land_admin` exists
- Tables: 11+ tables listed
- Data: parcels=8, apps=6, events=5

---

## 📊 How to Query Data

### From SQL Editor:
```sql
-- Always prefix with schema name
SELECT * FROM land_admin.applications;
SELECT * FROM land_admin.land_parcels;
SELECT * FROM land_admin.dashboard_statistics;
```

### From Your App (Already Configured!):
```typescript
import { supabase, db, views } from '@/lib/supabase'

// Supabase client is configured to use 'land_admin' schema automatically
const { data } = await db.applications().select('*')

// Access views
const { data: stats } = await views.dashboardStatistics().select('*').single()
```

The schema is **already configured** in `src/lib/supabase.ts`:
```typescript
export const supabase = createClient(url, key, {
  db: { schema: 'land_admin' }
})
```

---

## 🗂️ Schema Structure

All tables in `land_admin` schema:

1. **land_admin.profiles** - User accounts
2. **land_admin.provinces** - PNG provinces
3. **land_admin.land_parcels** - Land parcels with GIS
4. **land_admin.applications** - Lease applications
5. **land_admin.application_documents** - File attachments
6. **land_admin.leases** - Active leases
7. **land_admin.land_board_meetings** - Meeting schedules
8. **land_admin.land_board_decisions** - Approval decisions
9. **land_admin.notifications** - User notifications
10. **land_admin.events** - Calendar events
11. **land_admin.audit_log** - Audit trail

Views:
- **land_admin.application_summary**
- **land_admin.active_leases_summary**
- **land_admin.dashboard_statistics**
- **land_admin.monthly_application_stats**

---

## 🔒 Security & Permissions

Row Level Security (RLS) is enabled on all tables:
- Applicants see only their own data
- Officers/Admins see all data
- Automatically enforced based on user role

Permissions are granted to:
- `postgres` (superuser)
- `anon` (anonymous users)
- `authenticated` (logged-in users)
- `service_role` (backend services)

---

## 🔄 Migration Files Used

**Use these files** (not the old ones!):

1. ✅ `001_initial_schema_with_namespace.sql` - Creates schema + tables
2. ✅ `002_seed_data_with_namespace.sql` - Loads sample data

**Don't use:**
- ❌ `001_initial_schema.sql` (old, uses public schema)
- ❌ `002_seed_data.sql` (old, uses public schema)
- ❌ `000_cleanup.sql` (would delete other subsystems!)

---

## 🆘 Troubleshooting

### Error: "schema land_admin does not exist"
**Solution:** Run `001_initial_schema_with_namespace.sql` first

### Error: "relation does not exist"
**Solution:** Make sure you're querying with schema prefix:
```sql
-- Wrong
SELECT * FROM applications;

-- Correct
SELECT * FROM land_admin.applications;
```

### Can't see data from app
**Solution:** Check that Supabase client is configured with schema:
```typescript
// In src/lib/supabase.ts
createClient(url, key, {
  db: { schema: 'land_admin' }
})
```

### Want to drop only land_admin schema
```sql
-- Safe! Only drops Land Admin System, not other subsystems
DROP SCHEMA land_admin CASCADE;
```

---

## 📚 Benefits of This Approach

### 1. **Isolation**
Each subsystem has its own namespace. No conflicts!

### 2. **Same Table Names**
Different subsystems can have their own `profiles`, `applications`, etc.

### 3. **Easy Management**
```sql
-- Grant permissions to entire schema at once
GRANT ALL ON SCHEMA land_admin TO some_role;
```

### 4. **Clear Organization**
```sql
-- Easy to see which tables belong to which system
SELECT * FROM information_schema.tables
WHERE table_schema = 'land_admin';
```

### 5. **Safe Deletion**
```sql
-- Delete entire subsystem without affecting others
DROP SCHEMA land_admin CASCADE;
```

---

## 🎉 Next Steps

Now that your schema is set up:

1. ✅ Verify tables created
2. ✅ Check sample data loaded
3. 🔄 Connect dashboard to real data
4. 🔄 Make forms save to database
5. 🔄 Load GIS map from database

Your Land Administration System is now **completely isolated** from your other subsystems! 🎊

---

## 📖 Additional Resources

- [PostgreSQL Schemas Documentation](https://www.postgresql.org/docs/current/ddl-schemas.html)
- [Supabase Multi-Schema Support](https://supabase.com/docs/guides/api/using-custom-schemas)

Need help? All migrations have detailed comments explaining everything!
