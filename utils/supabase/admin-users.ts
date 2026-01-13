import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Check if a user is an admin user (has dashboard access)
 * Uses RPC function to ensure we query from maqal-book schema
 * Use this to prevent admin users from accessing the customer frontend
 */
export async function isAdminUser(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  // First try RPC function (queries from maqal-book schema)
  try {
    const { data, error } = await supabase.rpc('is_admin_user', {
      user_id: userId,
    })

    if (!error && typeof data === 'boolean') {
      return data
    }
  } catch (rpcError) {
    console.log('RPC is_admin_user failed, trying direct query:', rpcError)
  }

  // Fallback: Try querying directly
  // Note: This will query from public schema - tables should be in public schema for Supabase client
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', userId)
      .single()

    if (!error && data) {
      return true
    }
  } catch (viewError) {
    console.log('View query failed:', viewError)
  }

  return false
}
