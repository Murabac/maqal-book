'use client'

import React from 'react'

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  gradient: string
  trend?: string
}

export function StatCard({ icon, label, value, gradient, trend }: StatCardProps) {
  return (
    <div className="relative overflow-hidden bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 group">
      <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
      <div className="relative z-10">
        <div className={`inline-flex p-3 rounded-xl ${gradient} bg-opacity-10 mb-3`}>
          {icon}
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="text-sm text-gray-600">{label}</div>
        {trend && (
          <div className="text-xs text-purple-600 mt-2 font-medium">{trend}</div>
        )}
      </div>
    </div>
  )
}




