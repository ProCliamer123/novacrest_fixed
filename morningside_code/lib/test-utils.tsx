import type React from "react"
import type { ReactElement } from "react"
import { render, type RenderOptions } from "@testing-library/react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"

// Create a custom render function that includes providers
const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllProviders, ...options })

// Re-export everything from testing-library
export * from "@testing-library/react"

// Override render method
export { customRender as render }

// Mock data generators
export const mockClient = (overrides = {}) => ({
  id: "client-1",
  name: "Test Client",
  companyName: "Test Company",
  email: "client@example.com",
  phone: "123-456-7890",
  status: "active",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
})

export const mockProject = (overrides = {}) => ({
  id: "project-1",
  name: "Test Project",
  description: "This is a test project",
  status: "in_progress",
  clientId: "client-1",
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
})

export const mockUser = (overrides = {}) => ({
  id: "user-1",
  name: "Test User",
  email: "user@example.com",
  role: "admin",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
})

// Mock server responses
export const mockServerResponse = (data, error = null) => {
  if (error) {
    return Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ error }),
    })
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data),
  })
}

// Mock server actions
export const mockServerAction = (data, error = null) => {
  if (error) {
    return Promise.resolve({
      success: false,
      error,
    })
  }
  return Promise.resolve({
    success: true,
    data,
  })
}
