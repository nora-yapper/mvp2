"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ArrowUp, ChevronDown } from "lucide-react"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function HealthCheckPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [expandedMetrics, setExpandedMetrics] = useState<Set<string>>(new Set())
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatMessagesRef = useRef<HTMLDivElement>(null)
  const [analysisResult, setAnalysisResult] = useState("")

  const metrics = [
    { title: "Product & Innovation", score: 85, category: "top" },
    { title: "Marketing & Brand", score: 62, category: "top" },
    { title: "Sales & Revenue", score: 95, category: "top" },
    { title: "Team & Culture", score: 73, category: "bottom" },
    { title: "Operations & Scalability", score: 45, category: "bottom" },
    { title: "Financial Health", score: 88, category: "bottom" },
  ]

  // Initialize chat with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      role: "assistant",
      content:
        "Hi, I'm Nora AI-stronaut! 🚀\n\nI can help you explore your startup's health, interpret your scores, and guide you through your next steps.\n\nAsk me anything about your metrics, how to improve them, or where to focus next!",
      timestamp: new Date(),
    }
    setChatMessages([welcomeMessage])
  }, [])

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
    }
  }, [chatMessages])

  const handleAnalyze = async () => {
    if (inputValue.trim()) {
      setShowAnalysis(true)
      setAnalysisResult("Analyzing...")

      try {
        const response = await fetch("/api/analyze-startup-area", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            area: inputValue.trim(),
          }),
        })

        const data = await response.json()
        setAnalysisResult(data.analysis || "Analysis complete. Please try again.")
      } catch (error) {
        console.error("Analysis error:", error)
        setAnalysisResult("Sorry, I'm having trouble analyzing right now. Please try again in a moment.")
      }
    }
  }

  const handleViewDetails = (title: string) => {
    setExpandedMetrics((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(title)) {
        newSet.delete(title)
      } else {
        newSet.add(title)
      }
      return newSet
    })
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return

    const userMessage: ChatMessage = {
      role: "user",
      content: chatInput,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are Nora AI-stronaut, a helpful AI assistant for startup health analysis. You help entrepreneurs understand their metrics and provide actionable advice. Keep responses concise and actionable. Use a friendly, professional tone with occasional space/rocket emojis.",
            },
            ...chatMessages.map((msg) => ({ role: msg.role, content: msg.content })),
            { role: "user", content: chatInput },
          ],
        }),
      })

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.message || "I'm here to help you with your startup health analysis!",
        timestamp: new Date(),
      }

      setChatMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment! 🚀",
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleChatKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendChatMessage()
    }
  }

  // Metric Card Component
  const MetricCard = ({ title, score }: { title: string; score: number }) => {
    const isExpanded = expandedMetrics.has(title)

    return (
      <div>
        <div
          style={{
            backgroundColor: "#2a2a2a",
            border: "1px solid #444",
            padding: "30px 20px",
            clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
            textAlign: "center",
            minHeight: "280px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <h3
            style={{
              color: "#e0e0e0",
              fontSize: "18px",
              fontWeight: "500",
              margin: "0 0 30px 0",
              letterSpacing: "0.05em",
            }}
          >
            {title}
          </h3>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Vertical Bar Chart */}
            <div
              style={{
                width: "40px",
                height: "120px",
                backgroundColor: "#1a1a1a",
                border: "1px solid #444",
                position: "relative",
                marginBottom: "20px",
                clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "0",
                  right: "0",
                  height: `${score}%`,
                  background: "linear-gradient(to top, #666, #aaa)",
                  clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                }}
              />
            </div>

            <div
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "#e0e0e0",
                marginBottom: "5px",
              }}
            >
              {score}%
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#999",
                marginBottom: "20px",
              }}
            >
              Current Score
            </div>
          </div>

          <button
            onClick={() => handleViewDetails(title)}
            style={{
              background: "transparent",
              border: "none",
              color: "#ccc",
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              padding: "10px",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#fff"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#ccc"
            }}
          >
            View Details{" "}
            <ChevronDown
              size={16}
              style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}
            />
          </button>
        </div>

        {/* Dropdown Details */}
        {isExpanded && (
          <div
            style={{
              marginTop: "10px",
              padding: "20px",
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
              color: "#999",
              fontSize: "14px",
              lineHeight: "1.6",
              textAlign: "center",
              animation: "slideDown 0.3s ease-out",
            }}
          >
            Details coming soon...
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#1a1a1a", color: "#e0e0e0" }}>
      {/* Hamburger Menu */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          background: "#2a2a2a",
          border: "1px solid #444",
          fontSize: "24px",
          cursor: "pointer",
          zIndex: 1000,
          color: "#e0e0e0",
          width: "50px",
          height: "50px",
          clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
        }}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: sidebarOpen ? 0 : "-300px",
          width: "300px",
          height: "100vh",
          backgroundColor: "#2a2a2a",
          transition: "left 0.3s ease",
          zIndex: 999,
          padding: "20px",
          borderRight: "1px solid #444",
        }}
      >
        <div style={{ marginTop: "0px", marginBottom: "30px" }}>
          <div style={{ display: "flex", gap: "20px", justifyContent: "right" }}>
            <button
              style={{
                background: "#1a1a1a",
                border: "1px solid #444",
                fontSize: "24px",
                cursor: "pointer",
                color: "#e0e0e0",
                width: "45px",
                height: "45px",
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              }}
            >
              ⚙️
            </button>
            <button
              style={{
                background: "#1a1a1a",
                border: "1px solid #444",
                fontSize: "24px",
                cursor: "pointer",
                color: "#e0e0e0",
                width: "45px",
                height: "45px",
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              }}
            >
              👤
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { label: "Map", onClick: () => (window.location.href = "/main"), active: false },
            { label: "Command Deck", onClick: () => (window.location.href = "/homebase"), active: false },
            { label: "Health Check", onClick: () => {}, active: true },
            { label: "Forecast", onClick: () => (window.location.href = "/forecast"), active: false },
            { label: "Reports", onClick: () => (window.location.href = "/reports"), active: false },
            { label: "Network", onClick: () => (window.location.href = "/network"), active: false },
            { label: "Team", onClick: () => (window.location.href = "/team"), active: false },
          ].map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              style={{
                padding: "18px",
                fontSize: "16px",
                cursor: "pointer",
                border: "1px solid #444",
                backgroundColor: item.active ? "#007bff" : "#1a1a1a",
                color: "#e0e0e0",
                width: "100%",
                clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                letterSpacing: "0.05em",
                fontWeight: "500",
                transition: "all 0.3s ease",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "100px 50px 50px 50px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "300",
              margin: "0 0 20px 0",
              letterSpacing: "0.05em",
            }}
          >
            Health Check
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "#999",
              margin: "0 0 40px 0",
              lineHeight: "1.6",
            }}
          >
            Choose an area to analyze and I'll show you how your startup is doing
          </p>

          {/* Input Field */}
          <div style={{ position: "relative", maxWidth: "500px", margin: "0 auto" }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g. team, product, growth, research..."
              style={{
                width: "100%",
                padding: "15px 60px 15px 20px",
                backgroundColor: "#2a2a2a",
                border: "1px solid #444",
                color: "#e0e0e0",
                fontSize: "16px",
                clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                outline: "none",
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAnalyze()
                }
              }}
            />
            <button
              onClick={handleAnalyze}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "#666",
                border: "1px solid #888",
                color: "#e0e0e0",
                width: "40px",
                height: "40px",
                cursor: "pointer",
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowUp size={20} />
            </button>
          </div>
        </div>

        {/* Analysis Results */}
        {showAnalysis && (
          <div
            style={{
              marginBottom: "60px",
              padding: "30px",
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
              maxWidth: "800px",
              margin: "0 auto 60px auto",
            }}
          >
            <h3
              style={{
                fontSize: "24px",
                fontWeight: "500",
                margin: "0 0 20px 0",
                letterSpacing: "0.05em",
              }}
            >
              Analysis Results for "{inputValue}"
            </h3>
            <p
              style={{
                color: "#ccc",
                lineHeight: "1.6",
                margin: "0",
                fontSize: "16px",
              }}
            >
              {analysisResult}
            </p>
          </div>
        )}

        {/* Metrics Section */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2
            style={{
              fontSize: "36px",
              fontWeight: "300",
              margin: "0 0 15px 0",
              letterSpacing: "0.05em",
            }}
          >
            Your Startup Metrics
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "#999",
              margin: "0 0 50px 0",
            }}
          >
            Real-time health metrics of key areas
          </p>

          {/* Top Row Metrics */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "30px",
              marginBottom: "40px",
            }}
          >
            {metrics
              .filter((m) => m.category === "top")
              .map((metric, index) => (
                <MetricCard key={index} title={metric.title} score={metric.score} />
              ))}
          </div>

          {/* Bottom Row Metrics */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "30px",
            }}
          >
            {metrics
              .filter((m) => m.category === "bottom")
              .map((metric, index) => (
                <MetricCard key={index} title={metric.title} score={metric.score} />
              ))}
          </div>
        </div>
      </div>

      {/* Overlay for sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 998,
          }}
        />
      )}

      {/* Background pattern */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.01) 50%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, rgba(255,255,255,0.01) 50%, transparent 51%)
          `,
          backgroundSize: "30px 30px",
          zIndex: -1,
        }}
      />
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
