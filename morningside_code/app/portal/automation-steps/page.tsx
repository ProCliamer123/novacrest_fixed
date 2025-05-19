"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUser } from "@/lib/client-auth"
import { Badge } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function AutomationStepsPage() {
  const [isClient, setIsClient] = useState(false)
  const [activeStep, setActiveStep] = useState(3)

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

  const automationSteps = [
    {
      id: 1,
      title: "Discovery & Requirements",
      description: "Identifying business processes for automation and gathering requirements",
      status: "Completed",
      progress: 100,
      tasks: [
        { name: "Initial consultation", status: "Completed" },
        { name: "Process identification workshop", status: "Completed" },
        { name: "Requirements documentation", status: "Completed" },
        { name: "Stakeholder approval", status: "Completed" },
      ],
      outcomes: [
        "Identified 5 key processes for automation",
        "Documented detailed requirements",
        "Established success metrics",
        "Defined project scope and timeline",
      ],
      date: "Jan 15 - Feb 10, 2023",
    },
    {
      id: 2,
      title: "Process Analysis & Mapping",
      description: "Analyzing current processes and creating detailed process maps",
      status: "Completed",
      progress: 100,
      tasks: [
        { name: "Current process documentation", status: "Completed" },
        { name: "Process efficiency analysis", status: "Completed" },
        { name: "Bottleneck identification", status: "Completed" },
        { name: "Process map creation", status: "Completed" },
      ],
      outcomes: [
        "Created detailed process maps for all 5 processes",
        "Identified 12 bottlenecks across processes",
        "Calculated current process efficiency metrics",
        "Documented manual steps to be automated",
      ],
      date: "Feb 11 - Mar 1, 2023",
    },
    {
      id: 3,
      title: "Data Collection & Preparation",
      description: "Gathering and preparing data needed for AI model training",
      status: "In Progress",
      progress: 85,
      tasks: [
        { name: "Data source identification", status: "Completed" },
        { name: "Data extraction", status: "Completed" },
        { name: "Data cleaning and preprocessing", status: "In Progress" },
        { name: "Data validation", status: "Not Started" },
      ],
      outcomes: [
        "Identified 8 data sources across systems",
        "Extracted 250,000+ records for training",
        "Cleaned 85% of the dataset",
        "Created data schema and documentation",
      ],
      date: "Mar 2 - Mar 20, 2023",
    },
    {
      id: 4,
      title: "AI Model Development",
      description: "Developing and training AI models for process automation",
      status: "In Progress",
      progress: 60,
      tasks: [
        { name: "Model architecture design", status: "Completed" },
        { name: "Initial model training", status: "Completed" },
        { name: "Model performance evaluation", status: "In Progress" },
        { name: "Model refinement", status: "Not Started" },
      ],
      outcomes: [
        "Designed custom model architecture",
        "Completed initial training with 75% accuracy",
        "Identified areas for model improvement",
        "Prepared for fine-tuning phase",
      ],
      date: "Mar 15 - Apr 15, 2023",
    },
    {
      id: 5,
      title: "Integration & Workflow Design",
      description: "Integrating AI models with existing systems and designing automated workflows",
      status: "In Progress",
      progress: 30,
      tasks: [
        { name: "API development", status: "In Progress" },
        { name: "System integration planning", status: "In Progress" },
        { name: "Workflow design", status: "Not Started" },
        { name: "Integration testing", status: "Not Started" },
      ],
      outcomes: [
        "Developed initial API endpoints",
        "Created integration architecture",
        "Designed preliminary workflows",
        "Established testing protocols",
      ],
      date: "Apr 1 - May 10, 2023",
    },
    {
      id: 6,
      title: "Testing & Optimization",
      description: "Testing the automated processes and optimizing for performance",
      status: "Upcoming",
      progress: 0,
      tasks: [
        { name: "Unit testing", status: "Not Started" },
        { name: "Integration testing", status: "Not Started" },
        { name: "Performance optimization", status: "Not Started" },
        { name: "User acceptance testing", status: "Not Started" },
      ],
      outcomes: [
        "Comprehensive test plan",
        "Performance benchmarks",
        "Optimization strategies",
        "User feedback collection",
      ],
      date: "May 11 - Jun 15, 2023",
    },
    {
      id: 7,
      title: "Deployment & Training",
      description: "Deploying the automated solution and training users",
      status: "Not Started",
      progress: 0,
      tasks: [
        { name: "Deployment planning", status: "Not Started" },
        { name: "Production deployment", status: "Not Started" },
        { name: "User training", status: "Not Started" },
        { name: "Documentation", status: "Not Started" },
      ],
      outcomes: ["Deployment strategy", "Training materials", "User guides", "Support documentation"],
      date: "Jun 16 - Jul 15, 2023",
    },
    {
      id: 8,
      title: "Monitoring & Continuous Improvement",
      description: "Monitoring the automated processes and implementing continuous improvements",
      status: "Not Started",
      progress: 0,
      tasks: [
        { name: "Monitoring setup", status: "Not Started" },
        { name: "Performance tracking", status: "Not Started" },
        { name: "Feedback collection", status: "Not Started" },
        { name: "Improvement implementation", status: "Not Started" },
      ],
      outcomes: ["Monitoring dashboard", "Performance reports", "Improvement roadmap", "ROI analysis"],
      date: "Jul 16 - Ongoing",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Automation Steps</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
            Phase 3 of 8
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="steps" className="space-y-4">
        <TabsList>
          <TabsTrigger value="steps">Steps Overview</TabsTrigger>
          <TabsTrigger value="current">Current Phase</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="steps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Process</CardTitle>
              <CardDescription>Complete overview of your AI automation journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {automationSteps.map((step) => (
                  <div
                    key={step.id}
                    className={`rounded-lg border p-4 transition-all ${
                      step.id === activeStep ? "border-primary ring-2 ring-primary ring-opacity-20" : ""
                    }`}
                    onClick={() => setActiveStep(step.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                            step.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : step.status === "In Progress"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {step.id}
                        </div>
                        <h3 className="font-semibold">{step.title}</h3>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          step.status === "Completed"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : step.status === "In Progress"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : step.status === "Upcoming"
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                        }
                      >
                        {step.status}
                      </Badge>
                    </div>

                    <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>

                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{step.progress}%</span>
                      </div>
                      <Progress value={step.progress} className="h-2" />
                    </div>

                    {step.id === activeStep && (
                      <div className="mt-6 space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Tasks</h4>
                          <div className="space-y-2">
                            {step.tasks.map((task) => (
                              <div key={task.name} className="flex items-center justify-between text-sm">
                                <span>{task.name}</span>
                                <Badge
                                  variant="outline"
                                  className={
                                    task.status === "Completed"
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : task.status === "In Progress"
                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                        : "bg-gray-50 text-gray-700 border-gray-200"
                                  }
                                >
                                  {task.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">Key Outcomes</h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {step.outcomes.map((outcome) => (
                              <li key={outcome}>{outcome}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-2">
                          <span className="text-sm text-muted-foreground">{step.date}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="current" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Phase: Data Collection & Preparation</CardTitle>
              <CardDescription>Gathering and preparing data needed for AI model training</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Phase Overview</h3>
                  <p className="text-muted-foreground">
                    In this critical phase, we're collecting and preparing the data that will be used to train your AI
                    models. High-quality, well-prepared data is essential for creating effective AI automation
                    solutions.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium mb-3">Current Activities</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm">
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
                          className="text-green-500"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Data source identification complete</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
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
                          className="text-green-500"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Data extraction complete</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
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
                          className="text-blue-500"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>Data cleaning and preprocessing in progress (85%)</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
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
                          className="text-gray-400"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                        </svg>
                        <span className="text-muted-foreground">Data validation pending</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium mb-3">Key Metrics</h4>
                    <ul className="space-y-3">
                      <li className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span>Data Sources Identified</span>
                          <span className="font-medium">8/8</span>
                        </div>
                        <Progress value={100} className="h-1.5" />
                      </li>
                      <li className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span>Records Extracted</span>
                          <span className="font-medium">250,000+</span>
                        </div>
                        <Progress value={100} className="h-1.5" />
                      </li>
                      <li className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span>Data Cleaning</span>
                          <span className="font-medium">85%</span>
                        </div>
                        <Progress value={85} className="h-1.5" />
                      </li>
                      <li className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span>Data Validation</span>
                          <span className="font-medium">0%</span>
                        </div>
                        <Progress value={0} className="h-1.5" />
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-3">Recent Updates</h4>
                  <div className="space-y-4">
                    <div className="border-l-2 border-blue-500 pl-4 py-1">
                      <p className="text-sm font-medium">Data schema finalized</p>
                      <p className="text-xs text-muted-foreground">March 10, 2023 at 2:30 PM</p>
                      <p className="text-sm mt-1">
                        The data schema has been finalized and documented. This will serve as the foundation for our AI
                        model training.
                      </p>
                    </div>
                    <div className="border-l-2 border-blue-500 pl-4 py-1">
                      <p className="text-sm font-medium">Data cleaning 85% complete</p>
                      <p className="text-xs text-muted-foreground">March 8, 2023 at 10:15 AM</p>
                      <p className="text-sm mt-1">
                        The team has made significant progress on data cleaning, with 85% of the dataset now processed
                        and ready for validation.
                      </p>
                    </div>
                    <div className="border-l-2 border-blue-500 pl-4 py-1">
                      <p className="text-sm font-medium">Additional data source identified</p>
                      <p className="text-xs text-muted-foreground">March 5, 2023 at 3:45 PM</p>
                      <p className="text-sm mt-1">
                        We've identified an additional data source that will enhance the training dataset with valuable
                        historical information.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-3">Next Steps</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Complete data cleaning and preprocessing (Expected: March 15)</li>
                    <li>Perform data validation and quality checks (Expected: March 18)</li>
                    <li>Finalize training, validation, and test datasets (Expected: March 20)</li>
                    <li>Begin advanced model training with prepared data (Expected: March 21)</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Timeline</CardTitle>
              <CardDescription>Visual representation of your automation journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-9 top-0 bottom-0 w-px bg-muted"></div>

                {automationSteps.map((step, index) => (
                  <div key={step.id} className="mb-8 flex gap-4">
                    <div
                      className={`relative mt-1 flex h-8 w-8 items-center justify-center rounded-full border ${
                        step.status === "Completed"
                          ? "bg-green-100 border-green-500 text-green-600"
                          : step.status === "In Progress"
                            ? "bg-blue-100 border-blue-500 text-blue-600"
                            : "bg-gray-100 border-gray-300 text-gray-500"
                      }`}
                    >
                      {step.status === "Completed" ? (
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
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{step.title}</h4>
                        <Badge
                          variant="outline"
                          className={
                            step.status === "Completed"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : step.status === "In Progress"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : step.status === "Upcoming"
                                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                  : "bg-gray-50 text-gray-700 border-gray-200"
                          }
                        >
                          {step.status}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mt-1">{step.description}</p>

                      <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                        <div>{step.date}</div>
                        {step.progress > 0 && (
                          <div className="flex items-center gap-1">
                            <span>{step.progress}%</span>
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  step.status === "Completed" ? "bg-green-500" : "bg-blue-500"
                                }`}
                                style={{ width: `${step.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Milestones</CardTitle>
              <CardDescription>Key milestones in your automation project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4 bg-green-50 border-green-200">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-green-800">Requirements Approval</h4>
                    <Badge className="bg-green-100 text-green-800 border-green-300">Completed</Badge>
                  </div>
                  <p className="text-sm text-green-700 mt-1">February 10, 2023</p>
                  <p className="text-sm mt-2">Project requirements and scope approved by all stakeholders.</p>
                </div>

                <div className="rounded-lg border p-4 bg-green-50 border-green-200">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-green-800">Process Maps Finalized</h4>
                    <Badge className="bg-green-100 text-green-800 border-green-300">Completed</Badge>
                  </div>
                  <p className="text-sm text-green-700 mt-1">March 1, 2023</p>
                  <p className="text-sm mt-2">Detailed process maps created and approved for all target processes.</p>
                </div>

                <div className="rounded-lg border p-4 bg-blue-50 border-blue-200">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-blue-800">Data Preparation Complete</h4>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-300">In Progress</Badge>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">March 20, 2023 (Expected)</p>
                  <p className="text-sm mt-2">All data cleaned, validated, and prepared for AI model training.</p>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Initial Model Training Complete</h4>
                    <Badge variant="outline">Upcoming</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">April 15, 2023 (Expected)</p>
                  <p className="text-sm mt-2">First version of AI models trained and evaluated.</p>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Integration Complete</h4>
                    <Badge variant="outline">Upcoming</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">May 10, 2023 (Expected)</p>
                  <p className="text-sm mt-2">AI models integrated with existing systems and workflows.</p>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">User Acceptance Testing</h4>
                    <Badge variant="outline">Upcoming</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">June 10, 2023 (Expected)</p>
                  <p className="text-sm mt-2">Final testing with end users before deployment.</p>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Go-Live</h4>
                    <Badge variant="outline">Upcoming</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">July 15, 2023 (Expected)</p>
                  <p className="text-sm mt-2">Full deployment of automated processes to production.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
