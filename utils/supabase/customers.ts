import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Helper function to insert a customer into the customers table in maqal-book schema
 * This is for regular customers who don't have dashboard access
 */
export async function createCustomer(
  supabase: SupabaseClient,
  userId: string,
  email: string,
  fullName: string,
  subscriptionTier?: string
) {
  // First try RPC function (queries from maqal-book schema)
  const { error: rpcError } = await supabase.rpc('create_customer', {
    user_id: userId,
    user_email: email,
    user_full_name: fullName,
    subscription_tier: subscriptionTier || null,
  })

  if (!rpcError) {
    return { success: true, error: null }
  }

  // If RPC fails, try direct insert (requires proper permissions)
  // Note: This will query from public schema - tables should be in public schema for Supabase client
  const { error: insertError } = await supabase
    .from('customers')
    .insert({
      id: userId,
      email: email,
      full_name: fullName,
      subscription_tier: subscriptionTier || null,
    })

  if (!insertError) {
    return { success: true, error: null }
  }

  return { success: false, error: rpcError || insertError }
}

/**
 * Helper function to get customer data from the customers table in maqal-book schema
 * Uses RPC function to ensure we query from the correct schema
 */
export async function getCustomerData(
  supabase: SupabaseClient,
  userId: string
) {
  // First try RPC function (queries from maqal-book schema)
  try {
    const { data, error } = await supabase.rpc('get_customer', {
      user_id: userId,
    })

    if (!error && data && data.length > 0) {
      const customerData = data[0]
      return {
        data: {
          full_name: customerData.full_name,
          email: customerData.email,
          subscription_tier: customerData.subscription_tier,
          id: customerData.id,
          created_at: customerData.created_at,
          updated_at: customerData.updated_at,
          // Include additional fields if they exist in customer table
          listening_time_minutes: customerData.listening_time_minutes,
          books_completed: customerData.books_completed,
          current_streak: customerData.current_streak,
          level: customerData.level,
          xp: customerData.xp,
          avatar_url: customerData.avatar_url,
        },
        error: null,
      }
    }
  } catch (rpcError) {
    console.log('RPC get_customer failed, trying direct query:', rpcError)
  }

  // Fallback: Try querying directly
  // Note: This will query from public schema - tables should be in public schema for Supabase client
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', userId)
      .single()

    if (!error && data) {
      return { data, error: null }
    }
  } catch (viewError) {
    console.log('View query failed:', viewError)
  }

  return { data: null, error: new Error('Could not fetch customer data') }
}
