"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send } from "lucide-react"

export default function MainPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [hasResearchPlan, setHasResearchPlan] = useState(false)
  const [hasProductPlan, setHasProductPlan] = useState(false)
  const [hasSalesPlan, setHasSalesPlan] = useState(false)

  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string; timestamp: Date }>
  >([])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatMessagesRef = useRef<HTMLDivElement>(null)

  // Check if user has generated plans in this session
  useEffect(() => {
    const researchPlan = sessionStorage.getItem("researchPlanGenerated")
    const productPlan = sessionStorage.getItem("productPlanGenerated")
    const salesPlan = sessionStorage.getItem("salesPlanGenerated")

    setHasResearchPlan(!!researchPlan)
    setHasProductPlan(!!productPlan)
    setHasSalesPlan(!!salesPlan)
  }, [])

  // Initialize chat with welcome message
  useEffect(() => {
    const welcomeMessage = {
      role: "assistant" as const,
      content:
        "Hi, I'm Nora AI-stronaut! 🚀\n\nI'm your startup companion, here to help with everything from product development and market research to sales strategies and team building.\n\nAsk me anything about growing your startup - I'm here to help you navigate your entrepreneurial journey!",
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

  const handleResearchClick = () => {
    if (hasResearchPlan) {
      window.location.href = "/research/plan"
    } else {
      window.location.href = "/research"
    }
  }

  const handleProductClick = () => {
    if (hasProductPlan) {
      window.location.href = "/product/plan"
    } else {
      window.location.href = "/product"
    }
  }

  const handleSalesClick = () => {
    if (hasSalesPlan) {
      window.location.href = "/sales/plan"
    } else {
      window.location.href = "/sales"
    }
  }

  const handleHomebaseClick = () => {
    window.location.href = "/homebase/workspace"
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return

    const userMessage = {
      role: "user" as const,
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
                "You are Nora AI-stronaut, a helpful AI assistant for startups. You help entrepreneurs with all aspects of building and growing their startup - from product development and market research to sales, team building, and strategic planning. Keep responses concise and actionable. Use a friendly, professional tone with occasional space/rocket emojis.",
            },
            ...chatMessages.map((msg) => ({ role: msg.role, content: msg.content })),
            { role: "user", content: chatInput },
          ],
        }),
      })

      const data = await response.json()

      const assistantMessage = {
        role: "assistant" as const,
        content: data.message || "I'm here to help you with your startup health analysis!",
        timestamp: new Date(),
      }

      setChatMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage = {
        role: "assistant" as const,
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

  // Geometric button component
  const GeometricButton = ({
    children,
    onClick,
    style = {},
  }: {
    children: React.ReactNode
    onClick: () => void
    style?: React.CSSProperties
  }) => (
    <button
      onClick={onClick}
      style={{
        padding: "50px 30px",
        fontSize: "1.2rem",
        cursor: "pointer",
        backgroundColor: "#2a2a2a",
        color: "#e0e0e0",
        border: "1px solid #444",
        clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
        fontWeight: "500",
        letterSpacing: "0.05em",
        transition: "all 0.3s ease",
        position: "relative",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#3a3a3a"
        e.currentTarget.style.transform = "translateY(-3px)"
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.3)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#2a2a2a"
        e.currentTarget.style.transform = "translateY(0px)"
        e.currentTarget.style.boxShadow = "none"
      }}
    >
      {children}
    </button>
  )

  return (
    <div style={{ minHeight: "100vh", position: "relative", backgroundColor: "#1a1a1a" }}>
      {/* Hamburger Menu - Top Left */}
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
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#3a3a3a"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#2a2a2a"
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
        {/* Top section - Settings and Profile icons */}
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

        {/* Six vertically stacked buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { label: "Map", onClick: () => (window.location.href = "/main"), active: true },
            { label: "Command Deck", onClick: () => {} },
            { label: "Health Check", onClick: () => (window.location.href = "/health-check") },
            { label: "Forecast", onClick: () => (window.location.href = "/forecast") },
            { label: "Reports", onClick: () => (window.location.href = "/reports") },
            { label: "Network", onClick: () => (window.location.href = "/network") },
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
              onMouseEnter={(e) => {
                if (!item.active) {
                  e.currentTarget.style.backgroundColor = "#3a3a3a"
                }
              }}
              onMouseLeave={(e) => {
                if (!item.active) {
                  e.currentTarget.style.backgroundColor = "#1a1a1a"
                }
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - Center Grid */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "30px",
            width: "500px",
          }}
        >
          <GeometricButton onClick={handleResearchClick}>RESEARCH</GeometricButton>
          <GeometricButton onClick={handleProductClick}>PRODUCT</GeometricButton>
          <GeometricButton onClick={handleHomebaseClick}>HOMEBASE</GeometricButton>
          <GeometricButton onClick={handleSalesClick}>SALES</GeometricButton>
        </div>
      </div>

      {/* Chat Button - Bottom Right */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          backgroundColor: "#007bff",
          color: "white",
          border: "1px solid #0056b3",
          fontSize: "24px",
          cursor: "pointer",
          zIndex: 1000,
          clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#0056b3"
          e.currentTarget.style.transform = "translateY(-2px)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#007bff"
          e.currentTarget.style.transform = "translateY(0px)"
        }}
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      {chatOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "400px",
            height: "500px",
            backgroundColor: "#2a2a2a",
            border: "1px solid #444",
            clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
            zIndex: 1001,
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              padding: "20px",
              borderBottom: "1px solid #444",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#333",
              clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 5px), 0 100%)",
            }}
          >
            <div>
              <h3 style={{ margin: "0", fontSize: "18px", fontWeight: "600", color: "#e0e0e0" }}>
                Nora AI-stronaut 🚀
              </h3>
              <p style={{ margin: "0", fontSize: "12px", color: "#999" }}>Your Startup Companion</p>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#999",
                cursor: "pointer",
                padding: "5px",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#fff"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#999"
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div
            ref={chatMessagesRef}
            style={{
              flex: 1,
              padding: "20px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            {chatMessages.map((message, index) => (
              <div
                key={index}
                style={{
                  alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                }}
              >
                <div
                  style={{
                    padding: "12px 16px",
                    backgroundColor: message.role === "user" ? "#007bff" : "#333",
                    color: "#e0e0e0",
                    fontSize: "14px",
                    lineHeight: "1.4",
                    clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {message.content}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#666",
                    marginTop: "5px",
                    textAlign: message.role === "user" ? "right" : "left",
                  }}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ alignSelf: "flex-start", maxWidth: "80%" }}>
                <div
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "#333",
                    color: "#999",
                    fontSize: "14px",
                    clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                  }}
                >
                  Nora is typing...
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div
            style={{
              padding: "20px",
              borderTop: "1px solid #444",
              display: "flex",
              gap: "10px",
              alignItems: "flex-end",
            }}
          >
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={handleChatKeyPress}
              placeholder="Ask me anything about your startup..."
              style={{
                flex: 1,
                padding: "12px",
                backgroundColor: "#1a1a1a",
                border: "1px solid #444",
                color: "#e0e0e0",
                fontSize: "14px",
                resize: "none",
                minHeight: "40px",
                maxHeight: "100px",
                clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                outline: "none",
              }}
              rows={1}
            />
            <button
              onClick={sendChatMessage}
              disabled={!chatInput.trim() || isTyping}
              style={{
                background: chatInput.trim() && !isTyping ? "#007bff" : "#444",
                border: "1px solid #555",
                color: "#e0e0e0",
                width: "40px",
                height: "40px",
                cursor: chatInput.trim() && !isTyping ? "pointer" : "not-allowed",
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.3s ease",
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

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

      {/* Subtle background pattern */}
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
    </div>
  )
}
