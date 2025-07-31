"use client"

import { useState, useEffect } from "react"

export default function SalesTaskPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [currentSection, setCurrentSection] = useState<string>("")
  const [currentTask, setCurrentTask] = useState<string>("")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const section = params.get("section") || ""
    const task = params.get("task") || ""
    const options = params.get("options")

    setCurrentSection(section)
    setCurrentTask(task)

    if (options) {
      setSelectedOptions(options.split(","))
    }
  }, [])

  const getTaskTitle = () => {
    if (currentSection === "overview" && currentTask === "sales-strategy") {
      return "Sales Strategy & Approach"
    }
    if (currentSection === "value-proposition" && currentTask === "customer-profile") {
      return "Customer Profile"
    }
    if (currentSection === "value-proposition" && currentTask === "value-map") {
      return "Value Map"
    }
    return "Task Details"
  }

  const getTaskContent = () => {
    if (currentSection === "overview" && currentTask === "sales-strategy") {
      return (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div
            style={{
              backgroundColor: "#2a2a2a",
              color: "#e0e0e0",
              padding: "40px",
              borderRadius: "8px",
              marginBottom: "30px",
            }}
          >
            <h3 style={{ fontSize: "24px", marginBottom: "20px", color: "#fff" }}>Define Your Sales Strategy</h3>
            <p style={{ marginBottom: "20px", lineHeight: "1.6" }}>
              Develop a comprehensive sales strategy that aligns with your business goals and target market. Define your
              approach to customer acquisition and retention.
            </p>

            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
                What is your target market?
              </label>
              <textarea
                style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "15px",
                  backgroundColor: "#1a1a1a",
                  color: "#e0e0e0",
                  border: "1px solid #444",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
                placeholder="Define your ideal customer segments and market size..."
              />
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
                What is your sales process?
              </label>
              <textarea
                style={{
                  width: "100%",
                  minHeight: "80px",
                  padding: "15px",
                  backgroundColor: "#1a1a1a",
                  color: "#e0e0e0",
                  border: "1px solid #444",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
                placeholder="Outline your sales funnel and process steps..."
              />
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
                What are your sales goals and metrics?
              </label>
              <textarea
                style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "15px",
                  backgroundColor: "#1a1a1a",
                  color: "#e0e0e0",
                  border: "1px solid #444",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
                placeholder="Define revenue targets, conversion rates, customer acquisition costs..."
              />
            </div>

            <button
              style={{
                padding: "12px 24px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Save Sales Strategy
            </button>
          </div>
        </div>
      )
    }

    if (currentSection === "value-proposition" && currentTask === "customer-profile") {
      return (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div
            style={{
              backgroundColor: "#2a2a2a",
              color: "#e0e0e0",
              padding: "40px",
              borderRadius: "8px",
              marginBottom: "30px",
            }}
          >
            <h3 style={{ fontSize: "24px", marginBottom: "20px", color: "#fff" }}>Customer Profile Analysis</h3>
            <p style={{ marginBottom: "30px", lineHeight: "1.6" }}>
              Create detailed customer profiles by identifying their jobs-to-be-done, pain points, and desired gains.
              Understanding your customers is key to creating compelling value propositions.
            </p>

            <div style={{ marginBottom: "30px" }}>
              <h4 style={{ fontSize: "18px", marginBottom: "15px", color: "#ccc" }}>Customer Jobs</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  "Functional jobs (practical tasks)",
                  "Emotional jobs (feelings and emotions)",
                  "Social jobs (how they want to be perceived)",
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "15px",
                      backgroundColor: "#1a1a1a",
                      borderRadius: "4px",
                      border: "1px solid #444",
                    }}
                  >
                    <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", color: "#ccc" }}>
                      {item}
                    </label>
                    <textarea
                      style={{
                        width: "100%",
                        minHeight: "60px",
                        padding: "10px",
                        backgroundColor: "#0a0a0a",
                        color: "#e0e0e0",
                        border: "1px solid #333",
                        borderRadius: "4px",
                        fontSize: "13px",
                      }}
                      placeholder={`Describe ${item.toLowerCase()}...`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "30px" }}>
              <h4 style={{ fontSize: "18px", marginBottom: "15px", color: "#ccc" }}>Pain Points</h4>
              <textarea
                style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "15px",
                  backgroundColor: "#1a1a1a",
                  color: "#e0e0e0",
                  border: "1px solid #444",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
                placeholder="List customer frustrations, obstacles, and negative emotions..."
              />
            </div>

            <div style={{ marginBottom: "30px" }}>
              <h4 style={{ fontSize: "18px", marginBottom: "15px", color: "#ccc" }}>Desired Gains</h4>
              <textarea
                style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "15px",
                  backgroundColor: "#1a1a1a",
                  color: "#e0e0e0",
                  border: "1px solid #444",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
                placeholder="Describe benefits customers want, positive emotions they seek..."
              />
            </div>

            <button
              style={{
                padding: "12px 24px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Save Customer Profile
            </button>
          </div>
        </div>
      )
    }

    if (currentSection === "value-proposition" && currentTask === "value-map") {
      return (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div
            style={{
              backgroundColor: "#2a2a2a",
              color: "#e0e0e0",
              padding: "40px",
              borderRadius: "8px",
              marginBottom: "30px",
            }}
          >
            <h3 style={{ fontSize: "24px", marginBottom: "20px", color: "#fff" }}>Value Map Creation</h3>
            <p style={{ marginBottom: "30px", lineHeight: "1.6" }}>
              Map your products and services to customer needs. Define how you create value through pain relievers and
              gain creators that directly address customer jobs, pains, and gains.
            </p>

            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>Products & Services</label>
              <textarea
                style={{
                  width: "100%",
                  minHeight: "80px",
                  padding: "15px",
                  backgroundColor: "#1a1a1a",
                  color: "#e0e0e0",
                  border: "1px solid #444",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
                placeholder="List your core products and services..."
              />
            </div>

            <div style={{ marginBottom: "30px" }}>
              <h4 style={{ fontSize: "18px", marginBottom: "15px", color: "#ccc" }}>Pain Relievers</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {[
                  "How do you eliminate customer frustrations?",
                  "How do you remove obstacles?",
                  "How do you reduce risks?",
                ].map((question, index) => (
                  <div key={index}>
                    <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", color: "#ccc" }}>
                      {question}
                    </label>
                    <textarea
                      style={{
                        width: "100%",
                        minHeight: "60px",
                        padding: "10px",
                        backgroundColor: "#1a1a1a",
                        color: "#e0e0e0",
                        border: "1px solid #444",
                        borderRadius: "4px",
                        fontSize: "13px",
                      }}
                      placeholder="Describe how your solution addresses this..."
                    />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "30px" }}>
              <h4 style={{ fontSize: "18px", marginBottom: "15px", color: "#ccc" }}>Gain Creators</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {[
                  "How do you create benefits customers expect?",
                  "How do you deliver outcomes that exceed expectations?",
                  "How do you create positive emotions?",
                ].map((question, index) => (
                  <div key={index}>
                    <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", color: "#ccc" }}>
                      {question}
                    </label>
                    <textarea
                      style={{
                        width: "100%",
                        minHeight: "60px",
                        padding: "10px",
                        backgroundColor: "#1a1a1a",
                        color: "#e0e0e0",
                        border: "1px solid #444",
                        borderRadius: "4px",
                        fontSize: "13px",
                      }}
                      placeholder="Describe the value you create..."
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              style={{
                padding: "12px 24px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Save Value Map
            </button>
          </div>
        </div>
      )
    }

    return <div>Task content not found</div>
  }

  return (
    <div style={{ minHeight: "100vh", position: "relative", backgroundColor: "#1a1a1a" }}>
      {/* Top Bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "60px",
          backgroundColor: "white",
          borderBottom: "1px solid #ccc",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          zIndex: 1000,
        }}
      >
        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            marginRight: "15px",
          }}
        >
          ☰
        </button>

        {/* Back Arrow */}
        <button
          onClick={() => {
            const optionsParam = selectedOptions.join(",")
            window.location.href = `/sales/detail?step=${currentSection}&options=${optionsParam}`
          }}
          style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          ←
        </button>

        {/* Task Title */}
        <h2 style={{ marginLeft: "20px", fontSize: "18px", color: "#333" }}>{getTaskTitle()}</h2>
      </div>

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: sidebarOpen ? 0 : "-300px",
          width: "300px",
          height: "100vh",
          backgroundColor: "#f0f0f0",
          transition: "left 0.3s ease",
          zIndex: 999,
          padding: "20px",
        }}
      >
        {/* Top section - Settings and Profile icons */}
        <div style={{ marginTop: "0px", marginBottom: "30px" }}>
          <div style={{ display: "flex", gap: "20px", justifyContent: "right" }}>
            <button
              style={{
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
              }}
            >
              ⚙️
            </button>
            <button
              style={{
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
              }}
            >
              👤
            </button>
          </div>
        </div>

        {/* Six vertically stacked buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            onClick={() => (window.location.href = "/main")}
            style={{
              padding: "15px",
              fontSize: "16px",
              cursor: "pointer",
              border: "1px solid #ccc",
              backgroundColor: "white",
              width: "100%",
            }}
          >
            Map
          </button>
          <button
            style={{
              padding: "15px",
              fontSize: "16px",
              cursor: "pointer",
              border: "1px solid #ccc",
              backgroundColor: "white",
              width: "100%",
            }}
          >
            Command Deck
          </button>
          <button
            style={{
              padding: "15px",
              fontSize: "16px",
              cursor: "pointer",
              border: "1px solid #ccc",
              backgroundColor: "white",
              width: "100%",
            }}
          >
            Health Analysis
          </button>
          <button
            style={{
              padding: "15px",
              fontSize: "16px",
              cursor: "pointer",
              border: "1px solid #ccc",
              backgroundColor: "white",
              width: "100%",
            }}
          >
            Forecast
          </button>
          <button
            style={{
              padding: "15px",
              fontSize: "16px",
              cursor: "pointer",
              border: "1px solid #ccc",
              backgroundColor: "white",
              width: "100%",
            }}
          >
            Reports
          </button>
          <button
            style={{
              padding: "15px",
              fontSize: "16px",
              cursor: "pointer",
              border: "1px solid #ccc",
              backgroundColor: "white",
              width: "100%",
            }}
          >
            Network
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          marginTop: "60px",
          padding: "40px 20px",
          color: "#e0e0e0",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            color: "#666",
            fontWeight: "bold",
            marginBottom: "40px",
            textAlign: "center",
            letterSpacing: "0.1em",
          }}
        >
          {getTaskTitle().toUpperCase()}
        </h1>

        {getTaskContent()}
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
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 998,
          }}
        />
      )}
    </div>
  )
}
