"use client"

import { useState } from "react"
import { ArrowUp } from "lucide-react"

export default function ForecastPage() {
  const [whatIfQuestion, setWhatIfQuestion] = useState("")
  // Hamburger Menu with Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dismissedNotifications, setDismissedNotifications] = useState<string[]>([])

  const handleDismiss = (notificationId: string) => {
    setDismissedNotifications((prev) => [...prev, notificationId])
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
            { label: "Health Analysis", onClick: () => (window.location.href = "/health-check"), active: false },
            { label: "Forecast", onClick: () => {}, active: true },
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
      {/* Header */}
      <div style={{ padding: "40px 60px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "400", margin: "0 0 16px 0", color: "#e0e0e0" }}>Forecast</h1>
        <p style={{ fontSize: "18px", color: "#999", margin: "0 0 60px 0" }}>
          Review predictions. Explore outcomes. Adjust course.
        </p>
      </div>

      {/* Current Forecast Overview */}
      <div style={{ padding: "0 60px 60px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "500", margin: "0 0 30px 0", color: "#e0e0e0" }}>
          Current Forecast Overview
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          {/* Product Progress Card */}
          <div
            style={{
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: "500", margin: "0", color: "#e0e0e0" }}>Product Progress</h3>
              <span
                style={{
                  padding: "4px 12px",
                  backgroundColor: "#22c55e",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "500",
                  clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                }}
              >
                High Confidence
              </span>
            </div>
            <p style={{ fontSize: "16px", fontWeight: "500", margin: "0 0 8px 0", color: "#e0e0e0" }}>
              MVP milestone expected in 19 days, 86% confidence
            </p>
            <p style={{ fontSize: "14px", color: "#999", margin: "0" }}>On track with current velocity</p>
          </div>

          {/* Team Execution Card */}
          <div
            style={{
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: "500", margin: "0", color: "#e0e0e0" }}>Team Execution</h3>
              <span
                style={{
                  padding: "4px 12px",
                  backgroundColor: "#6b7280",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "500",
                  clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                }}
              >
                Stable
              </span>
            </div>
            <p style={{ fontSize: "16px", fontWeight: "500", margin: "0 0 8px 0", color: "#e0e0e0" }}>
              Sprint completion rate holding at 78%
            </p>
            <p style={{ fontSize: "14px", color: "#999", margin: "0" }}>Consistent delivery pace maintained</p>
          </div>

          {/* Burn Rate Card */}
          <div
            style={{
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: "500", margin: "0", color: "#e0e0e0" }}>Burn Rate</h3>
              <span
                style={{
                  padding: "4px 12px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "500",
                  clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                }}
              >
                High Risk
              </span>
            </div>
            <p style={{ fontSize: "16px", fontWeight: "500", margin: "0 0 8px 0", color: "#e0e0e0" }}>
              Current runway extends 127 days at present spend
            </p>
            <p style={{ fontSize: "14px", color: "#999", margin: "0" }}>Consider fundraising or cost optimization</p>
          </div>

          {/* User Insight Card */}
          <div
            style={{
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: "500", margin: "0", color: "#e0e0e0" }}>User Insight</h3>
              <span
                style={{
                  padding: "4px 12px",
                  backgroundColor: "#22c55e",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "500",
                  clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                }}
              >
                Positive
              </span>
            </div>
            <p style={{ fontSize: "16px", fontWeight: "500", margin: "0 0 8px 0", color: "#e0e0e0" }}>
              Feature adoption trending 23% above projection
            </p>
            <p style={{ fontSize: "14px", color: "#999", margin: "0" }}>Strong product-market fit signals</p>
          </div>
        </div>
      </div>

      {/* Actual vs Projection */}
      <div style={{ padding: "0 60px 60px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "500", margin: "0 0 30px 0", color: "#e0e0e0" }}>
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
              gridTemplateColumns: "200px 180px 180px 140px 1fr 100px",
              gap: "20px",
              padding: "20px 30px",
              borderBottom: "1px solid #444",
              fontSize: "14px",
              fontWeight: "500",
              color: "#999",
            }}
          >
            <div>Domain</div>
            <div>Original Projection</div>
            <div>Actual Outcome</div>
            <div>Variance</div>
            <div></div>
            <div></div>
          </div>

          {/* Product Row */}
          {!dismissedNotifications.includes("product") && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "200px 180px 180px 140px 1fr 100px",
                gap: "20px",
                padding: "25px 30px",
                borderBottom: "1px solid #333",
                fontSize: "14px",
              }}
            >
              <div>
                <div style={{ fontWeight: "500", color: "#e0e0e0", marginBottom: "4px" }}>Product</div>
                <div style={{ color: "#999", fontSize: "12px" }}>Beta Release</div>
              </div>
              <div style={{ color: "#e0e0e0" }}>August 15, 2025</div>
              <div style={{ color: "#e0e0e0" }}>August 18, 2025</div>
              <div>
                <div style={{ color: "#e0e0e0", fontWeight: "500" }}>+3 days</div>
                <div style={{ color: "#999", fontSize: "12px" }}>2025-08-18</div>
              </div>
              <div></div>
              <div>
                <button
                  onClick={() => handleDismiss("product")}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#2a2a2a",
                    border: "1px solid #444",
                    color: "#999",
                    fontSize: "12px",
                    cursor: "pointer",
                    clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                    transition: "all 0.3s ease",
                  }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Team Row */}
          {!dismissedNotifications.includes("team") && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "200px 180px 180px 140px 1fr 100px",
                gap: "20px",
                padding: "25px 30px",
                borderBottom: "1px solid #333",
                fontSize: "14px",
              }}
            >
              <div>
                <div style={{ fontWeight: "500", color: "#e0e0e0", marginBottom: "4px" }}>Team</div>
                <div style={{ color: "#999", fontSize: "12px" }}>Developer Hiring</div>
              </div>
              <div style={{ color: "#e0e0e0" }}>2 hires by Q3</div>
              <div style={{ color: "#e0e0e0" }}>3 hires completed</div>
              <div>
                <div style={{ color: "#22c55e", fontWeight: "500" }}>+1 hire</div>
                <div style={{ color: "#999", fontSize: "12px" }}>2025-08-20</div>
              </div>
              <div></div>
              <div>
                <button
                  onClick={() => handleDismiss("team")}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#2a2a2a",
                    border: "1px solid #444",
                    color: "#999",
                    fontSize: "12px",
                    cursor: "pointer",
                    clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                    transition: "all 0.3s ease",
                  }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Finance Row */}
          {!dismissedNotifications.includes("finance") && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "200px 180px 180px 140px 1fr 100px",
                gap: "20px",
                padding: "25px 30px",
                fontSize: "14px",
              }}
            >
              <div>
                <div style={{ fontWeight: "500", color: "#e0e0e0", marginBottom: "4px" }}>Finance</div>
                <div style={{ color: "#999", fontSize: "12px" }}>Monthly Burn</div>
              </div>
              <div style={{ color: "#e0e0e0" }}>$45K/month</div>
              <div style={{ color: "#e0e0e0" }}>$52K/month</div>
              <div>
                <div style={{ color: "#ef4444", fontWeight: "500" }}>+$7K/month</div>
                <div style={{ color: "#999", fontSize: "12px" }}>2025-08-31</div>
              </div>
              <div></div>
              <div>
                <button
                  onClick={() => handleDismiss("finance")}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#2a2a2a",
                    border: "1px solid #444",
                    color: "#999",
                    fontSize: "12px",
                    cursor: "pointer",
                    clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                    transition: "all 0.3s ease",
                  }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Show message when all notifications are dismissed */}
          {dismissedNotifications.length === 3 && (
            <div style={{ padding: "40px", textAlign: "center", color: "#999" }}>
              All notifications have been dismissed.
            </div>
          )}
        </div>
      </div>

      {/* Simulate What-If Scenarios */}
      <div style={{ padding: "0 60px 60px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "500", margin: "0 0 30px 0", color: "#e0e0e0" }}>
          Simulate What-If Scenarios
        </h2>

        <div
          style={{
            backgroundColor: "#2a2a2a",
            border: "1px solid #444",
            clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
            padding: "30px",
          }}
        >
          <p style={{ fontSize: "16px", color: "#e0e0e0", margin: "0 0 20px 0" }}>
            Ask what-if questions about your startup:
          </p>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="e.g. What happens if we delay our MVP for 2 weeks?"
              value={whatIfQuestion}
              onChange={(e) => setWhatIfQuestion(e.target.value)}
              style={{
                width: "100%",
                padding: "16px 60px 16px 20px",
                backgroundColor: "#1a1a1a",
                border: "1px solid #444",
                color: "#e0e0e0",
                fontSize: "16px",
                clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                outline: "none",
              }}
            />
            <button
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "#444",
                border: "1px solid #555",
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
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Opportunity & Warning Feed */}
      <div style={{ padding: "0 60px 60px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "500", margin: "0 0 30px 0", color: "#e0e0e0" }}>
          Opportunity & Warning Feed
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Opportunity Item */}
          <div
            style={{
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
              padding: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span
                  style={{
                    padding: "4px 12px",
                    backgroundColor: "#22c55e",
                    color: "white",
                    fontSize: "12px",
                    fontWeight: "500",
                    clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                  }}
                >
                  Opportunity
                </span>
                <span style={{ color: "#999", fontSize: "14px" }}>Due September 15</span>
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "500", margin: "0 0 8px 0", color: "#e0e0e0" }}>
                Apply to TechCrunch Disrupt in 2 weeks — ideal readiness window
              </h3>
              <p style={{ fontSize: "14px", color: "#999", margin: "0" }}>
                Recommended action: Prepare pitch deck and demo
              </p>
            </div>
            <button
              style={{
                padding: "12px 24px",
                backgroundColor: "#007bff",
                border: "1px solid #0056b3",
                color: "white",
                fontSize: "14px",
                cursor: "pointer",
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                fontWeight: "500",
                marginLeft: "20px",
              }}
            >
              Implement
            </button>
          </div>

          {/* Warning Item 1 */}
          <div
            style={{
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
              padding: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span
                  style={{
                    padding: "4px 12px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    fontSize: "12px",
                    fontWeight: "500",
                    clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                  }}
                >
                  Warning
                </span>
                <span style={{ color: "#999", fontSize: "14px" }}>Critical by October 20</span>
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "500", margin: "0 0 8px 0", color: "#e0e0e0" }}>
                Burn rate projects runway end in 46 days — consider fundraising
              </h3>
              <p style={{ fontSize: "14px", color: "#999", margin: "0" }}>
                Recommended action: Initiate Series A conversations
              </p>
            </div>
            <button
              style={{
                padding: "12px 24px",
                backgroundColor: "#007bff",
                border: "1px solid #0056b3",
                color: "white",
                fontSize: "14px",
                cursor: "pointer",
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                fontWeight: "500",
                marginLeft: "20px",
              }}
            >
              Implement
            </button>
          </div>

          {/* Warning Item 2 */}
          <div
            style={{
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
              padding: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span
                  style={{
                    padding: "4px 12px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    fontSize: "12px",
                    fontWeight: "500",
                    clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                  }}
                >
                  Warning
                </span>
                <span style={{ color: "#999", fontSize: "14px" }}>Trending negative</span>
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "500", margin: "0 0 8px 0", color: "#e0e0e0" }}>
                Clarity of vision has dropped 13% — re-align team
              </h3>
              <p style={{ fontSize: "14px", color: "#999", margin: "0" }}>
                Recommended action: Schedule all-hands strategy session
              </p>
            </div>
            <button
              style={{
                padding: "12px 24px",
                backgroundColor: "#007bff",
                border: "1px solid #0056b3",
                color: "white",
                fontSize: "14px",
                cursor: "pointer",
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                fontWeight: "500",
                marginLeft: "20px",
              }}
            >
              Implement
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
