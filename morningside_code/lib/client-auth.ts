"use client"

// Simple client-side authentication utilities for demo purposes
// In a real application, you would use a proper authentication system

export type User = {
  name: string
  email: string
  isLoggedIn: boolean
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null

  try {
    // Check both authentication methods
    const clientAuthenticated = localStorage.getItem("clientAuthenticated") === "true"
    const clientEmail = localStorage.getItem("clientEmail")

    const userJson = localStorage.getItem("user")
    if (userJson) {
      const user = JSON.parse(userJson)
      return user.isLoggedIn ? user : null
    }

    // If we have clientAuthenticated but no user object, create one
    if (clientAuthenticated && clientEmail) {
      const userName = clientEmail.split("@")[0].replace(/[^a-zA-Z0-9]/g, "")
      const displayName = userName.charAt(0).toUpperCase() + userName.slice(1)

      return {
        name: displayName || "Client User",
        email: clientEmail,
        isLoggedIn: true,
      }
    }

    return null
  } catch (error) {
    console.error("Error getting user from localStorage:", error)
    return null
  }
}

export function logout() {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem("user")
    localStorage.removeItem("clientAuthenticated")
    localStorage.removeItem("clientEmail")
    window.location.href = "/login"
  } catch (error) {
    console.error("Error logging out:", error)
  }
}

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false

  try {
    // Check both authentication methods
    const clientAuthenticated = localStorage.getItem("clientAuthenticated") === "true"
    const user = getUser()

    return clientAuthenticated || !!user
  } catch (error) {
    console.error("Error checking login status:", error)
    return false
  }
}
