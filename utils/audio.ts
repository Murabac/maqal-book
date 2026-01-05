import { createClient } from '@/lib/supabase/client'

export async function getSignedAudioUrl(bucket: string, path: string): Promise<string> {
  const supabase = createClient()
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 3600) // 1 hour expiry

  if (error) {
    throw new Error(`Failed to create signed URL: ${error.message}`)
  }

  return data.signedUrl
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}



