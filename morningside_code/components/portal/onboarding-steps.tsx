"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle, Info } from "lucide-react"

const steps = [
  {
    id: "account",
    title: "Account Setup",
    description: "Your account has been created and verified.",
    defaultCompleted: true,
  },
  {
    id: "project",
    title: "Project Information",
    description: "Review your project details and requirements.",
    defaultCompleted: false,
  },
  {
    id: "goals",
    title: "Set Project Goals",
    description: "Define your automation goals and success metrics.",
    defaultCompleted: false,
  },
  {
    id: "tutorial",
    title: "Portal Tutorial",
    description: "Learn how to use the client portal effectively.",
    defaultCompleted: false,
  },
  {
    id: "meeting",
    title: "Schedule Kickoff Meeting",
    description: "Book a meeting with your project manager.",
    defaultCompleted: false,
  },
]

export function OnboardingSteps() {
  const [completedSteps, setCompletedSteps] = useState<string[]>(
    steps.filter((step) => step.defaultCompleted).map((step) => step.id),
  )

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => (prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]))
  }

  const progress = Math.round((completedSteps.length / steps.length) * 100)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{progress}% complete</span>
        <span className="text-sm text-muted-foreground">
          {completedSteps.length}/{steps.length} steps
        </span>
      </div>

      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-6 space-y-6">
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id)

          return (
            <div key={step.id} className="flex items-start">
              <button onClick={() => toggleStep(step.id)} className="mr-3 mt-0.5 flex-shrink-0 text-primary">
                {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
              </button>
              <div className="space-y-1">
                <div className="text-sm font-medium leading-none">{step.title}</div>
                <div className="text-sm text-muted-foreground">{step.description}</div>
                {!isCompleted && step.id === "meeting" && (
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => toggleStep(step.id)}>
                    Schedule Meeting
                  </Button>
                )}
                {!isCompleted && step.id === "tutorial" && (
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => toggleStep(step.id)}>
                    Start Tutorial
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex items-center rounded-md bg-muted p-3">
        <Info className="h-4 w-4 mr-2 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">
          Complete all onboarding steps to ensure a smooth project start.
        </span>
      </div>
    </div>
  )
}
