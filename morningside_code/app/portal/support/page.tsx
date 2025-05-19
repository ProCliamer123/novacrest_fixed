"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUser } from "@/lib/client-auth"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Search, Mail, Phone, MessageSquare, ChevronDown, ChevronRight } from "lucide-react"

export default function SupportPage() {
  const [isClient, setIsClient] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

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

  const faqs = [
    {
      id: 1,
      question: "How long does the AI automation project typically take?",
      answer:
        "The timeline for AI automation projects varies based on complexity, but typically ranges from 3-6 months. Your specific project is scheduled for approximately 6 months, with key milestones outlined in your Project Status page.",
    },
    {
      id: 2,
      question: "What data do you need from us for the AI model training?",
      answer:
        "We require historical data relevant to the processes being automated. This typically includes transaction records, decision outcomes, process logs, and any other data that represents the patterns the AI needs to learn. Your data requirements are detailed in the Data Collection phase documentation available in the Resources section.",
    },
    {
      id: 3,
      question: "How secure is our data during the project?",
      answer:
        "We implement enterprise-grade security measures including encryption at rest and in transit, secure access controls, and regular security audits. All data handling complies with relevant regulations like GDPR and CCPA. A detailed security overview is available in the Resources section.",
    },
    {
      id: 4,
      question: "What happens after the AI automation is deployed?",
      answer:
        "After deployment, we provide a monitoring period to ensure everything is working as expected. We also offer ongoing support and maintenance options, as well as training for your team. The post-deployment phase includes performance tracking and continuous improvement opportunities.",
    },
    {
      id: 5,
      question: "Can we make changes to the project scope?",
      answer:
        "Yes, we understand that requirements may evolve. We have a change management process to handle scope modifications. Small changes can often be accommodated within the existing timeline, while larger changes may require schedule adjustments. Please contact your Project Manager to discuss any scope changes.",
    },
    {
      id: 6,
      question: "How do we measure the success of the AI automation?",
      answer:
        "Success metrics are established during the Discovery phase and typically include efficiency gains, error reduction, cost savings, and ROI. We track these metrics throughout the project and provide regular reports on progress. Your specific success metrics are available in the Project Status section.",
    },
    {
      id: 7,
      question: "What kind of support is available during and after the project?",
      answer:
        "During the project, you have access to your dedicated Project Manager and technical team through this portal, email, and scheduled meetings. After deployment, we offer various support packages ranging from basic troubleshooting to comprehensive managed services. Your current support plan includes 3 months of post-deployment support.",
    },
    {
      id: 8,
      question: "How much of our team's involvement is required?",
      answer:
        "Your team's involvement is crucial during certain phases, particularly Discovery, Data Collection, and User Acceptance Testing. We typically require subject matter experts to be available for meetings and feedback sessions. The specific time commitment varies by phase and is outlined in your project plan.",
    },
  ]

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleFaq = (id: number) => {
    if (expandedFaq === id) {
      setExpandedFaq(null)
    } else {
      setExpandedFaq(id)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Support</h2>
      </div>

      <Tabs defaultValue="contact" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Email Support
                </CardTitle>
                <CardDescription>Get help via email</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Send us an email and we'll respond within 24 hours during business days.</p>
                <a
                  href="mailto:support@novacrest.ai"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  support@novacrest.ai
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Phone Support
                </CardTitle>
                <CardDescription>Speak with a support agent</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Call us directly for urgent matters or complex issues.</p>
                <a
                  href="tel:+18005551234"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  +1 (800) 555-1234
                </a>
                <p className="mt-2 text-xs text-muted-foreground">Available Monday-Friday, 9am-5pm EST</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Live Chat
                </CardTitle>
                <CardDescription>Chat with our AI assistant</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Get immediate answers to common questions through our AI chat assistant.</p>
                <button className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Start Chat
                </button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Contact Your Project Team</CardTitle>
              <CardDescription>Reach out directly to your project team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium">Alex Morgan</h4>
                  <p className="text-sm text-muted-foreground">Project Manager</p>
                  <div className="mt-2 flex gap-4">
                    <a href="mailto:alex@novacrest.ai" className="text-sm text-primary hover:underline">
                      alex@novacrest.ai
                    </a>
                    <a href="tel:+18005551235" className="text-sm text-primary hover:underline">
                      +1 (800) 555-1235
                    </a>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-medium">Sarah Chen</h4>
                  <p className="text-sm text-muted-foreground">Data Scientist</p>
                  <div className="mt-2 flex gap-4">
                    <a href="mailto:sarah@novacrest.ai" className="text-sm text-primary hover:underline">
                      sarah@novacrest.ai
                    </a>
                    <a href="tel:+18005551236" className="text-sm text-primary hover:underline">
                      +1 (800) 555-1236
                    </a>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-medium">Michael Rodriguez</h4>
                  <p className="text-sm text-muted-foreground">AI Engineer</p>
                  <div className="mt-2 flex gap-4">
                    <a href="mailto:michael@novacrest.ai" className="text-sm text-primary hover:underline">
                      michael@novacrest.ai
                    </a>
                    <a href="tel:+18005551237" className="text-sm text-primary hover:underline">
                      +1 (800) 555-1237
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submit a Support Request</CardTitle>
              <CardDescription>Need help with something specific? Submit a detailed request.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input id="subject" placeholder="Brief description of your issue" />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Category
                  </label>
                  <select id="category" className="rounded-md border p-2">
                    <option value="">Select a category</option>
                    <option value="technical">Technical Issue</option>
                    <option value="account">Account Management</option>
                    <option value="billing">Billing</option>
                    <option value="feature">Feature Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="priority" className="text-sm font-medium">
                    Priority
                  </label>
                  <select id="priority" className="rounded-md border p-2">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Please provide details about your issue or question..."
                    className="min-h-[150px]"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="attachment" className="text-sm font-medium">
                    Attachment (optional)
                  </label>
                  <Input id="attachment" type="file" />
                  <p className="text-xs text-muted-foreground">
                    Max file size: 10MB. Supported formats: PDF, JPG, PNG, DOC, DOCX
                  </p>
                </div>

                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                >
                  Submit Request
                </button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions about your AI automation project</CardDescription>
              <div className="mt-4 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search FAQs..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredFaqs.length > 0 ? (
                <div className="space-y-2">
                  {filteredFaqs.map((faq) => (
                    <div key={faq.id} className="rounded-lg border">
                      <button
                        className="flex w-full items-center justify-between p-4 text-left"
                        onClick={() => toggleFaq(faq.id)}
                      >
                        <h3 className="font-medium">{faq.question}</h3>
                        {expandedFaq === faq.id ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      {expandedFaq === faq.id && (
                        <div className="border-t p-4">
                          <p className="text-sm text-muted-foreground">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-muted p-3">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">No results found</h3>
                  <p className="text-sm text-muted-foreground mt-2">We couldn't find any FAQs matching your search.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Can't find what you're looking for?</CardTitle>
              <CardDescription>Contact our support team for personalized assistance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <a
                  href="mailto:support@novacrest.ai"
                  className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email Support</span>
                </a>
                <a
                  href="tel:+18005551234"
                  className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call Support</span>
                </a>
                <button className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
                  <MessageSquare className="h-4 w-4" />
                  <span>Live Chat</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base</CardTitle>
              <CardDescription>Detailed articles and guides about AI automation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Understanding AI Automation</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Learn the fundamentals of AI automation and how it can transform your business processes.
                  </p>
                  <a href="#" className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline">
                    Read article
                    <ChevronRight className="h-3 w-3" />
                  </a>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Data Requirements for AI Training</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    A comprehensive guide to preparing and providing data for AI model training.
                  </p>
                  <a href="#" className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline">
                    Read article
                    <ChevronRight className="h-3 w-3" />
                  </a>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">AI Integration Best Practices</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Learn how to successfully integrate AI solutions with your existing systems.
                  </p>
                  <a href="#" className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline">
                    Read article
                    <ChevronRight className="h-3 w-3" />
                  </a>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Measuring AI ROI</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    A guide to calculating and maximizing return on investment for AI automation projects.
                  </p>
                  <a href="#" className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline">
                    Read article
                    <ChevronRight className="h-3 w-3" />
                  </a>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">AI Security and Compliance</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Understanding security measures and regulatory compliance for AI projects.
                  </p>
                  <a href="#" className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline">
                    Read article
                    <ChevronRight className="h-3 w-3" />
                  </a>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Change Management for AI Adoption</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Strategies for managing organizational change during AI implementation.
                  </p>
                  <a href="#" className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline">
                    Read article
                    <ChevronRight className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-3">Video Tutorials</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg border overflow-hidden">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground opacity-50"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm">Client Portal Walkthrough</h4>
                      <p className="text-xs text-muted-foreground mt-1">10:25</p>
                    </div>
                  </div>

                  <div className="rounded-lg border overflow-hidden">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground opacity-50"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm">Understanding Project Metrics</h4>
                      <p className="text-xs text-muted-foreground mt-1">8:12</p>
                    </div>
                  </div>

                  <div className="rounded-lg border overflow-hidden">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground opacity-50"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm">AI Automation Demo</h4>
                      <p className="text-xs text-muted-foreground mt-1">15:40</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Glossary</CardTitle>
              <CardDescription>Key terms and definitions related to AI automation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">AI (Artificial Intelligence)</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The simulation of human intelligence processes by machines, especially computer systems. These
                    processes include learning, reasoning, and self-correction.
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Machine Learning</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    A subset of AI that provides systems the ability to automatically learn and improve from experience
                    without being explicitly programmed.
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">RPA (Robotic Process Automation)</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Technology that allows anyone to configure computer software, or a "robot," to emulate and integrate
                    the actions of a human interacting within digital systems to execute a business process.
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">NLP (Natural Language Processing)</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    A branch of AI that helps computers understand, interpret, and manipulate human language.
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">API (Application Programming Interface)</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    A set of rules and protocols for building and interacting with software applications, allowing
                    different systems to communicate with each other.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
