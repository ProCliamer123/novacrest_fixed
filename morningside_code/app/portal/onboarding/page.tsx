"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getUser } from "@/lib/client-auth"

export default function OnboardingPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in
    const user = getUser()
    if (!user && isClient) {
      window.location.href = "/client-portal"
    }
  }, [isClient])

  // Don't render anything on the server to prevent hydration issues
  if (!isClient) {
    return null
  }

  // Get user data
  const user = getUser()
  if (!user) {
    return null
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Onboarding</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome to Novacrest AI</CardTitle>
          <CardDescription>Complete these steps to get started with your AI automation project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Onboarding Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Onboarding Progress</span>
                <span>3/7 Steps Completed</span>
              </div>
              <Progress value={42} className="h-2" />
            </div>

            {/* Onboarding Steps */}
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-green-800">Account Setup</h3>
                      <span className="text-xs text-green-700">Completed</span>
                    </div>
                    <p className="mt-1 text-sm text-green-700">Your account has been created and verified.</p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-green-800">Project Information</h3>
                      <span className="text-xs text-green-700">Completed</span>
                    </div>
                    <p className="mt-1 text-sm text-green-700">
                      Project details and requirements have been documented.
                    </p>
                    <div className="mt-2">
                      <a href="/portal/resources" className="text-xs text-green-800 underline">
                        View Project Documentation
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-green-800">Initial Consultation</h3>
                      <span className="text-xs text-green-700">Completed</span>
                    </div>
                    <p className="mt-1 text-sm text-green-700">
                      Kickoff meeting with your project team has been completed.
                    </p>
                    <div className="mt-2">
                      <a href="/portal/resources" className="text-xs text-green-800 underline">
                        View Meeting Notes
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 - Current */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">
                    <span className="text-xs">4</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-blue-800">Data Requirements</h3>
                      <span className="text-xs text-blue-700">In Progress</span>
                    </div>
                    <p className="mt-1 text-sm text-blue-700">
                      Provide the necessary data for your AI automation project.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        Upload Data
                      </button>
                      <a
                        href="/portal/resources"
                        className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-3 py-1 text-xs text-blue-800 hover:bg-blue-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        View Requirements
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="rounded-lg border p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border text-muted-foreground">
                    <span className="text-xs">5</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Process Review</h3>
                      <span className="text-xs text-muted-foreground">Pending</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Review and approve the process maps and automation plan.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 6 */}
              <div className="rounded-lg border p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border text-muted-foreground">
                    <span className="text-xs">6</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Training Session</h3>
                      <span className="text-xs text-muted-foreground">Pending</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Participate in a training session on using the AI automation solution.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 7 */}
              <div className="rounded-lg border p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border text-muted-foreground">
                    <span className="text-xs">7</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Go-Live Preparation</h3>
                      <span className="text-xs text-muted-foreground">Pending</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Final preparations before launching your AI automation solution.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Onboarding Resources</CardTitle>
            <CardDescription>Essential resources to help you get started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-md bg-primary/10 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Getting Started Guide</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    A comprehensive guide to your AI automation journey
                  </p>
                  <a href="/portal/resources" className="text-xs text-primary hover:underline mt-1 inline-block">
                    View Guide
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-md bg-primary/10 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Portal Walkthrough Video</h4>
                  <p className="text-xs text-muted-foreground mt-1">Learn how to use the client portal effectively</p>
                  <a href="/portal/resources" className="text-xs text-primary hover:underline mt-1 inline-block">
                    Watch Video (10:25)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-md bg-primary/10 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Frequently Asked Questions</h4>
                  <p className="text-xs text-muted-foreground mt-1">Answers to common questions about onboarding</p>
                  <a href="/portal/support" className="text-xs text-primary hover:underline mt-1 inline-block">
                    View FAQs
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Onboarding Team</CardTitle>
            <CardDescription>Meet the team helping you get started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-muted">
                  <img src="/abstract-am.png" alt="Alex Morgan" className="h-full w-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Alex Morgan</h4>
                  <p className="text-xs text-muted-foreground">Project Manager</p>
                  <a href="mailto:alex@novacrest.ai" className="text-xs text-primary hover:underline">
                    alex@novacrest.ai
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-muted">
                  <img src="/stylized-initials-sc.png" alt="Sarah Chen" className="h-full w-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Sarah Chen</h4>
                  <p className="text-xs text-muted-foreground">Onboarding Specialist</p>
                  <a href="mailto:sarah@novacrest.ai" className="text-xs text-primary hover:underline">
                    sarah@novacrest.ai
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-muted">
                  <img
                    src="/medical-resonance-image.png"
                    alt="Michael Rodriguez"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Michael Rodriguez</h4>
                  <p className="text-xs text-muted-foreground">Technical Consultant</p>
                  <a href="mailto:michael@novacrest.ai" className="text-xs text-primary hover:underline">
                    michael@novacrest.ai
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button className="w-full rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
                Schedule Onboarding Call
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
