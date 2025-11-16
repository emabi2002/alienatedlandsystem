-- =============================================
-- CLEANUP SCRIPT
-- =============================================
-- ⚠️ WARNING: This will DELETE ALL DATA in these tables!
-- Only run this in development or if you want to start fresh
-- =============================================

-- Drop all views first
DROP VIEW IF EXISTS application_summary CASCADE;
DROP VIEW IF EXISTS active_leases_summary CASCADE;
DROP VIEW IF EXISTS dashboard_statistics CASCADE;
DROP VIEW IF EXISTS monthly_application_stats CASCADE;

-- Drop all tables (in reverse order of dependencies)
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

-- Drop all custom types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS application_status CASCADE;
DROP TYPE IF EXISTS application_type CASCADE;
DROP TYPE IF EXISTS lease_status CASCADE;
DROP TYPE IF EXISTS parcel_status CASCADE;
DROP TYPE IF EXISTS meeting_status CASCADE;
DROP TYPE IF EXISTS decision_type CASCADE;
DROP TYPE IF EXISTS financing_method CASCADE;
DROP TYPE IF EXISTS applicant_category CASCADE;

-- Drop all custom functions
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
DROP FUNCTION IF EXISTS generate_application_number CASCADE;
DROP FUNCTION IF EXISTS generate_lease_number CASCADE;
DROP FUNCTION IF EXISTS set_application_number CASCADE;

-- Success message
SELECT 'Database cleaned successfully! All tables and types dropped.' AS message;
