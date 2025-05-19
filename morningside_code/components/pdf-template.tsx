"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import PdfThemeSelector from "./pdf-theme-selector"
import { themes } from "@/utils/pdf-themes"

interface PdfTemplateProps {
  title: string
  summary: string
  businessType: string
  businessSize: string
}

export default function PdfTemplate({ title, summary, businessType, businessSize }: PdfTemplateProps) {
  const [activeTheme, setActiveTheme] = useState(themes[0])
  const [expandedSections, setExpandedSections] = useState({
    executive: true,
    implementation: true,
    timeline: true,
    budget: true,
    risks: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="pdf-document">
      {/* Theme selector */}
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <PdfThemeSelector themes={themes} activeTheme={activeTheme} onSelectTheme={setActiveTheme} />
      </div>

      {/* Document content */}
      <div
        className="p-8 max-w-4xl mx-auto"
        style={{
          fontFamily: activeTheme.fontFamily,
          color: activeTheme.textColor,
        }}
      >
        {/* Header */}
        <div className="text-center mb-12" style={{ color: activeTheme.primaryColor }}>
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <p className="text-lg" style={{ color: activeTheme.secondaryColor }}>
            Prepared for: {businessSize} {businessType} Business
          </p>
          <div className="mt-4 text-sm" style={{ color: activeTheme.secondaryColor }}>
            <p>Prepared by: NovaCrest AI Advisory Team</p>
            <p>Date: May 19, 2025</p>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="mb-12 p-4 rounded-lg" style={{ backgroundColor: activeTheme.bgAccent }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: activeTheme.primaryColor }}>
            Table of Contents
          </h2>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span
                className="mr-2 w-6 h-6 rounded-full flex items-center justify-center text-sm"
                style={{ backgroundColor: activeTheme.primaryColor, color: "#fff" }}
              >
                1
              </span>
              <span>Executive Summary</span>
            </li>
            <li className="flex items-center">
              <span
                className="mr-2 w-6 h-6 rounded-full flex items-center justify-center text-sm"
                style={{ backgroundColor: activeTheme.primaryColor, color: "#fff" }}
              >
                2
              </span>
              <span>Implementation Strategy</span>
            </li>
            <li className="flex items-center">
              <span
                className="mr-2 w-6 h-6 rounded-full flex items-center justify-center text-sm"
                style={{ backgroundColor: activeTheme.primaryColor, color: "#fff" }}
              >
                3
              </span>
              <span>Timeline and Milestones</span>
            </li>
            <li className="flex items-center">
              <span
                className="mr-2 w-6 h-6 rounded-full flex items-center justify-center text-sm"
                style={{ backgroundColor: activeTheme.primaryColor, color: "#fff" }}
              >
                4
              </span>
              <span>Budget Allocation</span>
            </li>
            <li className="flex items-center">
              <span
                className="mr-2 w-6 h-6 rounded-full flex items-center justify-center text-sm"
                style={{ backgroundColor: activeTheme.primaryColor, color: "#fff" }}
              >
                5
              </span>
              <span>Risk Assessment and Mitigation</span>
            </li>
          </ul>
        </div>

        {/* Executive Summary */}
        <div className="mb-10">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("executive")}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: activeTheme.primaryColor }}>
              1. Executive Summary
            </h2>
            {expandedSections.executive ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {expandedSections.executive && (
            <div className="space-y-4">
              <p>{summary}</p>
              <p>
                This report outlines a comprehensive AI implementation strategy tailored specifically for your
                {businessSize ? ` ${businessSize}` : ""} {businessType} business. Our recommendations are based on
                industry best practices, current AI capabilities, and your specific business needs.
              </p>
              <p>
                By following this implementation plan, you can expect to see significant improvements in operational
                efficiency, customer satisfaction, and overall business performance. The plan is designed to be
                implemented in phases, allowing for adjustments and optimizations along the way.
              </p>
            </div>
          )}
        </div>

        {/* Implementation Strategy */}
        <div className="mb-10">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection("implementation")}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: activeTheme.primaryColor }}>
              2. Implementation Strategy
            </h2>
            {expandedSections.implementation ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {expandedSections.implementation && (
            <div className="space-y-6">
              <p>
                Our recommended implementation strategy follows a phased approach, starting with the most impactful and
                least disruptive AI solutions before moving on to more complex implementations.
              </p>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold" style={{ color: activeTheme.secondaryColor }}>
                  Phase 1: Assessment and Planning
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Conduct a comprehensive assessment of your current systems and processes</li>
                  <li>Identify key areas where AI can provide the most immediate value</li>
                  <li>Develop a detailed implementation roadmap with clear milestones</li>
                  <li>Establish baseline metrics for measuring success</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold" style={{ color: activeTheme.secondaryColor }}>
                  Phase 2: Initial Implementation
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Deploy the first AI solution in a controlled environment</li>
                  <li>Train key staff members on how to use and manage the new system</li>
                  <li>Gather feedback and make necessary adjustments</li>
                  <li>Document lessons learned for future implementations</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold" style={{ color: activeTheme.secondaryColor }}>
                  Phase 3: Expansion and Integration
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Roll out the initial AI solution to the entire organization</li>
                  <li>Begin implementation of additional AI solutions</li>
                  <li>Integrate AI systems with existing business processes</li>
                  <li>Develop automated workflows between systems</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold" style={{ color: activeTheme.secondaryColor }}>
                  Phase 4: Optimization and Innovation
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Analyze performance data and optimize AI systems</li>
                  <li>Explore advanced AI capabilities for additional business value</li>
                  <li>Develop custom AI solutions for unique business needs</li>
                  <li>Establish a continuous improvement process</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Timeline and Milestones */}
        <div className="mb-10">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("timeline")}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: activeTheme.primaryColor }}>
              3. Timeline and Milestones
            </h2>
            {expandedSections.timeline ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {expandedSections.timeline && (
            <div className="space-y-6">
              <p>
                The following timeline outlines the key milestones for your AI implementation journey. This timeline is
                designed to be realistic while still allowing for rapid progress.
              </p>

              <div className="relative">
                {/* Timeline line */}
                <div
                  className="absolute left-4 top-0 bottom-0 w-0.5"
                  style={{ backgroundColor: activeTheme.primaryColor }}
                ></div>

                {/* Timeline items */}
                <div className="space-y-8 pl-12 relative">
                  {/* Month 1-2 */}
                  <div className="relative">
                    <div
                      className="absolute left-[-40px] top-0 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: activeTheme.primaryColor, color: "#fff" }}
                    >
                      1
                    </div>
                    <h4 className="text-lg font-semibold mb-2" style={{ color: activeTheme.secondaryColor }}>
                      Months 1-2: Assessment and Planning
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Complete initial assessment</li>
                      <li>Identify priority AI use cases</li>
                      <li>Develop implementation roadmap</li>
                      <li>Secure budget approval</li>
                    </ul>
                  </div>

                  {/* Month 3-4 */}
                  <div className="relative">
                    <div
                      className="absolute left-[-40px] top-0 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: activeTheme.primaryColor, color: "#fff" }}
                    >
                      2
                    </div>
                    <h4 className="text-lg font-semibold mb-2" style={{ color: activeTheme.secondaryColor }}>
                      Months 3-4: Initial Implementation
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Select and onboard AI solution providers</li>
                      <li>Configure first AI solution</li>
                      <li>Conduct staff training</li>
                      <li>Launch pilot program</li>
                    </ul>
                  </div>

                  {/* Month 5-6 */}
                  <div className="relative">
                    <div
                      className="absolute left-[-40px] top-0 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: activeTheme.primaryColor, color: "#fff" }}
                    >
                      3
                    </div>
                    <h4 className="text-lg font-semibold mb-2" style={{ color: activeTheme.secondaryColor }}>
                      Months 5-6: Expansion
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Evaluate pilot results</li>
                      <li>Refine AI solution based on feedback</li>
                      <li>Roll out to entire organization</li>
                      <li>Begin implementation of second AI solution</li>
                    </ul>
                  </div>

                  {/* Month 7-9 */}
                  <div className="relative">
                    <div
                      className="absolute left-[-40px] top-0 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: activeTheme.primaryColor, color: "#fff" }}
                    >
                      4
                    </div>
                    <h4 className="text-lg font-semibold mb-2" style={{ color: activeTheme.secondaryColor }}>
                      Months 7-9: Integration
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Integrate AI solutions with existing systems</li>
                      <li>Develop automated workflows</li>
                      <li>Measure initial ROI</li>
                      <li>Identify optimization opportunities</li>
                    </ul>
                  </div>

                  {/* Month 10-12 */}
                  <div className="relative">
                    <div
                      className="absolute left-[-40px] top-0 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: activeTheme.primaryColor, color: "#fff" }}
                    >
                      5
                    </div>
                    <h4 className="text-lg font-semibold mb-2" style={{ color: activeTheme.secondaryColor }}>
                      Months 10-12: Optimization and Innovation
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Optimize AI systems based on performance data</li>
                      <li>Explore advanced AI capabilities</li>
                      <li>Develop strategy for year 2</li>
                      <li>Conduct comprehensive ROI analysis</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Budget Allocation */}
        <div className="mb-10">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("budget")}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: activeTheme.primaryColor }}>
              4. Budget Allocation
            </h2>
            {expandedSections.budget ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {expandedSections.budget && (
            <div className="space-y-6">
              <p>
                Based on our analysis, we recommend the following budget allocation for your AI implementation. This
                allocation is designed to maximize ROI while ensuring all necessary resources are available.
              </p>

              {/* Budget chart */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: activeTheme.bgAccent }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: activeTheme.secondaryColor }}>
                  Recommended Budget Allocation
                </h3>

                <div className="space-y-4">
                  {/* Technology */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Technology (Software, APIs, Infrastructure)</span>
                      <span>45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full"
                        style={{ width: "45%", backgroundColor: activeTheme.primaryColor }}
                      ></div>
                    </div>
                  </div>

                  {/* Implementation */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Implementation (Configuration, Customization)</span>
                      <span>25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full"
                        style={{ width: "25%", backgroundColor: activeTheme.secondaryColor }}
                      ></div>
                    </div>
                  </div>

                  {/* Training */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Training and Change Management</span>
                      <span>15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full"
                        style={{ width: "15%", backgroundColor: activeTheme.accentColor }}
                      ></div>
                    </div>
                  </div>

                  {/* Contingency */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Contingency and Optimization</span>
                      <span>15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="h-2.5 rounded-full" style={{ width: "15%", backgroundColor: "#9CA3AF" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold" style={{ color: activeTheme.secondaryColor }}>
                  Cost Breakdown
                </h3>
                <p>The following breakdown provides more detail on the costs associated with each category:</p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium" style={{ color: activeTheme.primaryColor }}>
                      Technology (45%)
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>AI platform licenses</li>
                      <li>API access and usage fees</li>
                      <li>Cloud infrastructure</li>
                      <li>Data storage and processing</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium" style={{ color: activeTheme.secondaryColor }}>
                      Implementation (25%)
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Solution configuration</li>
                      <li>Custom development</li>
                      <li>Integration with existing systems</li>
                      <li>Testing and quality assurance</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium" style={{ color: activeTheme.accentColor }}>
                      Training and Change Management (15%)
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Staff training programs</li>
                      <li>Documentation and knowledge base</li>
                      <li>Change management activities</li>
                      <li>User adoption initiatives</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium">Contingency and Optimization (15%)</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Unexpected costs and challenges</li>
                      <li>Performance optimization</li>
                      <li>Additional customization</li>
                      <li>Scaling resources as needed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Risk Assessment */}
        <div className="mb-10">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("risks")}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: activeTheme.primaryColor }}>
              5. Risk Assessment and Mitigation
            </h2>
            {expandedSections.risks ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {expandedSections.risks && (
            <div className="space-y-6">
              <p>
                Every AI implementation comes with potential risks. We've identified the key risks for your
                implementation and developed mitigation strategies for each.
              </p>

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr style={{ backgroundColor: activeTheme.bgAccent }}>
                      <th
                        className="border border-gray-300 px-4 py-2 text-left"
                        style={{ color: activeTheme.primaryColor }}
                      >
                        Risk
                      </th>
                      <th
                        className="border border-gray-300 px-4 py-2 text-left"
                        style={{ color: activeTheme.primaryColor }}
                      >
                        Impact
                      </th>
                      <th
                        className="border border-gray-300 px-4 py-2 text-left"
                        style={{ color: activeTheme.primaryColor }}
                      >
                        Likelihood
                      </th>
                      <th
                        className="border border-gray-300 px-4 py-2 text-left"
                        style={{ color: activeTheme.primaryColor }}
                      >
                        Mitigation Strategy
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Data Quality Issues</td>
                      <td className="border border-gray-300 px-4 py-2">High</td>
                      <td className="border border-gray-300 px-4 py-2">Medium</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Conduct data audit and cleaning before implementation. Establish data governance processes.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">User Adoption Resistance</td>
                      <td className="border border-gray-300 px-4 py-2">High</td>
                      <td className="border border-gray-300 px-4 py-2">Medium</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Involve users in the implementation process. Provide comprehensive training and support.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Integration Challenges</td>
                      <td className="border border-gray-300 px-4 py-2">Medium</td>
                      <td className="border border-gray-300 px-4 py-2">High</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Conduct thorough systems audit. Use middleware if needed. Implement in phases.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Budget Overruns</td>
                      <td className="border border-gray-300 px-4 py-2">Medium</td>
                      <td className="border border-gray-300 px-4 py-2">Medium</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Include contingency in budget. Monitor costs closely. Prioritize high-impact features.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Security and Privacy Concerns</td>
                      <td className="border border-gray-300 px-4 py-2">High</td>
                      <td className="border border-gray-300 px-4 py-2">Low</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Implement robust security measures. Conduct privacy impact assessment. Ensure compliance.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50">
                <h3 className="text-lg font-semibold mb-2" style={{ color: activeTheme.primaryColor }}>
                  Continuous Risk Monitoring
                </h3>
                <p>
                  We recommend establishing a continuous risk monitoring process throughout the implementation. This
                  should include regular risk assessments, stakeholder feedback, and adjustment of mitigation strategies
                  as needed.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Conclusion */}
        <div className="mb-10 p-6 rounded-lg" style={{ backgroundColor: activeTheme.bgAccent }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: activeTheme.primaryColor }}>
            Conclusion
          </h2>
          <p className="mb-4">
            This AI implementation plan provides a comprehensive roadmap for successfully integrating AI into your
            {businessSize ? ` ${businessSize}` : ""} {businessType} business. By following this plan, you can expect to
            see significant improvements in efficiency, decision-making, and customer satisfaction.
          </p>
          <p className="mb-4">
            Remember that successful AI implementation is an iterative process. Regular assessment, feedback, and
            adjustment are essential for maximizing the value of your AI investments.
          </p>
          <p>
            We recommend scheduling a consultation with our AI implementation experts to discuss this plan in more
            detail and begin the journey toward becoming an AI-powered organization.
          </p>
        </div>

        {/* Contact information */}
        <div className="text-center p-6 border-t border-gray-200">
          <p className="font-semibold mb-2" style={{ color: activeTheme.primaryColor }}>
            For more information, please contact:
          </p>
          <p>NovaCrest AI Advisory Team</p>
          <p>Email: ai-advisory@novacrest.com</p>
          <p>Phone: (555) 123-4567</p>
        </div>
      </div>
    </div>
  )
}
