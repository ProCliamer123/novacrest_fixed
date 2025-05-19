"use client"

import { useState } from "react"
import { ArrowRight, Brain, Calendar, Lightbulb, RefreshCw, Send } from "lucide-react"
import { useRouter } from "next/navigation"
import PdfGenerator from "./pdf-generator"

export default function AIBusinessAdvisor() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("insights")
  const [businessType, setBusinessType] = useState("")
  const [businessSize, setBusinessSize] = useState("")
  const [businessDescription, setBusinessDescription] = useState("")
  const [aiExperience, setAiExperience] = useState("")
  const [budget, setBudget] = useState("")
  const [goals, setGoals] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAdvice, setGeneratedAdvice] = useState<any | null>(null)
  const [showConsultationOffer, setShowConsultationOffer] = useState(false)

  const insights = [
    {
      title: "AI Agents for SMEs: Market Overview",
      excerpt: "AI agents are transforming how small businesses operate, with 78% reporting increased efficiency.",
      source: "OpenAI Economic Impact Report",
      date: "May 10, 2025",
      category: "Market Analysis",
      icon: <Brain size={16} className="text-black/60" />,
    },
    {
      title: "Implementation Strategies for AI Agents",
      excerpt: "Successful SMEs start with narrow-scope AI agents before expanding to more complex workflows.",
      source: "AI Transformation Playbook",
      date: "May 8, 2025",
      category: "Strategy",
      icon: <Brain size={16} className="text-black/60" />,
    },
    {
      title: "Cost-Benefit Analysis of AI Agents",
      excerpt: "SMEs implementing AI agents see ROI within 4-6 months with 3.2x productivity gains.",
      source: "Economic Intelligence Unit",
      date: "May 5, 2025",
      category: "Financial Impact",
      icon: <Brain size={16} className="text-black/60" />,
    },
  ]

  const handleGenerateAdvice = () => {
    setIsGenerating(true)

    // Simulate AI generation delay
    setTimeout(() => {
      const advice = generateAIAdvice(businessType, businessSize, businessDescription, aiExperience, budget, goals)
      setGeneratedAdvice(advice)
      setIsGenerating(false)
      setShowConsultationOffer(true)
    }, 1500)
  }

  const generateAIAdvice = (
    type: string,
    size: string,
    description: string,
    experience: string,
    budget: string,
    goals: string,
  ) => {
    // This is a simplified mock of AI-generated advice
    // In a real implementation, this would call an actual AI API

    if (type === "retail") {
      return {
        title: "AI Implementation Plan for Retail Business",
        summary: `Based on your ${size} retail business${
          description ? ` focused on ${description}` : ""
        }, we've created a tailored AI implementation plan to help you achieve your goals.`,
        startingPoints: [
          "Customer Service Chatbots - Implement on your website to handle common questions and reduce support load",
          "Inventory Management AI - Predict stock needs based on seasonal trends and sales patterns",
          "Personalized Marketing - Use customer data to create targeted promotions",
        ],
        timeline: [
          "Month 1-2: Deploy customer service chatbot",
          "Month 3-4: Integrate inventory management system",
          "Month 5-6: Launch personalized marketing campaigns",
        ],
        roi: [
          "15-20% reduction in customer service costs",
          "30% improvement in inventory efficiency",
          "25% increase in marketing conversion rates",
        ],
        budgetAllocation: `Based on your ${
          budget || "specified"
        } budget, allocate 40% to technology, 30% to training, and 30% to optimization.`,
        costBreakdown: [
          {
            category: "Technology",
            percentage: 40,
            description: "Software licenses, API access, and cloud infrastructure",
          },
          { category: "Training", percentage: 30, description: "Staff training and change management" },
          { category: "Optimization", percentage: 30, description: "Ongoing improvements and customization" },
        ],
        implementationRisks: [
          { risk: "Data Privacy Concerns", mitigation: "Implement robust data governance and compliance measures" },
          {
            risk: "User Adoption",
            mitigation: "Provide comprehensive training and gather feedback throughout implementation",
          },
          {
            risk: "Integration with Existing Systems",
            mitigation: "Start with standalone solutions before full integration",
          },
        ],
      }
    } else if (type === "manufacturing") {
      return {
        title: "AI Implementation Plan for Manufacturing Business",
        summary: `For your ${size} manufacturing business${
          description ? ` specializing in ${description}` : ""
        }, we've developed a strategic AI implementation plan to optimize operations and increase productivity.`,
        startingPoints: [
          "Predictive Maintenance - Reduce downtime by predicting equipment failures before they occur",
          "Quality Control AI - Implement computer vision systems to detect defects",
          "Supply Chain Optimization - Use AI to improve logistics and reduce costs",
        ],
        timeline: [
          "Month 1-3: Deploy predictive maintenance on critical equipment",
          "Month 3-5: Implement quality control systems",
          "Month 6-8: Integrate supply chain optimization",
        ],
        roi: [
          "45% reduction in unplanned downtime",
          "35% improvement in defect detection",
          "20% reduction in supply chain costs",
        ],
        budgetAllocation: `Based on your ${
          budget || "specified"
        } budget, allocate 50% to technology, 25% to training, and 25% to integration with existing systems.`,
        costBreakdown: [
          { category: "Technology", percentage: 50, description: "AI software, sensors, and computing infrastructure" },
          {
            category: "Training",
            percentage: 25,
            description: "Technical training for operators and maintenance staff",
          },
          { category: "Integration", percentage: 25, description: "System integration and customization" },
        ],
        implementationRisks: [
          {
            risk: "Legacy System Compatibility",
            mitigation: "Conduct thorough systems audit and plan for middleware if needed",
          },
          { risk: "Production Disruption", mitigation: "Implement changes during planned downtime or in phases" },
          { risk: "Data Quality Issues", mitigation: "Clean and validate data before implementation" },
        ],
      }
    } else {
      return {
        title: `AI Implementation Plan for ${type || "Your"} Business`,
        summary: `We've analyzed your ${size || ""} business${
          description ? ` in ${description}` : ""
        } and created a customized AI implementation strategy to help you achieve your objectives.`,
        startingPoints: [
          "Process Automation - Identify repetitive tasks that can be automated",
          "Data Analysis - Implement AI tools to extract insights from your business data",
          "Customer Experience Enhancement - Use AI to personalize customer interactions",
        ],
        timeline: [
          "Month 1-2: Conduct AI readiness assessment",
          "Month 2-4: Deploy initial automation solutions",
          "Month 4-6: Implement data analysis tools",
        ],
        roi: [
          "20-30% reduction in operational costs",
          "25% improvement in decision-making speed",
          "15% increase in customer satisfaction",
        ],
        budgetAllocation: `Based on your ${
          budget || "specified"
        } budget, we recommend a phased approach starting with the highest-impact areas first.`,
        costBreakdown: [
          {
            category: "Technology",
            percentage: 45,
            description: "AI platforms, software licenses, and infrastructure",
          },
          { category: "Implementation", percentage: 35, description: "Configuration, customization, and deployment" },
          { category: "Training", percentage: 20, description: "Staff training and change management" },
        ],
        implementationRisks: [
          { risk: "Unclear Business Requirements", mitigation: "Conduct thorough needs assessment with stakeholders" },
          { risk: "Scope Creep", mitigation: "Define clear project boundaries and success metrics" },
          { risk: "Resource Constraints", mitigation: "Prioritize high-impact, low-complexity initiatives first" },
        ],
      }
    }
  }

  const resetForm = () => {
    setBusinessType("")
    setBusinessSize("")
    setBusinessDescription("")
    setAiExperience("")
    setBudget("")
    setGoals("")
    setGeneratedAdvice(null)
    setShowConsultationOffer(false)
  }

  const handleBookConsultation = () => {
    router.push("/booking")
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-black/20 rounded-lg overflow-hidden h-full">
      <div className="border-b border-black/10 flex">
        <button
          className={`px-4 py-3 text-sm flex-1 ${activeTab === "insights" ? "bg-black text-[#f5f2e8]" : ""}`}
          onClick={() => setActiveTab("insights")}
        >
          Insights
        </button>
        <button
          className={`px-4 py-3 text-sm flex-1 ${activeTab === "advisor" ? "bg-black text-[#f5f2e8]" : ""}`}
          onClick={() => setActiveTab("advisor")}
        >
          AI Advisor
        </button>
      </div>

      <div className="p-4">
        {activeTab === "insights" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">AI Agents Daily Briefing</h3>
              <button className="p-1 rounded-full hover:bg-black/10">
                <RefreshCw size={16} />
              </button>
            </div>

            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
              {insights.map((insight, i) => (
                <div key={i} className="border border-black/10 rounded-md p-4 hover:bg-black/5 transition-colors">
                  <div className="flex items-center gap-2 text-xs text-black/60 mb-2">
                    {insight.icon}
                    <span>{insight.category}</span>
                    <span className="ml-auto">{insight.date}</span>
                  </div>
                  <h4 className="font-medium mb-1">{insight.title}</h4>
                  <p className="text-sm text-black/70 mb-3">{insight.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-black/60">Source: {insight.source}</span>
                    <button className="text-xs flex items-center gap-1 text-black hover:text-black/70">
                      Read more <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={20} className="text-black" />
              <h3 className="text-lg font-medium">AI Implementation Advisor</h3>
            </div>

            {!generatedAdvice ? (
              <div className="space-y-4">
                <p className="text-sm text-black/70">
                  Tell us about your business to get personalized AI implementation advice.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-black/70 mb-1">Business Type/Industry</label>
                    <select
                      className="w-full bg-white/5 border border-black/20 rounded-md p-2 text-black"
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                    >
                      <option value="">Select industry</option>
                      <option value="retail">Retail</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="finance">Finance</option>
                      <option value="education">Education</option>
                      <option value="technology">Technology</option>
                      <option value="hospitality">Hospitality</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-black/70 mb-1">Business Size</label>
                    <select
                      className="w-full bg-white/5 border border-black/20 rounded-md p-2 text-black"
                      value={businessSize}
                      onChange={(e) => setBusinessSize(e.target.value)}
                    >
                      <option value="">Select size</option>
                      <option value="solo">Solo Entrepreneur</option>
                      <option value="small">Small (2-10 employees)</option>
                      <option value="medium">Medium (11-50 employees)</option>
                      <option value="large">Large (51-200 employees)</option>
                      <option value="enterprise">Enterprise (201+ employees)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-black/70 mb-1">Business Description</label>
                    <textarea
                      className="w-full bg-white/5 border border-black/20 rounded-md p-2 text-black h-20"
                      placeholder="Briefly describe your business, products/services, and target market"
                      value={businessDescription}
                      onChange={(e) => setBusinessDescription(e.target.value)}
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm text-black/70 mb-1">AI Experience Level</label>
                    <select
                      className="w-full bg-white/5 border border-black/20 rounded-md p-2 text-black"
                      value={aiExperience}
                      onChange={(e) => setAiExperience(e.target.value)}
                    >
                      <option value="">Select experience</option>
                      <option value="none">No experience</option>
                      <option value="beginner">Beginner (used AI tools)</option>
                      <option value="intermediate">Intermediate (implemented basic AI)</option>
                      <option value="advanced">Advanced (multiple AI implementations)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-black/70 mb-1">Implementation Budget</label>
                    <select
                      className="w-full bg-white/5 border border-black/20 rounded-md p-2 text-black"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    >
                      <option value="">Select budget</option>
                      <option value="minimal">Minimal (under $5,000)</option>
                      <option value="small">Small ($5,000 - $25,000)</option>
                      <option value="medium">Medium ($25,000 - $100,000)</option>
                      <option value="large">Large ($100,000+)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-black/70 mb-1">Primary Goals (Optional)</label>
                    <textarea
                      className="w-full bg-white/5 border border-black/20 rounded-md p-2 text-black h-20"
                      placeholder="What are you hoping to achieve with AI?"
                      value={goals}
                      onChange={(e) => setGoals(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <button
                  className="w-full flex items-center justify-center gap-2 bg-black text-[#f5f2e8] py-2 rounded-md hover:bg-black/90 transition-colors"
                  onClick={handleGenerateAdvice}
                  disabled={!businessType || !businessSize}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Generating Advice...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Get AI Implementation Advice
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 border border-black/20 rounded-md bg-black/5 max-h-[350px] overflow-y-auto">
                  <div className="prose prose-sm">
                    <h2 className="text-xl font-bold mb-3">{generatedAdvice.title}</h2>
                    <p className="mb-4">{generatedAdvice.summary}</p>

                    <h3 className="text-lg font-semibold mt-4 mb-2">Recommended Starting Points</h3>
                    <ul className="list-disc pl-5 space-y-1 mb-4">
                      {generatedAdvice.startingPoints.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>

                    <h3 className="text-lg font-semibold mt-4 mb-2">Implementation Timeline</h3>
                    <ul className="list-disc pl-5 space-y-1 mb-4">
                      {generatedAdvice.timeline.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>

                    <h3 className="text-lg font-semibold mt-4 mb-2">Expected ROI</h3>
                    <ul className="list-disc pl-5 space-y-1 mb-4">
                      {generatedAdvice.roi.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>

                    <h3 className="text-lg font-semibold mt-4 mb-2">Budget Allocation</h3>
                    <p>{generatedAdvice.budgetAllocation}</p>
                  </div>
                </div>

                {showConsultationOffer && (
                  <div className="p-4 border border-black/20 rounded-md bg-[#f5f2e8] mt-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="text-black mt-1 flex-shrink-0" size={20} />
                      <div>
                        <h3 className="font-medium mb-1">Ready for a deeper analysis?</h3>
                        <p className="text-sm text-black/70 mb-3">
                          Book a free 30-minute consultation with our AI implementation experts to discuss your specific
                          needs and get a customized roadmap.
                        </p>
                        <button
                          onClick={handleBookConsultation}
                          className="px-4 py-2 bg-black text-[#f5f2e8] rounded-md hover:bg-black/90 transition-colors text-sm"
                        >
                          Book Consultation Call
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <PdfGenerator
                        advice={generatedAdvice}
                        businessType={businessType}
                        businessSize={businessSize}
                        businessDescription={businessDescription}
                        aiExperience={aiExperience}
                        budget={budget}
                        goals={goals}
                      />
                      <button
                        className="px-4 py-2 border border-black/20 rounded-md hover:bg-black/5 transition-colors"
                        onClick={resetForm}
                      >
                        Start Over
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
