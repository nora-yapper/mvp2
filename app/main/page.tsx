"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, MessageCircle, X } from "lucide-react"

export default function MainPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = inputMessage.trim()
    setInputMessage("")
    setIsLoading(true)

    // Add user message
    const newMessages = [...messages, { role: "user", content: userMessage }]
    setMessages(newMessages)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()
      setMessages([...newMessages, { role: "assistant", content: data.message }])
    } catch (error) {
      console.error("Error:", error)
      setMessages([...newMessages, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#1a1a1a", color: "#e0e0e0", position: "relative" }}>
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
            { label: "Map", onClick: () => {}, active: true },
            { label: "Command Deck", onClick: () => (window.location.href = "/homebase"), active: false },
            { label: "Health Analysis", onClick: () => (window.location.href = "/health-check"), active: false },
            { label: "Forecast", onClick: () => (window.location.href = "/forecast"), active: false },
            { label: "Reports", onClick: () => (window.location.href = "/reports"), active: false },
            { label: "Network", onClick: () => (window.location.href = "/network"), active: false },
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

      {/* Chat Window */}
      {chatOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "400px",
            height: "500px",
            backgroundColor: "#2a2a2a",
            border: "1px solid #444",
            clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
            zIndex: 998,
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #444",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#333",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#e0e0e0" }}>AI Assistant</h3>
            <button
              onClick={() => setChatOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#999",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              padding: "16px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {messages.length === 0 && (
              <div style={{ textAlign: "center", color: "#666", fontSize: "14px", marginTop: "20px" }}>
                Ask me anything about your startup!
              </div>
            )}
            {messages.map((message, index) => (
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
                    backgroundColor: message.role === "user" ? "#007bff" : "#444",
                    color: "white",
                    borderRadius: "12px",
                    fontSize: "14px",
                    lineHeight: "1.4",
                    wordWrap: "break-word",
                  }}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: "flex-start", maxWidth: "80%" }}>
                <div
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "#444",
                    color: "#999",
                    borderRadius: "12px",
                    fontSize: "14px",
                  }}
                >
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: "16px",
              borderTop: "1px solid #444",
              display: "flex",
              gap: "8px",
            }}
          >
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: "12px",
                backgroundColor: "#1a1a1a",
                border: "1px solid #555",
                color: "#e0e0e0",
                borderRadius: "8px",
                resize: "none",
                fontSize: "14px",
                minHeight: "20px",
                maxHeight: "80px",
                outline: "none",
              }}
              rows={1}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              style={{
                padding: "12px",
                backgroundColor: inputMessage.trim() && !isLoading ? "#007bff" : "#555",
                border: "none",
                color: "white",
                borderRadius: "8px",
                cursor: inputMessage.trim() && !isLoading ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.2s",
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ padding: "100px 60px 60px", textAlign: "center" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "400", margin: "0 0 16px 0", color: "#e0e0e0" }}>
          Startup Command Center
        </h1>
        <p style={{ fontSize: "18px", color: "#999", margin: "0 0 60px 0" }}>
          Navigate your startup journey with precision and insight.
        </p>

        {/* Geometric Button Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "30px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {/* Research Button */}
          <button
            onClick={() => (window.location.href = "/research")}
            style={{
              background: "#2a2a2a",
              border: "1px solid #444",
              color: "#e0e0e0",
              padding: "40px 20px",
              fontSize: "18px",
              fontWeight: "500",
              cursor: "pointer",
              clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
              transition: "all 0.3s ease",
              letterSpacing: "0.05em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#007bff"
              e.currentTarget.style.transform = "translateY(-5px)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#2a2a2a"
              e.currentTarget.style.transform = "translateY(0)"
            }}
          >
            RESEARCH
          </button>

          {/* Product Button */}
          <button
            onClick={() => (window.location.href = "/product")}
            style={{
              background: "#2a2a2a",
              border: "1px solid #444",
              color: "#e0e0e0",
              padding: "40px 20px",
              fontSize: "18px",
              fontWeight: "500",
              cursor: "pointer",
              clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
              transition: "all 0.3s ease",
              letterSpacing: "0.05em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#007bff"
              e.currentTarget.style.transform = "translateY(-5px)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#2a2a2a"
              e.currentTarget.style.transform = "translateY(0)"
            }}
          >
            PRODUCT
          </button>

          {/* Homebase Button */}
          <button
            onClick={() => (window.location.href = "/homebase")}
            style={{
              background: "#2a2a2a",
              border: "1px solid #444",
              color: "#e0e0e0",
              padding: "40px 20px",
              fontSize: "18px",
              fontWeight: "500",
              cursor: "pointer",
              clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
              transition: "all 0.3s ease",
              letterSpacing: "0.05em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#007bff"
              e.currentTarget.style.transform = "translateY(-5px)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#2a2a2a"
              e.currentTarget.style.transform = "translateY(0)"
            }}
          >
            HOMEBASE
          </button>

          {/* Sales Button */}
          <button
            onClick={() => (window.location.href = "/sales")}
            style={{
              background: "#2a2a2a",
              border: "1px solid #444",
              color: "#e0e0e0",
              padding: "40px 20px",
              fontSize: "18px",
              fontWeight: "500",
              cursor: "pointer",
              clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
              transition: "all 0.3s ease",
              letterSpacing: "0.05em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#007bff"
              e.currentTarget.style.transform = "translateY(-5px)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#2a2a2a"
              e.currentTarget.style.transform = "translateY(0)"
            }}
          >
            SALES
          </button>
        </div>
      </div>

      {/* Chat Button - Bottom Right */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#007bff",
          border: "1px solid #0056b3",
          fontSize: "20px",
          cursor: "pointer",
          zIndex: 1000,
          color: "white",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#0056b3"
          e.currentTarget.style.transform = "scale(1.05)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#007bff"
          e.currentTarget.style.transform = "scale(1)"
        }}
      >
        <MessageCircle size={24} />
      </button>

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
    </div>
  )
}
