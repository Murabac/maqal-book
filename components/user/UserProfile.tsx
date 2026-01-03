'use client'

import Image from 'next/image'
import { TrendingUp, Award, Clock, BookOpen, Target, Settings, ChevronRight, LogOut } from 'lucide-react'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { StatCard } from '@/components/ui/StatCard'
import { Badge } from '@/components/ui/Badge'
import { CurrentlyReading } from '@/components/audiobook/CurrentlyReading'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import type { Audiobook } from '@/types'

interface UserProfileProps {
  onPlayBook: (book: Audiobook) => void
}

export function UserProfile({ onPlayBook }: UserProfileProps) {
  const { signOut } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  const currentBook = {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    cover: 'https://images.unsplash.com/photo-1604435062356-a880b007922c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    progress: 67,
    timeLeft: '2h 45m',
    language: 'English' as const,
  }

  const stats = [
    {
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      label: 'Listening Time',
      value: '127h',
      gradient: 'bg-gradient-to-br from-purple-500 to-purple-600',
      trend: '+12h this week',
    },
    {
      icon: <BookOpen className="w-6 h-6 text-pink-600" />,
      label: 'Books Completed',
      value: '23',
      gradient: 'bg-gradient-to-br from-pink-500 to-pink-600',
      trend: '2 this month',
    },
    {
      icon: <Target className="w-6 h-6 text-orange-600" />,
      label: 'Current Streak',
      value: '14🔥',
      gradient: 'bg-gradient-to-br from-orange-500 to-orange-600',
      trend: 'Personal best!',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
      label: 'Level',
      value: 'Explorer',
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
      trend: '340/500 XP to Scholar',
    },
  ]

  const badges = [
    {
      icon: '🔥',
      title: '7-Day Streak',
      description: '7 days of knowledge',
      unlocked: true,
      date: 'Jan 2025',
    },
    {
      icon: '📚',
      title: 'First Chapter',
      description: 'Complete your first book',
      unlocked: true,
      date: 'Dec 2024',
    },
    {
      icon: '⭐',
      title: 'Early Bird',
      description: 'Listen before 8 AM',
      unlocked: true,
      date: 'Jan 2025',
    },
    {
      icon: '🌙',
      title: 'Night Owl',
      description: 'Listen after 10 PM',
      unlocked: true,
      date: 'Dec 2024',
    },
    {
      icon: '🎯',
      title: '100 Hours',
      description: 'Total listening time',
      unlocked: true,
      date: 'Jan 2025',
    },
    {
      icon: '💎',
      title: 'Genre Explorer',
      description: 'Listen to 5 genres',
      unlocked: true,
      date: 'Dec 2024',
    },
    {
      icon: '🏆',
      title: '30-Day Streak',
      description: '30 days of learning',
      unlocked: false,
      date: '',
    },
    {
      icon: '🌟',
      title: 'Speed Listener',
      description: 'Finish 3 books in a week',
      unlocked: false,
      date: '',
    },
  ]

  const weeklyProgress = [
    { day: 'Mon', minutes: 45, goal: 60 },
    { day: 'Tue', minutes: 60, goal: 60 },
    { day: 'Wed', minutes: 30, goal: 60 },
    { day: 'Thu', minutes: 75, goal: 60 },
    { day: 'Fri', minutes: 50, goal: 60 },
    { day: 'Sat', minutes: 90, goal: 60 },
    { day: 'Sun', minutes: 65, goal: 60 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 pb-32">
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 p-1">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl">👤</span>
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold shadow-lg">
                  Explorer
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Sarah Anderson</h1>
                <p className="text-sm sm:text-base text-gray-600">Member since Dec 2024</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                    <span className="text-orange-500">🔥</span>
                    <span className="font-semibold">14 day streak</span>
                  </div>
                  <span className="text-gray-400 hidden sm:inline">•</span>
                  <div className="text-xs sm:text-sm text-gray-600">
                    <span className="font-semibold">340/500</span> XP to Scholar
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors text-sm sm:text-base"
                title="Logout"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 transition-all duration-500 rounded-full"
              style={{ width: '68%' }}
            />
          </div>
          <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
            <span>Listener</span>
            <span className="font-semibold text-purple-600">Explorer (340 XP)</span>
            <span>Scholar</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Currently Reading */}
        <CurrentlyReading book={currentBook} onPlay={() => onPlayBook(currentBook as Audiobook)} />

        {/* Stats Grid */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Your Stats</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md overflow-x-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Weekly Activity</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Daily goal: 60 minutes</p>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-xs sm:text-sm text-gray-600">This week</div>
              <div className="text-xl sm:text-2xl font-bold text-purple-600">7h 5m</div>
            </div>
          </div>
          <div className="flex items-end justify-between gap-1 sm:gap-2 h-32 sm:h-48 min-w-[400px] sm:min-w-0">
            {weeklyProgress.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-1 sm:gap-2">
                <div className="w-full flex flex-col justify-end h-24 sm:h-40">
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${
                      day.minutes >= day.goal
                        ? 'bg-gradient-to-t from-purple-600 via-blue-600 to-teal-500'
                        : 'bg-gradient-to-t from-purple-300 to-blue-300'
                    }`}
                    style={{ height: `${Math.min((day.minutes / 120) * 100, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600 font-medium">{day.day}</div>
                {day.minutes >= day.goal && <div className="text-xs">✓</div>}
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 sm:p-4 bg-purple-50 rounded-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  Finish your chapter today
                </span>
              </div>
              <span className="text-xs text-purple-600 font-semibold">25 min left</span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Achievements</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">6 of 8 unlocked</p>
            </div>
            <button className="text-sm sm:text-base text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1">
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {badges.map((badge) => (
              <Badge key={badge.title} {...badge} />
            ))}
          </div>
        </div>

        {/* Recent Listening */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Recent Listening</h2>
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md divide-y divide-gray-100">
            {[
              {
                title: 'The Midnight Library',
                author: 'Matt Haig',
                time: '45 min',
                date: 'Today',
                progress: 67,
              },
              {
                title: 'The Starless Sea',
                author: 'Erin Morgenstern',
                time: '1h 20 min',
                date: 'Yesterday',
                progress: 34,
              },
              {
                title: 'Beach Read',
                author: 'Emily Henry',
                time: '30 min',
                date: '2 days ago',
                progress: 89,
              },
            ].map((item, i) => (
              <div key={i} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm sm:text-base text-gray-900 truncate">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{item.author}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-xs sm:text-sm font-medium text-gray-900">{item.time}</div>
                    <div className="text-xs text-gray-500">{item.date}</div>
                  </div>
                </div>
                <div className="mt-2 sm:mt-3">
                  <div className="bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 transition-all duration-500"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
