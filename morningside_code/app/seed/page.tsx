"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ensureDatabaseInitialized, createAdminUserIfNeeded } from "@/app/actions/auth-actions"

export default function SeedPage() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  async function handleInitialize() {
    setIsInitializing(true)
    setMessage("Initializing database...")
    setError("")
    setSuccess(false)

    try {
      // Initialize database
      const dbResult = await ensureDatabaseInitialized()

      if (!dbResult) {
        setError("Failed to initialize database")
        setIsInitializing(false)
        return
      }

      setMessage("Database initialized. Creating admin user...")

      // Create admin user
      const adminResult = await createAdminUserIfNeeded()

      if (!adminResult.success) {
        setError(adminResult.error || "Failed to create admin user")
        setIsInitializing(false)
        return
      }

      setMessage("Setup completed successfully!")
      setSuccess(true)
    } catch (err) {
      setError(`An error occurred: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Database Initialization</CardTitle>
          <CardDescription>
            This will set up the database tables and create an admin user if one doesn't exist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && <div className="mb-4 rounded bg-blue-50 p-3 text-blue-800">{message}</div>}
          {error && <div className="mb-4 rounded bg-red-50 p-3 text-red-800">{error}</div>}
          {success && (
            <div className="mb-4 rounded bg-green-50 p-3 text-green-800">
              <p>Setup completed successfully!</p>
              <p className="mt-2">
                <strong>Admin credentials:</strong>
                <br />
                Email: admin@example.com
                <br />
                Password: admin123
              </p>
              <p className="mt-2">
                <a href="/admin/login" className="text-blue-600 underline">
                  Go to admin login
                </a>
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleInitialize} disabled={isInitializing || success} className="w-full">
            {isInitializing ? "Initializing..." : "Initialize Database"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
