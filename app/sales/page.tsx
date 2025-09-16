"use client"

import { useState } from "react"

export default function SalesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [expandedInfo, setExpandedInfo] = useState<string | null>(null)

  const options = [
    {
      id: "value-proposition",
      label: "Value Proposition Canvas (Required)",
      info: "A structured tool to map your user's jobs, pains, and gains - and how your solution fits them.",
    },
    {
      id: "benefit-list",
      label: "Benefit List",
      info: "A simple list of concrete gains your user gets - save time, reduce risk, earn more, etc.",
    },
    {
      id: "60-second-pitch",
      label: "60-Second Pitch",
      info: "A short, spoken-style version of your idea - what it is, who it's for, and why it matters.",
    },
    {
      id: "1-sentence-description",
      label: "1-Sentence Startup Description",
      info: "A sharp, written version of your startup's core idea (great for intros, emails, and decks).",
    },
  ]

  const toggleOption = (optionId: string) => {
    setSelectedOptions((prev) => (prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]))
  }

  const toggleInfo = (optionId: string) => {
    setExpandedInfo((prev) => (prev === optionId ? null : optionId))
  }

  const handleGeneratePlan = () => {
    // Store the plan generation in session storage
    sessionStorage.setItem("salesPlanGenerated", "true")
    sessionStorage.setItem("salesPlanOptions", selectedOptions.join(","))

    const optionsParam = selectedOptions.join(",")
    window.location.href = `/sales/plan?options=${optionsParam}`
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
          height: "70px",
          backgroundColor: "#2a2a2a",
          borderBottom: "1px solid #444",
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
            background: "#1a1a1a",
            border: "1px solid #444",
            fontSize: "24px",
            cursor: "pointer",
            marginRight: "15px",
            color: "#e0e0e0",
            width: "50px",
            height: "50px",
            clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
          }}
        >
          ☰
        </button>

        {/* Back Arrow */}
        <button
          onClick={() => (window.location.href = "/main")}
          style={{
            background: "#1a1a1a",
            border: "1px solid #444",
            fontSize: "24px",
            cursor: "pointer",
            color: "#e0e0e0",
            width: "50px",
            height: "50px",
            clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
          }}
        >
          ←
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

        {/* Seven vertically stacked buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { label: "Map", onClick: () => (window.location.href = "/main"), active: false },
            { label: "Command Deck", onClick: () => (window.location.href = "/homebase"), active: false },
            { label: "Health Check", onClick: () => (window.location.href = "/health-check"), active: false },
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "90px 20px 20px 20px",
          color: "#e0e0e0",
        }}
      >
        <div style={{ maxWidth: "700px", width: "100%" }}>
          {/* Form Title */}
          <h1
            style={{
              fontSize: "3rem",
              margin: "0 0 15px 0",
              textAlign: "center",
              color: "#fff",
              fontWeight: "bold",
              letterSpacing: "0.1em",
            }}
          >
            SALES LEVEL 1
          </h1>

          {/* Form Subtitle */}
          <h2
            style={{
              fontSize: "1.4rem",
              fontWeight: "300",
              margin: "0 0 50px 0",
              textAlign: "center",
              color: "#ccc",
              letterSpacing: "0.05em",
            }}
          >
            Idea Description
          </h2>

          {/* Description Paragraph */}
          <p
            style={{
              fontSize: "1rem",
              fontWeight: "300",
              margin: "0 0 50px 0",
              textAlign: "center",
              color: "#ccc",
              lineHeight: "1.6",
              letterSpacing: "0.02em",
            }}
          >
            To sell your idea, you need to explain it simply. This level helps you get clear on what your startup does,
            why it matters, and how it helps - so people instantly get it. You'll write a short pitch, describe your
            value in one sentence, and explore what real benefits you offer.
          </p>

          {/* Options */}
          <div style={{ marginBottom: "50px" }}>
            {options.map((option) => (
              <div key={option.id} style={{ marginBottom: "20px" }}>
                {/* Option Button */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "20px",
                    backgroundColor: "#2a2a2a",
                    border: "1px solid #444",
                    clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                    gap: "20px",
                    transition: "all 0.3s ease",
                  }}
                >
                  {/* Eye Icon */}
                  <button
                    onClick={() => toggleInfo(option.id)}
                    style={{
                      background: "#1a1a1a",
                      border: "1px solid #444",
                      fontSize: "18px",
                      cursor: "pointer",
                      color: "#e0e0e0",
                      width: "45px",
                      height: "45px",
                      clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                    }}
                  >
                    👁️
                  </button>

                  {/* Option Label */}
                  <span
                    style={{
                      flex: 1,
                      fontSize: "18px",
                      fontWeight: "500",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {option.label}
                  </span>

                  {/* Plus/Check Icon */}
                  <button
                    onClick={() => toggleOption(option.id)}
                    style={{
                      background: selectedOptions.includes(option.id) ? "#007bff" : "#1a1a1a",
                      border: "1px solid #444",
                      fontSize: "18px",
                      cursor: "pointer",
                      color: "#e0e0e0",
                      width: "45px",
                      height: "45px",
                      clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                    }}
                  >
                    {selectedOptions.includes(option.id) ? "✓" : "+"}
                  </button>
                </div>

                {/* Info Dropdown */}
                {expandedInfo === option.id && (
                  <div
                    style={{
                      padding: "20px",
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #444",
                      borderTop: "none",
                      fontSize: "15px",
                      color: "#ccc",
                      lineHeight: "1.6",
                    }}
                  >
                    {option.info}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Generate Plan Button */}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={handleGeneratePlan}
              style={{
                padding: "20px 50px",
                fontSize: "18px",
                cursor: "pointer",
                border: "1px solid #007bff",
                backgroundColor: "#007bff",
                color: "white",
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
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
              GENERATE PLAN
            </button>
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
    </div>
  )
}
