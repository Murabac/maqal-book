# Supabase Database Setup

This directory contains SQL migrations for setting up the Maqal Book database schema.

## Setup Instructions

### 1. Run Migrations in Order

Run these migrations in your Supabase SQL Editor in the following order:

1. **`migrations/001_create_audiobooks_table.sql`**
   - Creates the `maqal-book` schema
   - Creates the `audiobooks` table with sample data
   - Sets up indexes and RLS policies

2. **`migrations/002_create_users_table.sql`**
   - Creates the `users` table that extends `auth.users`
   - Sets up automatic profile creation trigger
   - Configures RLS policies for user data

3. **`migrations/003_create_user_favorites_table.sql`**
   - Creates the `user_favorites` table
   - Links users to their favorite audiobooks
   - Sets up RLS policies

4. **`migrations/004_create_listening_progress_table.sql`**
   - Creates the `listening_progress` table
   - Tracks user progress for each chapter
   - Sets up RLS policies

### 2. Set up Storage Buckets

Go to Storage in your Supabase dashboard and create:

- **`audiobook-covers`** (public bucket)
  - For storing audiobook cover images
  - Public access for displaying covers

- **`audiobook-files`** (private bucket)
  - For storing actual audio files
  - Private access with signed URLs for secure streaming

### 3. Configure Authentication

1. **Enable Email Authentication**
   - Go to Authentication > Providers in Supabase dashboard
   - Enable Email provider
   - Configure email templates if needed

2. **Enable OAuth Providers (Optional)**
   - Go to Authentication > Providers
   - Enable Google OAuth
   - Add your OAuth credentials (Client ID and Secret)
   - Set redirect URL to: `https://your-domain.com/api/auth/callback`

3. **Configure Site URL**
   - Go to Authentication > URL Configuration
   - Set Site URL to your app URL (e.g., `http://localhost:3000` for development)
   - Add redirect URLs for OAuth callbacks

### 4. Environment Variables

Make sure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Database Schema Overview

- **`maqal-book.users`**: User profiles extending auth.users
- **`maqal-book.audiobooks`**: Audiobook catalog
- **`maqal-book.user_favorites`**: User favorite audiobooks
- **`maqal-book.listening_progress`**: User listening progress per chapter

All tables have Row Level Security (RLS) enabled for data protection.
