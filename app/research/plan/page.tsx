"use client"

import { useState, useEffect } from "react"

export default function ResearchPlanPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [unlockedSteps, setUnlockedSteps] = useState<string[]>(["overview", "questions"]) // Start with questions unlocked

  // Get selected options from URL params or session storage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const options = params.get("options")

    if (options) {
      setSelectedOptions(options.split(","))
    } else {
      // Fallback to session storage if no URL params
      const storedOptions = sessionStorage.getItem("researchPlanOptions")
      if (storedOptions) {
        setSelectedOptions(storedOptions.split(","))
      }
    }

    // Load unlocked steps from session storage
    const storedUnlocked = sessionStorage.getItem("researchUnlockedSteps")
    if (storedUnlocked) {
      setUnlockedSteps(storedUnlocked.split(","))
    }
  }, [])

  // Always include Overview and Interview Questions as mandatory
  const allSteps = [
    "overview",
    "questions",
    ...selectedOptions.filter((opt) => opt !== "questions" && opt !== "overview"),
  ]

  const stepLabels: { [key: string]: string } = {
    overview: "Overview",
    questions: "Interview Questions",
    preparation: "Interview Preparation",
    outreach: "Outreach",
    interviews: "Interviews",
    evaluation: "Evaluation",
  }

  const getCheckpointPosition = (index: number, total: number, stepId: string) => {
    // Position Overview on the left as the starting point
    if (stepId === "overview") {
      return { x: 15, y: 40 }
    }
    // Position Interview Questions as the second step
    if (stepId === "questions") {
      return { x: 35, y: 60 }
    }

    // Arrange other checkpoints in a flowing network pattern
    const positions = [
      { x: 55, y: 30 }, // Interview Preparation
      { x: 70, y: 65 }, // Outreach
      { x: 85, y: 45 }, // Interviews
      { x: 90, y: 25 }, // Evaluation
    ]

    return positions[index - 2] || { x: 50, y: 50 }
  }

  const handleCheckpointClick = (stepId: string) => {
    if (unlockedSteps.includes(stepId)) {
      // Navigate to detail page with the specific step
      window.location.href = `/research/detail?step=${stepId}&options=${selectedOptions.join(",")}`
    }
  }

  const isStepUnlocked = (stepId: string) => {
    return stepId === "overview" || stepId === "questions" || unlockedSteps.includes(stepId)
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
      </div>

      {/* Title Section - Top Right */}
      <div
        style={{
          position: "fixed",
          top: "90px",
          right: "40px",
          textAlign: "right",
          zIndex: 100,
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            margin: "0 0 8px 0",
            color: "#fff",
            fontWeight: "bold",
            letterSpacing: "0.1em",
          }}
        >
          RESEARCH LEVEL 1
        </h1>
        <h2
          style={{
            fontSize: "1.1rem",
            fontWeight: "300",
            margin: "0",
            color: "#ccc",
            letterSpacing: "0.05em",
          }}
        >
          Problem Validation
        </h2>
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

        {/* Six vertically stacked buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { label: "Map", onClick: () => (window.location.href = "/main") },
            { label: "Command Deck", onClick: () => {} },
            { label: "Health Check", onClick: () => {} },
            { label: "Forecast", onClick: () => {} },
            { label: "Reports", onClick: () => {} },
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
                backgroundColor: "#1a1a1a",
                color: "#e0e0e0",
                width: "100%",
                clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                letterSpacing: "0.05em",
                fontWeight: "500",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#3a3a3a"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#1a1a1a"
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - Network Map */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "90px 20px 20px 20px",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "800px",
            height: "600px",
            backgroundColor: "#2a2a2a",
            border: "1px solid #444",
            clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
            {/* Draw connecting lines */}
            {allSteps.map((step, index) => {
              if (index === allSteps.length - 1) return null

              const currentPos = getCheckpointPosition(index, allSteps.length, allSteps[index])
              const nextPos = getCheckpointPosition(index + 1, allSteps.length, allSteps[index + 1])

              return (
                <line
                  key={`line-${index}`}
                  x1={`${currentPos.x}%`}
                  y1={`${currentPos.y}%`}
                  x2={`${nextPos.x}%`}
                  y2={`${nextPos.y}%`}
                  stroke="#007bff"
                  strokeWidth="3"
                  opacity={isStepUnlocked(allSteps[index + 1]) ? 1 : 0.3}
                />
              )
            })}
          </svg>

          {/* Draw checkpoints */}
          {allSteps.map((step, index) => {
            const position = getCheckpointPosition(index, allSteps.length, step)
            const isMandatory = step === "overview" || step === "questions"
            const isUnlocked = isStepUnlocked(step)

            return (
              <div
                key={step}
                style={{
                  position: "absolute",
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {/* Checkpoint Circle */}
                <div
                  onClick={() => handleCheckpointClick(step)}
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: isUnlocked ? (isMandatory ? "#20c997" : "#007bff") : "#444",
                    border: "2px solid #666",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: "5px",
                    cursor: isUnlocked ? "pointer" : "not-allowed",
                    opacity: isUnlocked ? 1 : 0.5,
                    transition: "all 0.3s ease",
                    clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                  }}
                  onMouseEnter={(e) => {
                    if (isUnlocked) {
                      e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.1)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isUnlocked) {
                      e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)"
                    }
                  }}
                >
                  {isUnlocked ? "✓" : "🔒"}
                </div>

                {/* Checkpoint Label */}
                <div
                  style={{
                    backgroundColor: "#2a2a2a",
                    padding: "10px 15px",
                    border: "1px solid #444",
                    fontSize: "14px",
                    fontWeight: "500",
                    textAlign: "center",
                    maxWidth: "140px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    opacity: isUnlocked ? 1 : 0.5,
                    color: "#e0e0e0",
                    letterSpacing: "0.05em",
                    clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                  }}
                >
                  {stepLabels[step]}
                  {isMandatory && (
                    <div style={{ fontSize: "10px", color: "#dc3545", marginTop: "4px", fontWeight: "400" }}>
                      (Required)
                    </div>
                  )}
                </div>
              </div>
            )
          })}
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
