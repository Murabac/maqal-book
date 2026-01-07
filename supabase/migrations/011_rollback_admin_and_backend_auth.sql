-- Rollback Migration: Remove Admin and Backend User Authentication Changes
-- This migration removes all tables, functions, and changes made for custom authentication

-- ============================================================================
-- 1. Drop Categories Table
-- ============================================================================
-- Drop related objects first (only if table exists), then the table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'categories') THEN
        DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
        DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
        DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
        DROP INDEX IF EXISTS idx_categories_name;
    END IF;
END $$;

DROP TABLE IF EXISTS public.categories CASCADE;

-- ============================================================================
-- 2. Drop Admin Authentication Tables
-- ============================================================================

-- Drop admin sessions table first (has foreign key to admins)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_sessions') THEN
        DROP POLICY IF EXISTS "Admins can manage admin_sessions" ON public.admin_sessions;
        DROP POLICY IF EXISTS "Admins can view admin_sessions" ON public.admin_sessions;
        DROP TRIGGER IF EXISTS update_admin_sessions_updated_at ON public.admin_sessions;
        DROP INDEX IF EXISTS idx_admin_sessions_token;
        DROP INDEX IF EXISTS idx_admin_sessions_admin_id;
    END IF;
END $$;

DROP TABLE IF EXISTS public.admin_sessions CASCADE;

-- Drop admins table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admins') THEN
        DROP POLICY IF EXISTS "Admins can manage admins" ON public.admins;
        DROP POLICY IF EXISTS "Admins can view admins" ON public.admins;
        DROP TRIGGER IF EXISTS update_admins_updated_at ON public.admins;
        DROP TRIGGER IF EXISTS update_admins_last_login ON public.admins;
        DROP INDEX IF EXISTS idx_admins_email;
    END IF;
END $$;

DROP TABLE IF EXISTS public.admins CASCADE;

-- ============================================================================
-- 3. Drop Backend User Authentication Tables
-- ============================================================================

-- Drop user sessions table first (has foreign key to backend_users)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_sessions') THEN
        DROP POLICY IF EXISTS "Users can manage user_sessions" ON public.user_sessions;
        DROP POLICY IF EXISTS "Users can view user_sessions" ON public.user_sessions;
        DROP TRIGGER IF EXISTS update_user_sessions_updated_at ON public.user_sessions;
        DROP INDEX IF EXISTS idx_user_sessions_token;
        DROP INDEX IF EXISTS idx_user_sessions_user_id;
    END IF;
END $$;

DROP TABLE IF EXISTS public.user_sessions CASCADE;

-- Drop backend_users table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'backend_users') THEN
        DROP POLICY IF EXISTS "Admins can manage backend_users" ON public.backend_users;
        DROP POLICY IF EXISTS "Users can view own backend_user" ON public.backend_users;
        DROP TRIGGER IF EXISTS update_backend_users_updated_at ON public.backend_users;
        DROP TRIGGER IF EXISTS update_backend_users_last_login ON public.backend_users;
        DROP INDEX IF EXISTS idx_backend_users_email;
    END IF;
END $$;

DROP TABLE IF EXISTS public.backend_users CASCADE;

-- ============================================================================
-- 4. Drop Functions Created for Admin/Backend Auth
-- ============================================================================

-- Drop admin-related functions
DROP FUNCTION IF EXISTS public.check_admin_credentials(TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.update_admin_last_login(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

-- Drop backend user-related functions
DROP FUNCTION IF EXISTS public.check_user_credentials(TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.update_user_last_login(UUID) CASCADE;

-- ============================================================================
-- 5. Revert Foreign Key Changes (if they were changed)
-- ============================================================================
-- Note: If user_favorites and listening_progress were changed to reference
-- backend_users instead of users, you'll need to:
-- 1. Drop the existing foreign key constraints
-- 2. Re-add them pointing back to public.users

-- Check if foreign keys need to be reverted in user_favorites
DO $$
BEGIN
    -- If user_favorites references backend_users, revert it
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name LIKE '%backend_users%' 
        AND table_name = 'user_favorites'
    ) THEN
        -- Drop foreign key constraint if it references backend_users
        ALTER TABLE public.user_favorites 
        DROP CONSTRAINT IF EXISTS user_favorites_user_id_fkey CASCADE;
        
        -- Re-add foreign key pointing to public.users
        ALTER TABLE public.user_favorites
        ADD CONSTRAINT user_favorites_user_id_fkey 
        FOREIGN KEY (user_id) 
        REFERENCES public.users(id) 
        ON DELETE CASCADE;
    END IF;
END $$;

-- Check if foreign keys need to be reverted in listening_progress
DO $$
BEGIN
    -- If listening_progress references backend_users, revert it
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name LIKE '%backend_users%' 
        AND table_name = 'listening_progress'
    ) THEN
        -- Drop foreign key constraint if it references backend_users
        ALTER TABLE public.listening_progress 
        DROP CONSTRAINT IF EXISTS listening_progress_user_id_fkey CASCADE;
        
        -- Re-add foreign key pointing to public.users
        ALTER TABLE public.listening_progress
        ADD CONSTRAINT listening_progress_user_id_fkey 
        FOREIGN KEY (user_id) 
        REFERENCES public.users(id) 
        ON DELETE CASCADE;
    END IF;
END $$;

-- ============================================================================
-- 6. Drop RLS Policies Created for Admin/Backend Auth
-- ============================================================================
-- Note: Policies are dropped when tables are dropped, but we handle them
-- above before dropping tables to avoid dependency issues

-- ============================================================================
-- 7. Additional cleanup for any remaining objects
-- ============================================================================
-- Drop any remaining indexes (should already be dropped, but just in case)
DO $$
BEGIN
    -- Categories indexes
    DROP INDEX IF EXISTS idx_categories_name;
    
    -- Admin session indexes
    DROP INDEX IF EXISTS idx_admin_sessions_token;
    DROP INDEX IF EXISTS idx_admin_sessions_admin_id;
    DROP INDEX IF EXISTS idx_admin_sessions_expires_at;
    
    -- Admin indexes
    DROP INDEX IF EXISTS idx_admins_email;
    
    -- User session indexes
    DROP INDEX IF EXISTS idx_user_sessions_token;
    DROP INDEX IF EXISTS idx_user_sessions_user_id;
    DROP INDEX IF EXISTS idx_user_sessions_expires_at;
    
    -- Backend user indexes
    DROP INDEX IF EXISTS idx_backend_users_email;
END $$;

-- ============================================================================
-- 8. Drop Triggers (automatically dropped with tables)
-- ============================================================================
-- These are handled automatically when tables are dropped, but listed for reference:
-- - update_categories_updated_at trigger
-- - update_admin_sessions_updated_at trigger  
-- - update_user_sessions_updated_at trigger

-- ============================================================================
-- Cleanup Complete
-- ============================================================================
-- All admin and backend user authentication changes have been removed.
-- The database is now back to using Supabase Auth for user authentication.

