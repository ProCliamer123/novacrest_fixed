"use client"

import { useEffect, useRef } from "react"

export default function ApproachVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Nodes and connections
    const nodes = [
      { id: 1, x: canvas.width * 0.2, y: canvas.height * 0.3, radius: 20, color: "#000", label: "Data" },
      { id: 2, x: canvas.width * 0.5, y: canvas.height * 0.2, radius: 20, color: "#000", label: "AI" },
      { id: 3, x: canvas.width * 0.8, y: canvas.height * 0.3, radius: 20, color: "#000", label: "Analysis" },
      { id: 4, x: canvas.width * 0.2, y: canvas.height * 0.7, radius: 20, color: "#000", label: "Insights" },
      { id: 5, x: canvas.width * 0.5, y: canvas.height * 0.8, radius: 20, color: "#000", label: "Strategy" },
      { id: 6, x: canvas.width * 0.8, y: canvas.height * 0.7, radius: 20, color: "#000", label: "Growth" },
    ]

    const connections = [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 6 },
      { from: 1, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 6 },
      { from: 2, to: 5 },
    ]

    // Animation properties
    let animationFrame = 0
    const totalFrames = 120
    const pulseInterval = 60

    // Animation
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      connections.forEach((connection) => {
        const fromNode = nodes.find((node) => node.id === connection.from)
        const toNode = nodes.find((node) => node.id === connection.to)

        if (fromNode && toNode) {
          // Calculate progress for this connection
          const progress = Math.min(1, animationFrame / totalFrames)

          // Draw line
          ctx.beginPath()
          ctx.moveTo(fromNode.x, fromNode.y)
          ctx.lineTo(fromNode.x + (toNode.x - fromNode.x) * progress, fromNode.y + (toNode.y - fromNode.y) * progress)
          ctx.strokeStyle = "rgba(0, 0, 0, 0.2)"
          ctx.lineWidth = 2
          ctx.stroke()

          // Draw pulse
          if (progress === 1) {
            const pulsePhase = (animationFrame % pulseInterval) / pulseInterval
            if (pulsePhase < 0.5) {
              const pulsePosition = pulsePhase * 2 // 0 to 1 during first half of interval
              const pulseX = fromNode.x + (toNode.x - fromNode.x) * pulsePosition
              const pulseY = fromNode.y + (toNode.y - fromNode.y) * pulsePosition

              ctx.beginPath()
              ctx.arc(pulseX, pulseY, 4, 0, Math.PI * 2)
              ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
              ctx.fill()
            }
          }
        }
      })

      // Draw nodes
      nodes.forEach((node) => {
        // Node circle
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
        ctx.fill()
        ctx.strokeStyle = "rgba(0, 0, 0, 0.2)"
        ctx.lineWidth = 2
        ctx.stroke()

        // Node label
        ctx.font = "12px sans-serif"
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(node.label, node.x, node.y)
      })

      animationFrame = (animationFrame + 1) % (totalFrames + pulseInterval)
      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
