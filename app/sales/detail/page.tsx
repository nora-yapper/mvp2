"use client"

import type React from "react"

import { useState, useEffect } from "react"

export default function SalesDetailPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState<string>("value-proposition")
  const [unlockedSteps, setUnlockedSteps] = useState<string[]>(["value-proposition"])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const step = params.get("step") || "value-proposition"
    const options = params.get("options")

    setCurrentStep(step)

    if (options) {
      setSelectedOptions(options.split(","))
    }

    // Load unlocked steps from session storage
    const storedUnlocked = sessionStorage.getItem("salesUnlockedSteps")
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

  // Always include Value Proposition Canvas as mandatory, plus Overview
  const allSections = ["overview", "value-proposition", ...selectedOptions.filter((opt) => opt !== "value-proposition")]

  const sectionLabels: { [key: string]: string } = {
    overview: "Overview",
    "value-proposition": "Value Proposition Canvas",
    "short-pitches": "Short Pitches",
  }

  const isStepUnlocked = (stepId: string) => {
    return stepId === "overview" || unlockedSteps.includes(stepId)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(`section-${sectionId}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleTaskClick = (sectionId: string, taskId: string) => {
    // Only allow clicks for Overview and Value Proposition Canvas
    if (sectionId === "overview" || sectionId === "value-proposition") {
      const optionsParam = selectedOptions.join(",")
      window.location.href = `/sales/task?section=${sectionId}&task=${taskId}&options=${optionsParam}`
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
          onClick={() => handleTaskClick("overview", "sales-strategy")}
          style={{ fontSize: "18px", lineHeight: "1.6" }}
        >
          <h3 style={{ fontSize: "20px", marginBottom: "15px", color: "#fff" }}>Sales Strategy & Approach</h3>
          <p style={{ marginBottom: "20px" }}>
            Develop a comprehensive sales strategy that aligns with your product vision and target market. Define your
            sales process, identify key customer segments, and establish clear value propositions.
          </p>
          <p>
            Create a systematic approach to sales that maximizes conversion rates and builds lasting customer
            relationships through effective communication and value delivery.
          </p>
        </GeometricCard>
      </div>
    </div>
  )

  // Value Proposition Canvas Section Component
  const ValuePropositionSection = ({ isUnlocked }: { isUnlocked: boolean }) => (
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
          fontSize: "2.8rem",
          color: "#666",
          fontWeight: "bold",
          marginBottom: "60px",
          textAlign: "center",
          letterSpacing: "0.1em",
        }}
      >
        VALUE PROPOSITION CANVAS
      </h1>

      <div style={{ display: "flex", gap: "40px", maxWidth: "1000px", margin: "0 auto" }}>
        {/* Customer Profile Card */}
        <div style={{ flex: "0 0 300px" }}>
          <GeometricCard
            clickable={isUnlocked}
            onClick={() => handleTaskClick("value-proposition", "customer-profile")}
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
              CUSTOMER PROFILE
            </h3>
            <p style={{ fontSize: "14px", lineHeight: "1.5" }}>
              Define your customer segments, their jobs-to-be-done, pain points, and desired gains. Understand what
              drives your customers' decisions.
            </p>
          </GeometricCard>
        </div>

        {/* Value Map Card */}
        <div style={{ flex: 1 }}>
          <GeometricCard clickable={isUnlocked} onClick={() => handleTaskClick("value-proposition", "value-map")}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "20px",
                color: "#ccc",
                textAlign: "center",
              }}
            >
              VALUE MAP
            </h3>
            <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
              <p style={{ marginBottom: "15px" }}>
                Map your products and services to customer needs. Define how you create value through pain relievers and
                gain creators.
              </p>
              <p>Establish clear connections between what you offer and what customers actually want and need.</p>
            </div>
          </GeometricCard>
        </div>
      </div>
    </div>
  )

  // Short Pitches Section Component (Non-clickable)
  const ShortPitchesSection = ({ isUnlocked }: { isUnlocked: boolean }) => (
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
        SHORT PITCHES
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "40px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ alignSelf: "flex-start", width: "400px" }}>
          <GeometricCard style={{ minHeight: "150px" }}>
            <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#ccc" }}>
              Elevator pitch and quick value propositions.
            </div>
          </GeometricCard>
        </div>

        <div style={{ alignSelf: "flex-end", width: "500px" }}>
          <GeometricCard style={{ minHeight: "200px" }}>
            <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#ccc" }}>
              Tailored pitches for different audiences and scenarios.
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
        case "overview":
          return <OverviewSection />
        case "value-proposition":
          return <ValuePropositionSection isUnlocked={isUnlocked} />
        case "short-pitches":
          return <ShortPitchesSection isUnlocked={isUnlocked} />
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
          onClick={() => (window.location.href = "/sales/plan")}
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
