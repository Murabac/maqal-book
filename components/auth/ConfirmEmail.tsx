'use client'

import { useState, useEffect } from 'react'
import { Headphones, Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function ConfirmEmail() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired' | 'pending'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if user is pending confirmation (from signup redirect)
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('pending') === 'true') {
      setStatus('pending')
      setMessage('Please check your email and click the confirmation link to verify your account.')
      return
    }
    const handleConfirmation = async () => {
      try {
        const supabase = createClient()
        
        // Get the token from URL hash (Supabase redirects with hash)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')
        
        // Also check query params (fallback)
        const urlParams = new URLSearchParams(window.location.search)
        const queryToken = urlParams.get('token')
        const queryType = urlParams.get('type')

        // If we have tokens in the hash, set the session
        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (error) {
            if (error.message.includes('expired') || error.message.includes('invalid')) {
              setStatus('expired')
              setMessage('This confirmation link has expired or is invalid. Please request a new one.')
            } else {
              setStatus('error')
              setMessage(error.message || 'Failed to confirm email. Please try again.')
            }
            return
          }

          if (data?.user) {
            setStatus('success')
            setMessage('Your email has been confirmed! Redirecting you to the app...')
            
            // Redirect after 2 seconds
            setTimeout(() => {
              router.push('/')
            }, 2000)
            return
          }
        }

        // Check if user is already confirmed (in case they visit the page directly)
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user?.email_confirmed_at) {
          setStatus('success')
          setMessage('Your email is already confirmed! Redirecting you to the app...')
          setTimeout(() => {
            router.push('/')
          }, 2000)
        } else if (!accessToken && !queryToken) {
          setStatus('error')
          setMessage('Invalid confirmation link. Please check your email for the correct link.')
        }
      } catch (err) {
        setStatus('error')
        setMessage('An unexpected error occurred. Please try again.')
      }
    }

    handleConfirmation()
  }, [router])

  const handleResendEmail = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user?.email) {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: user.email,
        })

        if (error) {
          setMessage('Failed to resend confirmation email. Please try again later.')
        } else {
          setMessage('Confirmation email sent! Please check your inbox.')
        }
      }
    } catch (err) {
      setMessage('Failed to resend confirmation email. Please try again later.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
            <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 p-2 sm:p-3 rounded-xl sm:rounded-2xl">
              <Headphones className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 bg-clip-text text-transparent">
            Maqal Book
          </h1>
        </div>

        {/* Confirmation Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="text-center">
            {status === 'loading' && (
              <>
                <div className="flex justify-center mb-4">
                  <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Confirming your email...
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Please wait while we verify your email address.
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 rounded-full p-4">
                    <CheckCircle className="w-16 h-16 text-green-600" />
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Email Confirmed!
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-6">
                  {message || 'Your email has been successfully confirmed. You can now access all features.'}
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg text-sm sm:text-base"
                >
                  Go to Home
                </button>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="flex justify-center mb-4">
                  <div className="bg-red-100 rounded-full p-4">
                    <XCircle className="w-16 h-16 text-red-600" />
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Confirmation Failed
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-6">
                  {message || 'We couldn\'t confirm your email. The link may be invalid or expired.'}
                </p>
                <div className="space-y-3">
                  <button
                    onClick={handleResendEmail}
                    className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg text-sm sm:text-base"
                  >
                    Resend Confirmation Email
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="w-full bg-white border-2 border-gray-200 text-gray-700 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    Go to Home
                  </button>
                </div>
              </>
            )}

            {status === 'expired' && (
              <>
                <div className="flex justify-center mb-4">
                  <div className="bg-orange-100 rounded-full p-4">
                    <Mail className="w-16 h-16 text-orange-600" />
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Link Expired
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-6">
                  {message || 'This confirmation link has expired. Please request a new confirmation email.'}
                </p>
                <div className="space-y-3">
                  <button
                    onClick={handleResendEmail}
                    className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg text-sm sm:text-base"
                  >
                    Resend Confirmation Email
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="w-full bg-white border-2 border-gray-200 text-gray-700 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    Go to Home
                  </button>
                </div>
              </>
            )}

            {status === 'pending' && (
              <>
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 rounded-full p-4">
                    <Mail className="w-16 h-16 text-blue-600" />
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Check Your Email
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-6">
                  {message || 'We\'ve sent a confirmation link to your email address. Please click the link to verify your account.'}
                </p>
                <div className="space-y-3">
                  <button
                    onClick={handleResendEmail}
                    className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg text-sm sm:text-base"
                  >
                    Resend Confirmation Email
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="w-full bg-white border-2 border-gray-200 text-gray-700 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    Go to Home
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            Need help?{' '}
            <button
              onClick={() => router.push('/')}
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              Contact Support
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

