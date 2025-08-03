"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"

export default function ForecastPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [whatIfInput, setWhatIfInput] = useState("")

  const forecastCards = [
    {
      title: "Product Progress",
      status: "High Confidence",
      statusColor: "#22c55e",
      description: "MVP milestone expected in 19 days, 86% confidence",
      subtitle: "On track with current velocity",
    },
    {
      title: "Team Execution",
      status: "Stable",
      statusColor: "#3b82f6",
      description: "Sprint completion rate holding at 78%",
      subtitle: "Consistent delivery pace maintained",
    },
    {
      title: "Burn Rate",
      status: "High Risk",
      statusColor: "#ef4444",
      description: "Current runway extends 127 days at present spend",
      subtitle: "Consider fundraising or cost optimization",
    },
    {
      title: "User Insight",
      status: "Positive",
      statusColor: "#22c55e",
      description: "Feature adoption trending 23% above projection",
      subtitle: "Strong product-market fit signals",
    },
  ]

  const projectionData = [
    {
      domain: "Product",
      subdomain: "Beta Release",
      originalProjection: "August 15, 2025",
      actualOutcome: "August 18, 2025",
      variance: "+3 days",
      varianceDate: "2025-08-18",
    },
    {
      domain: "Team",
      subdomain: "Developer Hiring",
      originalProjection: "2 hires by Q3",
      actualOutcome: "3 hires completed",
      variance: "+1 hire",
      varianceDate: "2025-08-20",
    },
    {
      domain: "Finance",
      subdomain: "Monthly Burn",
      originalProjection: "$45K/month",
      actualOutcome: "$52K/month",
      variance: "+$7K/month",
      varianceDate: "2025-08-31",
    },
  ]

  const opportunityFeed = [
    {
      type: "Opportunity",
      title: "Apply to TechCrunch Disrupt in 2 weeks — ideal readiness window",
      action: "Prepare pitch deck and demo",
      dueDate: "Due September 15",
      priority: "opportunity",
    },
    {
      type: "Warning",
      title: "Burn rate projects runway end in 46 days — consider fundraising",
      action: "Initiate Series A conversations",
      dueDate: "Critical by October 20",
      priority: "warning",
    },
    {
      type: "Warning",
      title: "Clarity of vision has dropped 13% — re-align team",
      action: "Schedule all-hands strategy session",
      dueDate: "Trending negative",
      priority: "warning",
    },
  ]

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#1a1a1a", color: "#e0e0e0" }}>
      {/* Header with Menu and Back Button */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          display: "flex",
          gap: "10px",
          zIndex: 1000,
        }}
      >
        {/* Hamburger Menu */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: "#2a2a2a",
            border: "1px solid #444",
            fontSize: "24px",
            cursor: "pointer",
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

        {/* Back Button */}
        <button
          onClick={() => (window.location.href = "/main")}
          style={{
            background: "#2a2a2a",
            border: "1px solid #444",
            cursor: "pointer",
            color: "#e0e0e0",
            width: "50px",
            height: "50px",
            clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#3a3a3a"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#2a2a2a"
          }}
        >
          <ArrowLeft size={20} />
        </button>
      </div>

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

        {/* Navigation buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { label: "Map", onClick: () => (window.location.href = "/main") },
            { label: "Command Deck", onClick: () => {} },
            { label: "Health Check", onClick: () => (window.location.href = "/health-check") },
            { label: "Forecast", onClick: () => (window.location.href = "/forecast"), active: true },
            { label: "Reports", onClick: () => (window.location.href = "/reports") },
            { label: "Network", onClick: () => {} },
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

      {/* Main Content */}
      <div
        style={{
          paddingTop: "100px",
          paddingLeft: "40px",
          paddingRight: "40px",
          paddingBottom: "40px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "600",
              margin: "0 0 20px 0",
              color: "#e0e0e0",
            }}
          >
            Forecast
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "#999",
              margin: "0",
            }}
          >
            Review predictions. Explore outcomes. Adjust course.
          </p>
        </div>

        {/* Current Forecast Overview */}
        <div style={{ marginBottom: "80px" }}>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "600",
              marginBottom: "40px",
              color: "#e0e0e0",
            }}
          >
            Current Forecast Overview
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "30px",
            }}
          >
            {forecastCards.map((card, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#2a2a2a",
                  border: "1px solid #444",
                  padding: "30px",
                  clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "20px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      margin: "0",
                      color: "#e0e0e0",
                    }}
                  >
                    {card.title}
                  </h3>
                  <span
                    style={{
                      backgroundColor: card.statusColor,
                      color: "#fff",
                      padding: "6px 12px",
                      fontSize: "12px",
                      fontWeight: "500",
                      clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                    }}
                  >
                    {card.status}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "16px",
                    margin: "0 0 10px 0",
                    color: "#e0e0e0",
                    lineHeight: "1.5",
                  }}
                >
                  {card.description}
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    margin: "0",
                    color: "#999",
                  }}
                >
                  {card.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Actual vs Projection */}
        <div style={{ marginBottom: "80px" }}>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "600",
              marginBottom: "40px",
              color: "#e0e0e0",
            }}
          >
            Actual vs Projection
          </h2>

          <div
            style={{
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
              overflow: "hidden",
            }}
          >
            {/* Table Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
                gap: "20px",
                padding: "20px 30px",
                borderBottom: "1px solid #444",
                backgroundColor: "#333",
              }}
            >
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#999" }}>Domain</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#999" }}>Original Projection</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#999" }}>Actual Outcome</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#999" }}>Variance</div>
              <div style={{ width: "80px" }}></div>
            </div>

            {/* Table Rows */}
            {projectionData.map((row, index) => (
              <div
                key={index}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
                  gap: "20px",
                  padding: "25px 30px",
                  borderBottom: index < projectionData.length - 1 ? "1px solid #444" : "none",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "16px", fontWeight: "600", color: "#e0e0e0", marginBottom: "4px" }}>
                    {row.domain}
                  </div>
                  <div style={{ fontSize: "14px", color: "#999" }}>{row.subdomain}</div>
                </div>
                <div style={{ fontSize: "16px", color: "#e0e0e0" }}>{row.originalProjection}</div>
                <div style={{ fontSize: "16px", color: "#e0e0e0" }}>{row.actualOutcome}</div>
                <div>
                  <div style={{ fontSize: "16px", color: "#e0e0e0", marginBottom: "4px" }}>{row.variance}</div>
                  <div style={{ fontSize: "12px", color: "#666" }}>{row.varianceDate}</div>
                </div>
                <button
                  style={{
                    backgroundColor: "#444",
                    border: "1px solid #555",
                    color: "#e0e0e0",
                    padding: "8px 16px",
                    fontSize: "14px",
                    cursor: "pointer",
                    clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                    transition: "background 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#555"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#444"
                  }}
                >
                  Dismiss
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Simulate What-If Scenarios */}
        <div style={{ marginBottom: "80px" }}>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "600",
              marginBottom: "40px",
              color: "#e0e0e0",
            }}
          >
            Simulate What-If Scenarios
          </h2>

          <div
            style={{
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              padding: "40px",
              clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
            }}
          >
            <p
              style={{
                fontSize: "18px",
                marginBottom: "30px",
                color: "#e0e0e0",
              }}
            >
              Ask what-if questions about your startup:
            </p>

            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="e.g. What happens if we delay our MVP for 2 weeks?"
                value={whatIfInput}
                onChange={(e) => setWhatIfInput(e.target.value)}
                style={{
                  width: "100%",
                  padding: "20px 60px 20px 20px",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #444",
                  color: "#e0e0e0",
                  fontSize: "16px",
                  clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                  outline: "none",
                }}
              />
              <button
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "#666",
                  border: "1px solid #777",
                  color: "#e0e0e0",
                  width: "40px",
                  height: "40px",
                  cursor: "pointer",
                  clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                }}
              >
                ↑
              </button>
            </div>
          </div>
        </div>

        {/* Opportunity & Warning Feed */}
        <div style={{ marginBottom: "40px" }}>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "600",
              marginBottom: "40px",
              color: "#e0e0e0",
            }}
          >
            Opportunity & Warning Feed
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {opportunityFeed.map((item, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#2a2a2a",
                  border: "1px solid #444",
                  padding: "30px",
                  clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
                    <span
                      style={{
                        backgroundColor: item.priority === "opportunity" ? "#22c55e" : "#ef4444",
                        color: "#fff",
                        padding: "6px 12px",
                        fontSize: "12px",
                        fontWeight: "500",
                        clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                        marginRight: "15px",
                      }}
                    >
                      {item.type}
                    </span>
                    <span style={{ fontSize: "14px", color: "#999" }}>{item.dueDate}</span>
                  </div>

                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      margin: "0 0 10px 0",
                      color: "#e0e0e0",
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    style={{
                      fontSize: "14px",
                      margin: "0",
                      color: "#999",
                    }}
                  >
                    <strong>Recommended action:</strong> {item.action}
                  </p>
                </div>

                <button
                  style={{
                    backgroundColor: "#007bff",
                    border: "1px solid #0056b3",
                    color: "#fff",
                    padding: "12px 24px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                    transition: "background 0.3s ease",
                    marginLeft: "30px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#0056b3"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#007bff"
                  }}
                >
                  Implement
                </button>
              </div>
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
