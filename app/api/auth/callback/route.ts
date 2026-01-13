import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createCustomer } from '@/utils/supabase/customers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const token = requestUrl.searchParams.get('token')
  const type = requestUrl.searchParams.get('type')
  const origin = requestUrl.origin

  const supabase = await createClient()

  // Handle OAuth callback with code
  if (code) {
    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && sessionData?.user) {
      // Create customer profile for OAuth signup
      const user = sessionData.user
      const fullName = user.user_metadata?.full_name || user.user_metadata?.name || ''
      await createCustomer(
        supabase,
        user.id,
        user.email || '',
        fullName
      )
      return NextResponse.redirect(`${origin}/`)
    }
  }

  // Handle email confirmation token
  if (token && type === 'signup') {
    // Redirect to confirm email page with token
    return NextResponse.redirect(`${origin}/confirm-email?token=${token}&type=${type}`)
  }

  // Handle email confirmation via hash (from email links)
  const hash = requestUrl.hash
  if (hash && hash.includes('access_token')) {
    // Extract token from hash
    const hashParams = new URLSearchParams(hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const tokenType = hashParams.get('type')
    
    if (accessToken && tokenType === 'signup') {
      return NextResponse.redirect(`${origin}/confirm-email#access_token=${accessToken}&type=${tokenType}`)
    }
  }

  // Default redirect
  return NextResponse.redirect(`${origin}/`)
}

