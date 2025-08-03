"use client"

import { useState } from "react"
import { ChevronDown, FileText } from "lucide-react"

export default function ReportsPage() {
  const [currentView, setCurrentView] = useState<"history" | "form" | "generated">("history")
  const [formData, setFormData] = useState({
    title: "",
    period: "",
    audience: "",
    sections: {
      startupDescription: true,
      progressOverview: true,
      tractionMilestones: true,
      risksBottlenecks: true,
      productStrategy: true,
      forecastPriorities: true,
    },
    notes: "",
  })

  const handleSectionToggle = (section: keyof typeof formData.sections) => {
    setFormData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: !prev.sections[section],
      },
    }))
  }

  const generateReport = () => {
    setCurrentView("generated")
  }

  const backToForm = () => {
    setCurrentView("form")
  }

  const showReportHistory = () => {
    setCurrentView("history")
  }

  const createFirstReport = () => {
    setCurrentView("form")
  }

  // Toggle Switch Component
  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      style={{
        width: "60px",
        height: "30px",
        backgroundColor: checked ? "#007bff" : "#444",
        border: "1px solid #555",
        borderRadius: "15px",
        position: "relative",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          width: "24px",
          height: "24px",
          backgroundColor: "#fff",
          borderRadius: "50%",
          position: "absolute",
          top: "2px",
          left: checked ? "32px" : "2px",
          transition: "all 0.3s ease",
        }}
      />
    </button>
  )

  // Hamburger Menu with Step Back Button
  const HamburgerMenu = () => (
    <div style={{ position: "fixed", top: "20px", left: "20px", display: "flex", gap: "10px", zIndex: 1000 }}>
      <button
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

      <button
        onClick={() => (window.location.href = "/main")}
        style={{
          background: "#2a2a2a",
          border: "1px solid #444",
          fontSize: "20px",
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
        title="Back to Main"
      >
        ←
      </button>
    </div>
  )

  if (currentView === "history") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#1a1a1a", color: "#e0e0e0" }}>
        <HamburgerMenu />

        <div style={{ padding: "80px 40px 40px", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "300",
              marginBottom: "60px",
              letterSpacing: "0.05em",
            }}
          >
            Report History
          </h1>

          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
              padding: "80px 40px",
              textAlign: "center",
            }}
          >
            <FileText size={80} style={{ color: "#666", marginBottom: "30px" }} />

            <h2
              style={{
                fontSize: "32px",
                fontWeight: "400",
                marginBottom: "20px",
                color: "#e0e0e0",
              }}
            >
              No Reports Generated Yet
            </h2>

            <p
              style={{
                fontSize: "18px",
                color: "#999",
                marginBottom: "40px",
                lineHeight: "1.6",
              }}
            >
              Once you generate your first stakeholder report, it will appear
              <br />
              here for easy access and reference.
            </p>

            <button
              onClick={createFirstReport}
              style={{
                padding: "16px 32px",
                fontSize: "16px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "1px solid #0056b3",
                cursor: "pointer",
                clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                fontWeight: "500",
                letterSpacing: "0.05em",
                transition: "all 0.3s ease",
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
              Create Your First Report
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentView === "form") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#1a1a1a", color: "#e0e0e0" }}>
        <HamburgerMenu />

        <div style={{ padding: "80px 40px 40px" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "300",
                marginBottom: "20px",
                letterSpacing: "0.05em",
              }}
            >
              Stakeholder Reports
            </h1>
            <p style={{ fontSize: "18px", color: "#999" }}>
              Generate comprehensive reports for your investors, mentors, and stakeholders
            </p>
          </div>

          <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "40px" }}>
            {/* Report Overview Section */}
            <div
              style={{
                backgroundColor: "#2a2a2a",
                border: "1px solid #444",
                clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                padding: "40px",
              }}
            >
              <h2 style={{ fontSize: "24px", fontWeight: "500", marginBottom: "30px" }}>Report Overview</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "16px", marginBottom: "10px", color: "#e0e0e0" }}>
                    Report Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter report title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "16px",
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #444",
                      color: "#e0e0e0",
                      fontSize: "16px",
                      clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "16px", marginBottom: "10px", color: "#e0e0e0" }}>
                    Reporting Period
                  </label>
                  <input
                    type="date"
                    placeholder="Select date"
                    value={formData.period}
                    onChange={(e) => setFormData((prev) => ({ ...prev, period: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "16px",
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #444",
                      color: "#e0e0e0",
                      fontSize: "16px",
                      clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                      outline: "none",
                      colorScheme: "dark", // This makes the calendar picker dark themed
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "16px", marginBottom: "10px", color: "#e0e0e0" }}>
                    Audience
                  </label>
                  <div style={{ position: "relative" }}>
                    <select
                      value={formData.audience}
                      onChange={(e) => setFormData((prev) => ({ ...prev, audience: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "16px",
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #444",
                        color: "#e0e0e0",
                        fontSize: "16px",
                        clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                        outline: "none",
                        appearance: "none",
                      }}
                    >
                      <option value="">Select audience</option>
                      <option value="investors">Investors</option>
                      <option value="board">Board Members</option>
                      <option value="stakeholders">All Stakeholders</option>
                    </select>
                    <ChevronDown
                      size={20}
                      style={{
                        position: "absolute",
                        right: "16px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#999",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Selection Section */}
            <div
              style={{
                backgroundColor: "#2a2a2a",
                border: "1px solid #444",
                clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                padding: "40px",
              }}
            >
              <h2 style={{ fontSize: "24px", fontWeight: "500", marginBottom: "30px" }}>Content Selection</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {[
                  { key: "startupDescription", label: "Startup Description" },
                  { key: "progressOverview", label: "Progress Overview" },
                  { key: "tractionMilestones", label: "Traction & Milestones" },
                  { key: "risksBottlenecks", label: "Risks & Bottlenecks" },
                  { key: "productStrategy", label: "Product & Strategy Snapshot" },
                  { key: "forecastPriorities", label: "Forecast & Priorities" },
                ].map(({ key, label }) => (
                  <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "16px", color: "#e0e0e0" }}>{label}</span>
                    <ToggleSwitch
                      checked={formData.sections[key as keyof typeof formData.sections]}
                      onChange={() => handleSectionToggle(key as keyof typeof formData.sections)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Optional Notes Section */}
            <div
              style={{
                backgroundColor: "#2a2a2a",
                border: "1px solid #444",
                clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                padding: "40px",
              }}
            >
              <h2 style={{ fontSize: "24px", fontWeight: "500", marginBottom: "30px" }}>Optional Notes</h2>

              <div>
                <label style={{ display: "block", fontSize: "16px", marginBottom: "10px", color: "#e0e0e0" }}>
                  Additional Comments or Context (optional)
                </label>
                <textarea
                  placeholder="Add any additional context or specific instructions for the report..."
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={6}
                  style={{
                    width: "100%",
                    padding: "16px",
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #444",
                    color: "#e0e0e0",
                    fontSize: "16px",
                    clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                backgroundColor: "#2a2a2a",
                border: "1px solid #444",
                clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                padding: "40px",
                display: "flex",
                gap: "20px",
                justifyContent: "center",
              }}
            >
              <button
                onClick={generateReport}
                style={{
                  padding: "16px 32px",
                  fontSize: "16px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "1px solid #0056b3",
                  cursor: "pointer",
                  clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                  fontWeight: "500",
                  letterSpacing: "0.05em",
                  transition: "all 0.3s ease",
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
                Generate Report
              </button>

              <button
                onClick={showReportHistory}
                style={{
                  padding: "16px 32px",
                  fontSize: "16px",
                  backgroundColor: "#444",
                  color: "#e0e0e0",
                  border: "1px solid #555",
                  cursor: "pointer",
                  clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                  fontWeight: "500",
                  letterSpacing: "0.05em",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#555"
                  e.currentTarget.style.transform = "translateY(-2px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#444"
                  e.currentTarget.style.transform = "translateY(0px)"
                }}
              >
                Report History
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentView === "generated") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#1a1a1a", color: "#e0e0e0" }}>
        <HamburgerMenu />

        <div style={{ padding: "80px 40px 40px" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "300",
                marginBottom: "20px",
                letterSpacing: "0.05em",
              }}
            >
              Generated Report
            </h1>
          </div>

          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            {/* Report Content */}
            <div
              style={{
                backgroundColor: "#2a2a2a",
                border: "1px solid #444",
                clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                padding: "50px",
                marginBottom: "40px",
              }}
            >
              <h2 style={{ fontSize: "32px", fontWeight: "500", marginBottom: "30px" }}>Executive Summary</h2>

              <p
                style={{
                  fontSize: "16px",
                  lineHeight: "1.6",
                  color: "#e0e0e0",
                  marginBottom: "40px",
                }}
              >
                This quarterly report provides a comprehensive overview of our progress across all major initiatives. We
                have successfully delivered 87% of our planned objectives while maintaining high quality standards and
                team satisfaction.
              </p>

              <h3 style={{ fontSize: "24px", fontWeight: "500", marginBottom: "20px" }}>Key Achievements</h3>

              <ul
                style={{
                  fontSize: "16px",
                  lineHeight: "1.8",
                  color: "#e0e0e0",
                  marginBottom: "40px",
                  paddingLeft: "20px",
                }}
              >
                <li>Completed major platform upgrade affecting 50,000+ users</li>
                <li>Reduced system downtime by 65% through infrastructure improvements</li>
                <li>Onboarded 3 new team members with full integration success</li>
                <li>Achieved 94% customer satisfaction score in latest survey</li>
              </ul>

              <h3 style={{ fontSize: "24px", fontWeight: "500", marginBottom: "20px" }}>Current Challenges</h3>

              <p
                style={{
                  fontSize: "16px",
                  lineHeight: "1.6",
                  color: "#e0e0e0",
                  marginBottom: "40px",
                }}
              >
                While progress has been strong, we face ongoing challenges in scaling our operations and maintaining
                quality as we grow. Resource allocation and team coordination remain key focus areas.
              </p>

              <h3 style={{ fontSize: "24px", fontWeight: "500", marginBottom: "20px" }}>Next Quarter Outlook</h3>

              <p
                style={{
                  fontSize: "16px",
                  lineHeight: "1.6",
                  color: "#e0e0e0",
                }}
              >
                Looking ahead, we're prioritizing system optimization, team expansion, and strategic partnerships. Our
                AI- powered recommendations suggest focusing on automation and process refinement.
              </p>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                backgroundColor: "#2a2a2a",
                border: "1px solid #444",
                clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                padding: "40px",
                display: "flex",
                gap: "20px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "Save Report", action: () => {} },
                { label: "Send Report", action: () => {} },
                { label: "Download PDF", action: () => {} },
                { label: "Back to Form", action: backToForm },
              ].map((button, index) => (
                <button
                  key={index}
                  onClick={button.action}
                  style={{
                    padding: "16px 24px",
                    fontSize: "16px",
                    backgroundColor: button.label === "Back to Form" ? "#444" : "#007bff",
                    color: "#fff",
                    border: `1px solid ${button.label === "Back to Form" ? "#555" : "#0056b3"}`,
                    cursor: "pointer",
                    clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                    fontWeight: "500",
                    letterSpacing: "0.05em",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = button.label === "Back to Form" ? "#555" : "#0056b3"
                    e.currentTarget.style.transform = "translateY(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = button.label === "Back to Form" ? "#444" : "#007bff"
                    e.currentTarget.style.transform = "translateY(0px)"
                  }}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
