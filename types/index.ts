export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

export interface Audiobook {
  id: string
  title: string
  author_id: string
  author_name: string // From authors table join
  author_bio?: string | null // From authors table join
  category_id: string
  category_name: string // From categories table join
  category_description?: string | null // From categories table join
  cover: string
  duration: string // e.g., "8h 30m"
  language: 'English' | 'Arabic' | 'Somali'
  created_at?: string
  updated_at?: string
  // Legacy fields for backward compatibility (deprecated - use author_name and category_name)
  author?: string
  category?: string
}

export interface Category {
  id: string
  name: string
  description?: string | null
  created_at?: string
  updated_at?: string
}

export interface Author {
  id: string
  name: string
  bio?: string | null
  created_at?: string
  updated_at?: string
}

export interface Chapter {
  id: string
  audiobook_id: string
  title: string
  chapter_number: number
  audio_url: string
  duration: number // duration in seconds
  created_at: string
}

export interface ListeningProgress {
  id: string
  user_id: string
  chapter_id: string
  audiobook_id: string
  current_time: number // current playback position in seconds
  completed: boolean
  updated_at: string
}

export interface Playlist {
  id: string
  user_id: string
  name: string
  description?: string
  created_at: string
}

export type PageType = 'home' | 'profile' | 'login' | 'signup' | 'favorites' | 'library' | 'edit-profile'

