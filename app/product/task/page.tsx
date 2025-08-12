"use client"

import { useState, useEffect } from "react"

export default function ProductTaskPage() {
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
    if (currentSection === "overview" && currentTask === "product-strategy") {
      return "Product Strategy & Vision"
    }
    if (currentSection === "action-table" && currentTask === "priority-tasks") {
      return "Priority Tasks"
    }
    if (currentSection === "action-table" && currentTask === "development-plan") {
      return "Development Plan"
    }
    return "Task Details"
  }

  const getTaskContent = () => {
    if (currentSection === "overview" && currentTask === "product-strategy") {
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
            <h3 style={{ fontSize: "24px", marginBottom: "20px", color: "#fff" }}>Define Your Product Vision</h3>
            <p style={{ marginBottom: "20px", lineHeight: "1.6" }}>
              Establish a clear product vision and strategy that will guide your development decisions and align your
              team around common objectives.
            </p>

            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
                What problem does your product solve?
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
                placeholder="Describe the core problem your product addresses..."
              />
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
                What is your product vision?
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
                placeholder="Describe your long-term product vision..."
              />
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
                What are your key success metrics?
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
                placeholder="Define how you'll measure product success..."
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
              Save Product Strategy
            </button>
          </div>
        </div>
      )
    }

    if (currentSection === "action-table" && currentTask === "priority-tasks") {
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
            <h3 style={{ fontSize: "24px", marginBottom: "20px", color: "#fff" }}>Priority Task Management</h3>
            <p style={{ marginBottom: "30px", lineHeight: "1.6" }}>
              Identify and prioritize the most critical tasks for your product development. Focus on high-impact
              activities that drive meaningful results.
            </p>

            <div style={{ marginBottom: "30px" }}>
              <h4 style={{ fontSize: "18px", marginBottom: "15px", color: "#ccc" }}>High Priority Tasks</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  "Define core product features",
                  "Conduct user research and validation",
                  "Create technical architecture plan",
                  "Set up development environment",
                  "Establish testing framework",
                ].map((item, index) => (
                  <label key={index} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input type="checkbox" style={{ marginRight: "10px" }} />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "30px" }}>
              <h4 style={{ fontSize: "18px", marginBottom: "15px", color: "#ccc" }}>Add Custom Tasks</h4>
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
                placeholder="Add your own priority tasks..."
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
              Save Priority Tasks
            </button>
          </div>
        </div>
      )
    }

    if (currentSection === "action-table" && currentTask === "development-plan") {
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
            <h3 style={{ fontSize: "24px", marginBottom: "20px", color: "#fff" }}>Development Planning</h3>
            <p style={{ marginBottom: "30px", lineHeight: "1.6" }}>
              Create a comprehensive development plan with clear timelines, milestones, and resource allocation to guide
              your product development process.
            </p>

            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
                Development Timeline (weeks)
              </label>
              <input
                type="number"
                style={{
                  width: "200px",
                  padding: "10px",
                  backgroundColor: "#1a1a1a",
                  color: "#e0e0e0",
                  border: "1px solid #444",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
                placeholder="12"
              />
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>Key Milestones</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {[
                  { milestone: "MVP Definition", weeks: "Week 2" },
                  { milestone: "Core Features Complete", weeks: "Week 6" },
                  { milestone: "Beta Testing", weeks: "Week 10" },
                  { milestone: "Product Launch", weeks: "Week 12" },
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      padding: "10px",
                      backgroundColor: "#1a1a1a",
                      borderRadius: "4px",
                    }}
                  >
                    <input type="checkbox" />
                    <span style={{ flex: 1 }}>{item.milestone}</span>
                    <span style={{ color: "#888", fontSize: "12px" }}>{item.weeks}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
                Resource Requirements
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
                placeholder="Define team size, skills needed, budget, tools, etc..."
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
              Save Development Plan
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
            window.location.href = `/product/detail?step=${currentSection}&options=${optionsParam}`
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
