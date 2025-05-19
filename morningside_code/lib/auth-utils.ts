"use server"

import { cookies } from "next/headers"
import type { User } from "@/lib/auth"

// Import verifyJWT directly from auth.ts
import { verifyJWT } from "@/lib/auth"

export async function getUserFromRequest(): Promise<User | null> {
  const cookieStore = cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) return null

  const payload = await verifyJWT(token)
  if (!payload) return null

  return payload as User
}
