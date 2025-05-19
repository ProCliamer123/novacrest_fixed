"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import AnimatedLine from "@/components/animated-line"
import GeometricPattern from "@/components/geometric-pattern"
import FadeIn from "@/components/fade-in"
import AIBusinessAdvisor from "@/components/ai-business-advisor"
import ApproachVisualization from "@/components/approach-visualization"
import FloatingChatButton from "@/components/floating-chat-button"
import { ErrorBoundary } from "@/components/error-boundary"

export default function Home() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleScheduleDemo = () => {
    router.push("/booking")
  }

  return (
    <ErrorBoundary>
      <div className="novacrest-wrapper relative min-h-screen grid-background text-black overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          <GeometricPattern />
          <AnimatedLine />
        </div>

        {/* Floating Chat Button */}
        <FloatingChatButton />

        {/* Header */}
        <header
          className={`novacrest-header fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? "bg-[#f5f2e8]/90 backdrop-blur-sm py-3" : "py-6"
          }`}
        >
          <div className="container mx-auto px-6 flex items-center justify-between">
            <Link href="/" className="relative z-10">
              <h1 className="text-2xl font-bold tracking-tight">NovaCrest</h1>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              {["Solutions", "Careers", "Free Templates"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-black/80 hover:text-black transition-colors"
                >
                  {item}
                </Link>
              ))}
              <Button className="bg-black text-[#f5f2e8] hover:bg-black/90" onClick={handleScheduleDemo}>
                Book A Call
              </Button>
              <Link href="/login">
                <Button variant="outline" className="border-black text-black hover:bg-black/5">
                  Client Sign In
                </Button>
              </Link>
              <Link href="/admin/login">
                <Button variant="outline" className="ml-2 border-black text-black hover:bg-black/5 bg-gray-100">
                  Admin
                </Button>
              </Link>
            </nav>

            <button
              className="md:hidden relative z-10 p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </header>

        {/* Mobile menu */}
        <div
          className={`novacrest-mobile-menu fixed inset-0 bg-[#f5f2e8] z-40 transform transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          } md:hidden flex flex-col justify-center`}
        >
          <div className="container mx-auto px-6">
            <nav className="flex flex-col space-y-8 items-center">
              {["Solutions", "Careers", "Free Templates"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-xl font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <Button
                className="mt-4 w-full bg-black text-[#f5f2e8] hover:bg-black/90"
                onClick={() => {
                  setMenuOpen(false)
                  handleScheduleDemo()
                }}
              >
                Book A Call
              </Button>
              <Link href="/login" className="w-full">
                <Button
                  variant="outline"
                  className="mt-4 w-full border-black text-black hover:bg-black/5"
                  onClick={() => setMenuOpen(false)}
                >
                  Client Sign In
                </Button>
              </Link>
              <Link href="/admin/login" className="w-full">
                <Button
                  variant="outline"
                  className="mt-4 w-full border-black text-black hover:bg-black/5 bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin
                </Button>
              </Link>
            </nav>
          </div>
        </div>

        {/* Hero section */}
        <section className="novacrest-hero relative min-h-screen flex items-center">
          <div className="container mx-auto px-6 pt-24 pb-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <FadeIn className="max-w-xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
                  Become an <br />
                  AI-First Company
                </h1>
                <p className="text-lg md:text-xl text-black/80 mb-8">
                  We help high-growth companies adopt cutting-edge AI systems to save time, cut costs & accelerate
                  growth.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-black text-[#f5f2e8] hover:bg-black/90" onClick={handleScheduleDemo}>
                    Schedule a Demo <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </FadeIn>

              <FadeIn delay={300} className="relative">
                <AIBusinessAdvisor />
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Services section */}
        <section id="services" className="novacrest-services relative py-24">
          <div className="services-background"></div>
          <div className="container mx-auto px-6">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Our Services</h2>
              <p className="text-black/70 text-center max-w-2xl mx-auto mb-16">
                We provide cutting-edge AI solutions tailored to your business needs, helping you stay ahead of the
                competition.
              </p>
            </FadeIn>

            <div className="services-grid">
              {/* Content Agent */}
              <FadeIn delay={0} className="service-box">
                <div className="service-icon flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 12h.01"></path>
                    <path d="M19.39 15A9 9 0 1 1 7.64 4.94"></path>
                    <circle cx="17.5" cy="6.5" r="3.5"></circle>
                  </svg>
                </div>
                <h3 className="service-title">Content Agent</h3>
                <p className="service-description">
                  Our AI-powered content creation system generates high-quality, SEO-optimized content tailored to your
                  brand voice and marketing goals.
                </p>
                <a href="#" className="service-link">
                  Learn more{" "}
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
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </a>
              </FadeIn>

              {/* SEO Agency */}
              <FadeIn delay={200} className="service-box">
                <div className="service-icon flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m21 11-8-8-9 9"></path>
                    <path d="m21 11-8 8-9-9"></path>
                  </svg>
                </div>
                <h3 className="service-title">SEO Agency</h3>
                <p className="service-description">
                  Boost your search rankings with our data-driven SEO strategies that combine AI analysis with expert
                  human optimization.
                </p>
                <a href="#" className="service-link">
                  Learn more{" "}
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
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </a>
              </FadeIn>

              {/* BDR Agent */}
              <FadeIn delay={400} className="service-box">
                <div className="service-icon flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <h3 className="service-title">BDR Agent</h3>
                <p className="service-description">
                  Drive business growth with our intelligent lead generation and qualification system that identifies
                  and engages your ideal prospects.
                </p>
                <a href="#" className="service-link">
                  Learn more{" "}
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
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </a>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Approach section */}
        <section id="approach" className="novacrest-approach relative py-20">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <FadeIn>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Approach</h2>
                <p className="text-black/80 mb-8">
                  Nova Crest delivers intelligence that matters through a sophisticated process that combines advanced
                  AI with expert human curation.
                </p>
                <ul className="space-y-4">
                  {[
                    "Personalized data collection tailored to your needs",
                    "AI-powered analysis of complex information landscapes",
                    "Expert curation ensuring relevance and accuracy",
                    "Delivery optimized for your workflow and preferences",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full border border-black/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm">{i + 1}</span>
                      </div>
                      <span className="text-black/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>

              <FadeIn delay={300} className="relative h-[400px]">
                <div className="absolute inset-0 overflow-hidden rounded-lg border border-black/10 bg-black/5">
                  <ApproachVisualization />
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Contact section */}
        <section id="contact" className="novacrest-contact relative py-20">
          <div className="container mx-auto px-6">
            <FadeIn>
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-black/80">
                  Schedule a consultation with our team to discover how Nova Crest can transform your organization's AI
                  strategy and implementation.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="max-w-md mx-auto">
                <Button
                  size="lg"
                  className="w-full bg-black text-[#f5f2e8] hover:bg-black/90"
                  onClick={handleScheduleDemo}
                >
                  Book A Call
                </Button>
                <p className="text-center text-black/60 mt-4 text-sm">
                  Or contact us at{" "}
                  <a href="mailto:info@novacrest.com" className="underline hover:text-black">
                    info@novacrest.com
                  </a>
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Footer */}
        <footer className="novacrest-footer relative py-12 border-t border-black/10">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl font-bold tracking-tight">NovaCrest</h2>
                <p className="text-black/60 text-sm mt-1">Conquering New Mountains in Consistency</p>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-center">
                <nav className="flex gap-6">
                  {["Solutions", "Careers", "Free Templates"].map((item) => (
                    <Link
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className="text-sm text-black/60 hover:text-black transition-colors"
                    >
                      {item}
                    </Link>
                  ))}
                </nav>

                <div className="text-black/60 text-sm">© 2025 Nova Crest. All rights reserved.</div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  )
}
