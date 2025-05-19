"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function TestPage() {
  const router = useRouter()
  const [authStatus, setAuthStatus] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    // Read from localStorage
    const isAuth = localStorage.getItem("adminAuthenticated")
    const userEmail = localStorage.getItem("adminEmail")

    setAuthStatus(isAuth)
    setEmail(userEmail)
  }, [])

  const handleSetAuth = () => {
    localStorage.setItem("adminAuthenticated", "true")
    localStorage.setItem("adminEmail", "test@example.com")

    // Update state
    setAuthStatus("true")
    setEmail("test@example.com")
  }

  const handleClearAuth = () => {
    localStorage.removeItem("adminAuthenticated")
    localStorage.removeItem("adminEmail")

    // Update state
    setAuthStatus(null)
    setEmail(null)
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>LocalStorage Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p>
              <strong>Authentication Status:</strong> {authStatus || "Not set"}
            </p>
            <p>
              <strong>Email:</strong> {email || "Not set"}
            </p>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleSetAuth}>Set Auth</Button>
            <Button variant="destructive" onClick={handleClearAuth}>
              Clear Auth
            </Button>
            <Button variant="outline" onClick={() => router.push("/admin/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
