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
  author: string
  cover: string
  duration: string // e.g., "8h 30m"
  category: string
  language: 'English' | 'Arabic' | 'Somali'
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

export type PageType = 'home' | 'profile' | 'login' | 'signup' | 'favorites' | 'library'

