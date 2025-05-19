"use client"

import { useState, useEffect } from "react"

interface DashboardAnalyticsProps {
  fallbackMode?: boolean
}

export function DashboardAnalytics({ fallbackMode = false }: DashboardAnalyticsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-40 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
        <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2"></div>
      </div>
    )
  }

  if (error) {
    return <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-700">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
        <p className="text-gray-500">Analytics Chart Placeholder</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-green-50 rounded">
          <p className="text-sm font-medium text-green-800">Client Growth</p>
          <p className="text-xl font-bold text-green-600">+24%</p>
        </div>
        <div className="p-3 bg-blue-50 rounded">
          <p className="text-sm font-medium text-blue-800">Project Completion</p>
          <p className="text-xl font-bold text-blue-600">87%</p>
        </div>
      </div>
    </div>
  )
}
