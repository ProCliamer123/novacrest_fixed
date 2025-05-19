"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { getSession, logout } from "@/app/actions/auth-actions"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "client"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  logout: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUserFromSession() {
      try {
        const { user } = await getSession()
        setUser(user)
      } catch (error) {
        console.error("Failed to load user session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserFromSession()
  }, [])

  const handleLogout = async () => {
    await logout()
    setUser(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, isLoading, logout: handleLogout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
