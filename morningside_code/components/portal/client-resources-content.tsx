"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getClientResources } from "@/lib/client-portal-service"
import { ClientResourcesList } from "@/components/portal/client-resources-list"

export function ClientResourcesContent() {
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResources = async () => {
      try {
        // Get client ID from localStorage
        const userJson = localStorage.getItem("user")
        const clientId = userJson ? JSON.parse(userJson).clientId : null

        if (!clientId) {
          setError("Client ID not found")
          setLoading(false)
          return
        }

        const data = await getClientResources(clientId)
        setResources(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching client resources:", err)
        setError("Failed to load resources")
        setLoading(false)
      }
    }

    fetchResources()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-white rounded-md">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (resources.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">No resources found</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Resources</CardTitle>
        <CardDescription>Documents and resources shared with you</CardDescription>
      </CardHeader>
      <CardContent>
        <ClientResourcesList resources={resources} />
      </CardContent>
    </Card>
  )
}
