import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // During build time, if env vars are missing, return a mock client
  // This prevents build failures when env vars aren't available
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client that won't break during build
    // This will only happen during static generation if env vars aren't set
    return createBrowserClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseAnonKey || 'placeholder-key',
      {
        db: { schema: 'maqal-book' },
      }
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    db: { schema: 'maqal-book' },
  })
}


