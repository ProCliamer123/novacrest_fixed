"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getUser, logout } from "@/lib/client-auth"

export default function TestAuthPage() {
  const [user, setUser] = useState<any>(null)
  const [authStatus, setAuthStatus] = useState<string>("Checking...")

  useEffect(() => {
    // Check authentication status
    const clientAuthenticated = localStorage.getItem("clientAuthenticated") === "true"
    const clientEmail = localStorage.getItem("clientEmail")
    const userJson = localStorage.getItem("user")

    setAuthStatus(`
      clientAuthenticated: ${clientAuthenticated ? "true" : "false"}
      clientEmail: ${clientEmail || "not set"}
      user object: ${userJson || "not set"}
    `)

    setUser(getUser())
  }, [])

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
          <CardDescription>Verify that client authentication is working correctly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Authentication Status:</h3>
            <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{authStatus}</pre>
          </div>

          <div>
            <h3 className="font-medium mb-2">Current User:</h3>
            {user ? (
              <div className="bg-green-50 p-4 rounded border border-green-200">
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Logged In:</strong> {user.isLoggedIn ? "Yes" : "No"}
                </p>
              </div>
            ) : (
              <div className="bg-red-50 p-4 rounded border border-red-200">No user is currently logged in.</div>
            )}
          </div>

          <Button onClick={handleLogout} variant="destructive">
            Test Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
