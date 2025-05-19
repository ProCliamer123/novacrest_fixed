"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { clientStore, type Resource } from "@/lib/client-store"
import { ResourcesGrid } from "@/components/admin/resources-grid"

export default function ResourcesPage() {
  const router = useRouter()
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const adminAuthenticated = localStorage.getItem("adminAuthenticated") === "true"

    if (!adminAuthenticated) {
      router.push("/admin/login")
      return
    }

    setIsAuthenticated(true)

    // Load resources
    if (clientStore) {
      setResources(clientStore.getResources())
    }

    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Resources</h2>
        <Button asChild>
          <Link href="/admin/resources/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Resource
          </Link>
        </Button>
      </div>

      <ResourcesGrid resources={resources} />
    </div>
  )
}
