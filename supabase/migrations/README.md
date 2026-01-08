# Database Migrations

This directory contains SQL migration files for the Maqal Book application.

## Migration Files

### 001_create_audiobooks_table.sql
Creates the main audiobooks catalog table with:
- Basic audiobook information (title, author, cover, duration, category, language)
- Indexes for performance
- RLS policies for public read access
- Sample data (18 audiobooks in English, Arabic, and Somali)

### 002_create_users_table.sql
Creates the user profiles table that extends Supabase Auth:
- Links to `auth.users` via foreign key
- Stores additional profile data (listening stats, level, XP)
- Automatic profile creation trigger on user signup
- RLS policies for user data protection

### 003_create_user_favorites_table.sql
Creates the favorites junction table:
- Links users to their favorite audiobooks
- Unique constraint to prevent duplicates
- RLS policies for user-specific access

### 004_create_listening_progress_table.sql
Creates the listening progress tracking table:
- Tracks progress for each chapter of each audiobook
- Stores current time and completion status
- RLS policies for user-specific access

## Running Migrations

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Run each migration file in order (001, 002, 003, 004)
4. Verify tables were created in the Table Editor

## Notes

- All migrations use the `maqal-book` schema
- RLS (Row Level Security) is enabled on all tables
- Triggers automatically create user profiles on signup
- UUIDs are auto-generated using `gen_random_uuid()`






