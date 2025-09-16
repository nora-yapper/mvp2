"use client"

import type React from "react"

import { useState, useEffect } from "react"

export default function ProductDetailPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState<string>("action-table")
  const [unlockedSteps, setUnlockedSteps] = useState<string[]>(["action-table"])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const step = params.get("step") || "action-table"
    const options = params.get("options")

    setCurrentStep(step)

    if (options) {
      setSelectedOptions(options.split(","))
    }

    // Load unlocked steps from session storage
    const storedUnlocked = sessionStorage.getItem("productUnlockedSteps")
    if (storedUnlocked) {
      setUnlockedSteps(storedUnlocked.split(","))
    }

    // Scroll to the current step section
    setTimeout(() => {
      const element = document.getElementById(`section-${step}`)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }, [])

  // Always include Action Table as mandatory, plus Overview
  const allSections = ["action-table", ...selectedOptions.filter((opt) => opt !== "action-table")]

  const sectionLabels: { [key: string]: string } = {
    "action-table": "Action Table",
    features: "Features",
    wireframes: "Wireframes & User Flow",
    poc: "POC",
  }

  const isStepUnlocked = (stepId: string) => {
    return stepId === "action-table" || unlockedSteps.includes(stepId)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(`section-${sectionId}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleTaskClick = (sectionId: string, taskId: string) => {
    // Only allow clicks for Overview and Action Table
    if (sectionId === "overview" || sectionId === "action-table") {
      if (taskId === "development-plan") {
        const part01Completed = sessionStorage.getItem("productActionTablePart01Completed")
        if (!part01Completed) {
          alert("Please complete Action Table Part 01 first before accessing Part 02.")
          return
        }
      }

      const optionsParam = selectedOptions.join(",")
      // Navigate to the product task page with proper parameters
      window.location.href = `/product/task?section=${sectionId}&task=${taskId}&options=${optionsParam}`
    }
  }

  // Geometric card component with angled corners
  const GeometricCard = ({
    children,
    className = "",
    style = {},
    clickable = false,
    onClick,
  }: {
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
    clickable?: boolean
    onClick?: () => void
  }) => (
    <div
      className={className}
      onClick={onClick}
      style={{
        backgroundColor: "#2a2a2a",
        color: "#e0e0e0",
        padding: "30px",
        position: "relative",
        clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
        cursor: clickable ? "pointer" : "default",
        transition: clickable ? "all 0.3s ease" : "none",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (clickable) {
          e.currentTarget.style.backgroundColor = "#3a3a3a"
          e.currentTarget.style.transform = "translateY(-2px)"
        }
      }}
      onMouseLeave={(e) => {
        if (clickable) {
          e.currentTarget.style.backgroundColor = "#2a2a2a"
          e.currentTarget.style.transform = "translateY(0px)"
        }
      }}
    >
      {children}
      {clickable && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "15px",
            fontSize: "12px",
            color: "#888",
          }}
        >
          Click to expand →
        </div>
      )}
    </div>
  )

  // Overview Section Component
  const OverviewSection = () => (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        minHeight: "100vh",
        padding: "60px 40px",
        position: "relative",
      }}
    >
      <h1
        style={{
          fontSize: "4rem",
          color: "#666",
          fontWeight: "bold",
          marginBottom: "60px",
          textAlign: "left",
          letterSpacing: "0.1em",
        }}
      >
        OVERVIEW
      </h1>

      <div style={{ maxWidth: "800px" }}>
        <GeometricCard
          clickable={true}
          onClick={() => handleTaskClick("overview", "product-strategy")}
          style={{ fontSize: "18px", lineHeight: "1.6" }}
        >
          <h3 style={{ fontSize: "20px", marginBottom: "15px", color: "#fff" }}>Product Strategy & Vision</h3>
          <p style={{ marginBottom: "20px" }}>
            Define your product vision, strategy, and core objectives. Establish the foundation for your product
            development process and align your team around common goals.
          </p>
          <p>
            Create a comprehensive product roadmap that guides your development decisions and ensures you're building
            something users actually want and need.
          </p>
        </GeometricCard>
      </div>
    </div>
  )

  // Action Table Section Component
  const ActionTableSection = ({ isUnlocked }: { isUnlocked: boolean }) => {
    const [part01Completed, setPart01Completed] = useState(false)

    useEffect(() => {
      const completed = sessionStorage.getItem("productActionTablePart01Completed")
      setPart01Completed(!!completed)
    }, [])

    return (
      <div
        style={{
          backgroundColor: "#1a1a1a",
          minHeight: "100vh",
          padding: "60px 40px",
          position: "relative",
        }}
      >
        <h1
          style={{
            fontSize: "3.5rem",
            color: "#666",
            fontWeight: "bold",
            marginBottom: "60px",
            textAlign: "center",
            letterSpacing: "0.1em",
          }}
        >
          ACTION TABLE
        </h1>

        <div style={{ display: "flex", gap: "40px", maxWidth: "1000px", margin: "0 auto" }}>
          {/* Priority Tasks Card */}
          <div style={{ flex: "0 0 300px" }}>
            <GeometricCard clickable={isUnlocked} onClick={() => handleTaskClick("action-table", "priority-tasks")}>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "20px",
                  color: "#ccc",
                  textAlign: "center",
                }}
              >
                ACTION TABLE PART 01
              </h3>
              <p style={{ fontSize: "14px", lineHeight: "1.5" }}>
                Turn your interview insights into early product ideas, list possible directions and note potential
                issues.
              </p>
            </GeometricCard>
          </div>

          {/* Development Plan Card */}
          <div style={{ flex: 1, position: "relative" }}>
            <GeometricCard
              clickable={isUnlocked && part01Completed}
              onClick={() => handleTaskClick("action-table", "development-plan")}
              style={{
                opacity: part01Completed ? 1 : 0.5,
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "20px",
                  color: "#ccc",
                  textAlign: "center",
                }}
              >
                ACTION TABLE PART 02
              </h3>
              <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
                <p style={{ marginBottom: "15px" }}>
                  Now turn those early product ideas into actual features. Define their relevance and priority.
                </p>
              </div>
            </GeometricCard>

            {!part01Completed && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                  clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                }}
              >
                <div style={{ textAlign: "center", color: "white" }}>
                  <div style={{ fontSize: "48px", marginBottom: "10px" }}>🔒</div>
                  <div style={{ fontSize: "16px" }}>Complete Part 01 first</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Features Section Component (Non-clickable)
  const FeaturesSection = ({ isUnlocked }: { isUnlocked: boolean }) => (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        minHeight: "100vh",
        padding: "60px 40px",
        position: "relative",
      }}
    >
      <h1
        style={{
          fontSize: "4rem",
          color: "#666",
          fontWeight: "bold",
          marginBottom: "60px",
          textAlign: "left",
          letterSpacing: "0.1em",
        }}
      >
        FEATURES
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "30px", maxWidth: "900px" }}>
        <div style={{ alignSelf: "flex-end", width: "400px" }}>
          <GeometricCard style={{ minHeight: "150px" }}>
            <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#ccc" }}>
              Core feature definition and specification.
            </div>
          </GeometricCard>
        </div>

        <div style={{ alignSelf: "flex-start", width: "500px" }}>
          <GeometricCard style={{ minHeight: "200px" }}>
            <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#ccc" }}>
              Feature prioritization and user story mapping.
            </div>
          </GeometricCard>
        </div>
      </div>
    </div>
  )

  // Wireframes Section Component (Non-clickable)
  const WireframesSection = ({ isUnlocked }: { isUnlocked: boolean }) => (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        minHeight: "100vh",
        padding: "60px 40px",
        position: "relative",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          color: "#666",
          fontWeight: "bold",
          marginBottom: "60px",
          textAlign: "right",
          letterSpacing: "0.1em",
        }}
      >
        WIREFRAMES &<br />
        USER FLOW
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "30px", maxWidth: "1000px" }}>
        <div style={{ alignSelf: "flex-end", width: "350px" }}>
          <GeometricCard style={{ minHeight: "120px" }}>
            <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#ccc" }}>
              User interface wireframes and mockups.
            </div>
          </GeometricCard>
        </div>

        <div style={{ alignSelf: "flex-start", width: "450px" }}>
          <GeometricCard style={{ minHeight: "180px" }}>
            <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#ccc" }}>
              User flow mapping and interaction design.
            </div>
          </GeometricCard>
        </div>
      </div>
    </div>
  )

  // POC Section Component (Non-clickable)
  const POCSection = ({ isUnlocked }: { isUnlocked: boolean }) => (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        minHeight: "100vh",
        padding: "60px 40px",
        position: "relative",
      }}
    >
      <h1
        style={{
          fontSize: "4rem",
          color: "#666",
          fontWeight: "bold",
          marginBottom: "60px",
          textAlign: "center",
          letterSpacing: "0.1em",
        }}
      >
        POC
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "40px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ alignSelf: "flex-start", width: "400px" }}>
          <GeometricCard style={{ minHeight: "150px" }}>
            <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#ccc" }}>
              Proof of concept development and testing.
            </div>
          </GeometricCard>
        </div>

        <div style={{ alignSelf: "flex-end", width: "500px" }}>
          <GeometricCard style={{ minHeight: "200px" }}>
            <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#ccc" }}>
              Technical validation and feasibility assessment.
            </div>
          </GeometricCard>
        </div>
      </div>
    </div>
  )

  const renderSection = (section: string) => {
    const isUnlocked = isStepUnlocked(section)

    const sectionContent = () => {
      switch (section) {
        case "action-table":
          return <ActionTableSection isUnlocked={isUnlocked} />
        case "features":
          return <FeaturesSection isUnlocked={isUnlocked} />
        case "wireframes":
          return <WireframesSection isUnlocked={isUnlocked} />
        case "poc":
          return <POCSection isUnlocked={isUnlocked} />
        default:
          return <div>Section not found</div>
      }
    }

    return (
      <div
        key={section}
        id={`section-${section}`}
        style={{
          position: "relative",
          opacity: isUnlocked ? 1 : 0.4,
          pointerEvents: isUnlocked ? "auto" : "none",
        }}
      >
        {sectionContent()}

        {/* Lock Overlay for locked sections */}
        {!isUnlocked && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <div style={{ textAlign: "center", color: "white" }}>
              <div style={{ fontSize: "48px", marginBottom: "10px" }}>🔒</div>
              <div style={{ fontSize: "18px" }}>Complete previous steps to unlock</div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
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
          onClick={() => (window.location.href = "/product/plan")}
          style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          ←
        </button>

        {/* Section Navigation */}
        <div style={{ display: "flex", gap: "10px", marginLeft: "20px", flexWrap: "wrap" }}>
          {allSections.map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              disabled={!isStepUnlocked(section)}
              style={{
                padding: "5px 10px",
                fontSize: "12px",
                cursor: isStepUnlocked(section) ? "pointer" : "not-allowed",
                border: "1px solid #ccc",
                backgroundColor: isStepUnlocked(section) ? "white" : "#f5f5f5",
                opacity: isStepUnlocked(section) ? 1 : 0.5,
                borderRadius: "4px",
              }}
            >
              {sectionLabels[section]}
            </button>
          ))}
        </div>
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
            onClick={() => (window.location.href = "/command-deck")}
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
            Health Check
          </button>
          <button
            onClick={() => (window.location.href = "/health-check")}
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

      {/* Main Content - Scrollable Sections */}
      <div style={{ marginTop: "60px" }}>{allSections.map((section) => renderSection(section))}</div>

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
