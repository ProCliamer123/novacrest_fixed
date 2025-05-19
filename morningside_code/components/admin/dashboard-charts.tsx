"use client"

import { useEffect, useState } from "react"
import { clientStore } from "@/lib/client-store"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts"

export function DashboardCharts() {
  const [projectData, setProjectData] = useState<any[]>([])
  const [clientData, setClientData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (clientStore) {
      // Get project statistics
      const projectStats = clientStore.getProjectStatistics()
      const projectChartData = [
        { name: "Planning", value: projectStats.planning, fill: "#3b82f6" },
        { name: "Active", value: projectStats.active, fill: "#10b981" },
        { name: "On Hold", value: projectStats.onHold, fill: "#f59e0b" },
        { name: "Completed", value: projectStats.completed, fill: "#6366f1" },
        { name: "Cancelled", value: projectStats.cancelled, fill: "#ef4444" },
      ]
      setProjectData(projectChartData)

      // Get client statistics
      const clientStats = clientStore.getClientStatistics()
      const clientChartData = [
        { name: "Active", value: clientStats.active, fill: "#10b981" },
        { name: "Inactive", value: clientStats.inactive, fill: "#f59e0b" },
        { name: "Onboarding", value: clientStats.onboarding, fill: "#3b82f6" },
      ]
      setClientData(clientChartData)
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // If no data, show placeholder
  if (projectData.length === 0 || projectData.every((item) => item.value === 0)) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">No data available yet. Add some projects and clients to see analytics.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Projects by Status</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={projectData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {projectData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Clients by Status</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={clientData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {clientData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
