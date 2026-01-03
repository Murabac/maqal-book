'use client'

interface CategoryCardProps {
  name: string
  count: number
  gradient: string
  icon: string
  onClick?: () => void
}

export function CategoryCard({ name, count, gradient, icon, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-xl"
    >
      <div className={`absolute inset-0 ${gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
      <div className="relative z-10">
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className="text-white font-semibold mb-1">{name}</h3>
        <p className="text-white/90 text-sm">{count} audiobooks</p>
      </div>
    </button>
  )
}

