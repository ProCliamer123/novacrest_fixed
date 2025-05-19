"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { submitClientFeedback } from "@/app/actions/client-portal-actions"

export default function FeedbackPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [category, setCategory] = useState("general")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("feedback", feedback)
      formData.append("category", category)

      const result = await submitClientFeedback(formData)

      if (result.success) {
        setSubmitted(true)
        setFeedback("")
        setCategory("general")
        // Refresh the page data
        router.refresh()
      } else {
        setError("Failed to submit feedback. Please try again.")
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Feedback</h2>
      </div>

      <div className="grid gap-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            {submitted ? (
              <div className="text-center py-8">
                <h3 className="text-2xl font-semibold text-primary mb-2">Thank You!</h3>
                <p className="mb-6">Your feedback has been submitted successfully.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
                >
                  Submit Another Feedback
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="general">General Feedback</option>
                    <option value="project">Project Specific</option>
                    <option value="support">Support Request</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Report an Issue</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="feedback" className="block text-sm font-medium mb-1">
                    Your Feedback
                  </label>
                  <textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={6}
                    className="w-full p-2 border rounded-md"
                    placeholder="Please share your thoughts, suggestions, or concerns..."
                    required
                  />
                </div>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
