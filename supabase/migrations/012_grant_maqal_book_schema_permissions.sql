-- Grant permissions on maqal-book schema to anon and authenticated roles
-- This allows Supabase clients to query tables in the maqal-book schema

-- Grant usage on the schema
GRANT USAGE ON SCHEMA "maqal-book" TO anon, authenticated, service_role;

-- Grant all privileges on all existing tables in the schema
GRANT ALL ON ALL TABLES IN SCHEMA "maqal-book" TO anon, authenticated, service_role;

-- Grant all privileges on all existing sequences in the schema
GRANT ALL ON ALL SEQUENCES IN SCHEMA "maqal-book" TO anon, authenticated, service_role;

-- Grant all privileges on all existing functions in the schema
GRANT ALL ON ALL ROUTINES IN SCHEMA "maqal-book" TO anon, authenticated, service_role;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA "maqal-book" 
  GRANT ALL ON TABLES TO anon, authenticated, service_role;

-- Set default privileges for future sequences
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA "maqal-book" 
  GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- Set default privileges for future functions
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA "maqal-book" 
  GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
