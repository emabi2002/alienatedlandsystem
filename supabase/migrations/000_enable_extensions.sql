-- =============================================
-- ENABLE REQUIRED EXTENSIONS
-- =============================================
-- Run this FIRST before any other migrations
-- Note: UUID generation uses gen_random_uuid() built into PostgreSQL 13+
-- =============================================

-- Enable PostGIS for GIS/mapping functionality
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Verify extension is enabled
SELECT 'PostGIS extension enabled successfully!' AS message,
       (SELECT COUNT(*) FROM pg_extension WHERE extname = 'postgis') AS postgis_enabled;
