"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { checkPermission } from "@/app/actions/user-actions"

interface PermissionGateProps {
  permission: string
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function PermissionGate({ permission, fallback, children }: PermissionGateProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkUserPermission() {
      try {
        const result = await checkPermission(permission)
        setHasPermission(result)
      } catch (error) {
        console.error("Error checking permission:", error)
        setHasPermission(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkUserPermission()
  }, [permission])

  if (isLoading) {
    return null // Or a loading indicator
  }

  if (!hasPermission) {
    return fallback ? <>{fallback}</> : null
  }

  return <>{children}</>
}
