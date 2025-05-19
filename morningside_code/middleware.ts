import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyJWT } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define protected routes
  const isAdminRoute = path.startsWith("/admin") && !path.startsWith("/admin/login")
  const isPortalRoute = path.startsWith("/portal")

  // Get token from cookies
  const token = request.cookies.get("auth-token")?.value

  // If no token and trying to access protected route, redirect to login
  if (!token && (isAdminRoute || isPortalRoute)) {
    const loginUrl = isAdminRoute ? new URL("/admin/login", request.url) : new URL("/client-portal", request.url)

    return NextResponse.redirect(loginUrl)
  }

  // If token exists, verify it
  if (token) {
    const payload = await verifyJWT(token)

    // If invalid token, redirect to login
    if (!payload && (isAdminRoute || isPortalRoute)) {
      const loginUrl = isAdminRoute ? new URL("/admin/login", request.url) : new URL("/client-portal", request.url)

      return NextResponse.redirect(loginUrl)
    }

    // Check role for admin routes
    if (isAdminRoute && payload && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

    // Check role for portal routes
    if (isPortalRoute && payload && payload.role !== "client" && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Apply middleware to admin and portal routes
    "/admin/:path*",
    "/portal/:path*",
  ],
}
