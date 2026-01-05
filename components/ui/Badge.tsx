'use client'

interface BadgeProps {
  icon: string
  title: string
  description: string
  unlocked: boolean
  date: string
}

export function Badge({ icon, title, description, unlocked, date }: BadgeProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 text-center transition-all duration-300 ${
        unlocked
          ? 'bg-white shadow-md hover:shadow-xl'
          : 'bg-gray-100 opacity-60'
      }`}
    >
      {unlocked && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
        </div>
      )}
      <div className={`text-5xl mb-3 ${unlocked ? '' : 'grayscale opacity-50'}`}>
        {icon}
      </div>
      <h3 className={`font-semibold mb-1 ${unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
        {title}
      </h3>
      <p className={`text-xs mb-2 ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
        {description}
      </p>
      {unlocked && date && (
        <p className="text-xs text-purple-600 font-medium">{date}</p>
      )}
      {!unlocked && (
        <p className="text-xs text-gray-400 font-medium">Locked</p>
      )}
    </div>
  )
}



