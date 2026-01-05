'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ArrowLeft, Upload, Save, X, Sparkles, ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useUserProfile } from '@/hooks/useUserProfile'
import { createClient } from '@/lib/supabase/client'

type AvatarMode = 'upload' | 'generate'

const avatarStyles = [
  { name: 'Avataaars', value: 'avataaars' },
  { name: 'Bottts', value: 'bottts' },
  { name: 'Fun', value: 'fun-emoji' },
  { name: 'Lorelei', value: 'lorelei' },
  { name: 'Micah', value: 'micah' },
  { name: 'Miniavs', value: 'miniavs' },
  { name: 'Open Peeps', value: 'open-peeps' },
  { name: 'Personas', value: 'personas' },
  { name: 'Shapes', value: 'shapes' },
]

export function EditProfile() {
  const router = useRouter()
  const { profile, loading: profileLoading, updateProfile } = useUserProfile()
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [email, setEmail] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [avatarMode, setAvatarMode] = useState<AvatarMode>('generate')
  const [selectedStyle, setSelectedStyle] = useState('avataaars')
  const [avatarSeed, setAvatarSeed] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setAvatarUrl(profile.avatar_url || '')
      setEmail(profile.email || '')
      // Generate a seed from user ID or email for consistent avatar generation
      setAvatarSeed(profile.id || profile.email || Math.random().toString(36).substring(7))
    }
  }, [profile])

  // Generate avatar URL from DiceBear API
  const generateAvatarUrl = (style: string, seed: string) => {
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`
  }

  const handleGenerateAvatar = () => {
    // Generate a completely new random seed
    const newSeed = Math.random().toString(36).substring(7) + Date.now()
    setAvatarSeed(newSeed)
    const generatedUrl = generateAvatarUrl(selectedStyle, newSeed)
    setAvatarUrl(generatedUrl)
  }

  const handleStyleChange = (style: string) => {
    setSelectedStyle(style)
    // Always use the current seed - don't generate a new one
    // This allows users to see the same character in different styles
    const seedToUse = avatarSeed || (profile?.id || profile?.email || 'default-seed')
    // Only set seed if we don't have one yet and we have a profile
    if (!avatarSeed && seedToUse !== 'default-seed') {
      setAvatarSeed(seedToUse)
    }
    // Update avatar URL with the same seed but different style
    setAvatarUrl(generateAvatarUrl(style, seedToUse))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Create a unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        // If bucket doesn't exist, try public URL instead
        console.warn('Storage upload failed, using object URL:', uploadError)
        // For now, we'll use a placeholder or data URL
        const reader = new FileReader()
        reader.onloadend = () => {
          setAvatarUrl(reader.result as string)
          setUploading(false)
        }
        reader.readAsDataURL(file)
        return
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setAvatarUrl(publicUrl)
    } catch (err) {
      console.error('Error uploading image:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const updates: { full_name?: string; avatar_url?: string } = {}
      
      if (fullName !== profile?.full_name) {
        updates.full_name = fullName || null
      }
      
      if (avatarUrl !== profile?.avatar_url) {
        updates.avatar_url = avatarUrl || null
      }

      const success = await updateProfile(updates)
      
      if (success) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/profile')
          router.refresh()
        }, 1500)
      } else {
        setError('Failed to update profile')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 pb-32">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm sm:text-base font-medium">Back</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Profile</h1>
            <button
              onClick={handleSave}
              disabled={saving || uploading}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white px-4 py-2 rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">Save</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-2xl">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800">
            Profile updated successfully!
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
            {error}
          </div>
        )}

        {/* Profile Picture */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-md mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Profile Picture</h2>
          
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => {
                setAvatarMode('generate')
                // Initialize seed if switching to generate mode and we don't have one
                if (!avatarSeed && profile) {
                  const initialSeed = profile.id || profile.email || Math.random().toString(36).substring(7)
                  setAvatarSeed(initialSeed)
                  setAvatarUrl(generateAvatarUrl(selectedStyle, initialSeed))
                } else if (avatarSeed && !avatarUrl) {
                  // If we have a seed but no avatar URL, generate one
                  setAvatarUrl(generateAvatarUrl(selectedStyle, avatarSeed))
                }
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                avatarMode === 'generate'
                  ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Avatar</span>
            </button>
            <button
              onClick={() => setAvatarMode('upload')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                avatarMode === 'upload'
                  ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Upload Image</span>
            </button>
          </div>

          {/* Preview */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
            <div className="relative">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-purple-200 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Profile"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                    unoptimized={avatarUrl.includes('dicebear.com')}
                  />
                ) : (
                  <span className="text-4xl sm:text-5xl">👤</span>
                )}
              </div>
              {uploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            {avatarUrl && (
              <button
                onClick={() => setAvatarUrl('')}
                className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Remove
              </button>
            )}
          </div>

          {/* Generate Avatar Section */}
          {avatarMode === 'generate' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Avatar Style
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {avatarStyles.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => handleStyleChange(style.value)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        selectedStyle === style.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                        <img
                          src={generateAvatarUrl(style.value, avatarSeed || (profile?.id || profile?.email || style.value + '-preview'))}
                          alt={style.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs font-medium text-gray-700 truncate">{style.name}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Customize Seed (optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={avatarSeed}
                    onChange={(e) => {
                      setAvatarSeed(e.target.value)
                      if (e.target.value) {
                        setAvatarUrl(generateAvatarUrl(selectedStyle, e.target.value))
                      }
                    }}
                    placeholder="Enter a seed (name, word, etc.)"
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 bg-white"
                  />
                  <button
                    onClick={handleGenerateAvatar}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                  >
                    Random
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Use the same seed to get the same avatar, or generate random ones
                </p>
              </div>
            </div>
          )}

          {/* Upload Section */}
          {avatarMode === 'upload' && (
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Choose Image to Upload'}
              </button>
              <p className="text-xs sm:text-sm text-gray-500 text-center">
                JPG, PNG or GIF. Max size 5MB
              </p>
            </div>
          )}
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-md">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
          
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 bg-white"
              />
            </div>

            {/* Email (Read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

