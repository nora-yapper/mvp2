"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { earnTokensForStep } from "@/lib/token-integration"

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

  // Always include Value Proposition Canvas as mandatory, plus selected options
  const allSections = ["value-proposition", ...selectedOptions.filter((opt) => opt !== "value-proposition")]

  const sectionLabels: { [key: string]: string } = {
    "value-proposition": "Value Proposition Canvas",
    "benefit-list": "Benefit List",
    "60-second-pitch": "60-Second Pitch",
    "1-sentence-description": "1-Sentence Startup Description",
  }

  const isStepUnlocked = (stepId: string) => {
    return unlockedSteps.includes(stepId)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(`section-${sectionId}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleTaskClick = (sectionId: string, taskId: string) => {
    // Only allow clicks for Value Proposition Canvas
    if (sectionId === "value-proposition") {
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

  // Value Proposition Canvas Section Component
  const ValuePropositionSection = ({ isUnlocked }: { isUnlocked: boolean }) => {
    const [canvasData, setCanvasData] = useState({
      valueProposition: "",
      customerSegment: "",
      gainCreators: "",
      productsServices: "",
      painRelievers: "",
      gains: "",
      customerJobs: "",
      pains: "",
    })

    const [isExpanded, setIsExpanded] = useState(false)

    const handleInputChange = (field: string, value: string) => {
      setCanvasData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

    const handleSaveChanges = () => {
      // Save the changes to local storage or a database
      console.log("Saving changes:", canvasData)

      // Award tokens for completing value proposition canvas
      earnTokensForStep("SALES_VALUE_PROPOSITION")
    }

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

        {!isExpanded ? (
          <div style={{ display: "flex", justifyContent: "center", maxWidth: "1000px", margin: "0 auto" }}>
            {/* Value Map Card */}
            <div style={{ maxWidth: "600px" }}>
              <GeometricCard clickable={isUnlocked} onClick={() => isUnlocked && setIsExpanded(true)}>
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
                    A structured tool to map your user's jobs, pains, and gains - and how your solution fits them.
                  </p>
                </div>
              </GeometricCard>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {/* Back button */}
            <button
              onClick={() => setIsExpanded(false)}
              style={{
                marginBottom: "20px",
                padding: "10px 20px",
                backgroundColor: "#2a2a2a",
                border: "1px solid #444",
                color: "#ccc",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              ← Back to Overview
            </button>

            {/* Input fields at top */}
            <div style={{ display: "flex", gap: "20px", marginBottom: "40px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: "#ccc", fontSize: "14px", marginBottom: "8px", display: "block" }}>
                  Value Proposition:
                </label>
                <input
                  type="text"
                  value={canvasData.valueProposition}
                  onChange={(e) => handleInputChange("valueProposition", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#2a2a2a",
                    border: "1px solid #444",
                    borderRadius: "4px",
                    color: "#fff",
                    fontSize: "14px",
                  }}
                  placeholder="Enter your value proposition"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: "#ccc", fontSize: "14px", marginBottom: "8px", display: "block" }}>
                  Customer Segment:
                </label>
                <input
                  type="text"
                  value={canvasData.customerSegment}
                  onChange={(e) => handleInputChange("customerSegment", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#2a2a2a",
                    border: "1px solid #444",
                    borderRadius: "4px",
                    color: "#fff",
                    fontSize: "14px",
                  }}
                  placeholder="Enter your customer segment"
                />
              </div>
            </div>

            {/* Canvas Layout */}
            <div style={{ display: "flex", gap: "60px", alignItems: "center", justifyContent: "center" }}>
              {/* Left Square - Value Map */}
              <div
                style={{
                  width: "400px",
                  height: "400px",
                  border: "3px solid #444",
                  position: "relative",
                  backgroundColor: "#2a2a2a",
                }}
              >
                {/* Diagonal line */}
                <div
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg, transparent 49%, #444 49%, #444 51%, transparent 51%)",
                  }}
                />

                {/* Gain Creators - Top */}
                <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "160px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ color: "#ccc", fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>
                    Gain Creators
                  </div>
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>📈</div>
                  <textarea
                    value={canvasData.gainCreators}
                    onChange={(e) => handleInputChange("gainCreators", e.target.value)}
                    style={{
                      width: "100%",
                      height: "60px",
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #555",
                      borderRadius: "4px",
                      color: "#fff",
                      fontSize: "12px",
                      padding: "4px",
                      resize: "none",
                    }}
                    placeholder="How do you create gains?"
                  />
                </div>

                {/* Products & Services - Center Left */}
                <div
                  style={{
                    position: "absolute",
                    left: "20px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "140px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ color: "#ccc", fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>
                    Products & Services
                  </div>
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>🎁</div>
                  <textarea
                    value={canvasData.productsServices}
                    onChange={(e) => handleInputChange("productsServices", e.target.value)}
                    style={{
                      width: "100%",
                      height: "60px",
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #555",
                      borderRadius: "4px",
                      color: "#fff",
                      fontSize: "12px",
                      padding: "4px",
                      resize: "none",
                    }}
                    placeholder="What do you offer?"
                  />
                </div>

                {/* Pain Relievers - Bottom */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "160px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ color: "#ccc", fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>
                    Pain Relievers
                  </div>
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>💊</div>
                  <textarea
                    value={canvasData.painRelievers}
                    onChange={(e) => handleInputChange("painRelievers", e.target.value)}
                    style={{
                      width: "100%",
                      height: "60px",
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #555",
                      borderRadius: "4px",
                      color: "#fff",
                      fontSize: "12px",
                      padding: "4px",
                      resize: "none",
                    }}
                    placeholder="How do you relieve pains?"
                  />
                </div>
              </div>

              {/* Arrows */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ fontSize: "24px", color: "#666" }}>→</div>
                <div style={{ fontSize: "24px", color: "#666" }}>←</div>
              </div>

              {/* Right Circle - Customer Profile */}
              <div
                style={{
                  width: "400px",
                  height: "400px",
                  border: "3px solid #444",
                  borderRadius: "50%",
                  position: "relative",
                  backgroundColor: "#2a2a2a",
                }}
              >
                {/* Customer in center */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: "#444",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "32px",
                  }}
                >
                  👤
                </div>

                {/* Gains - Top */}
                <div
                  style={{
                    position: "absolute",
                    top: "30px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "120px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ color: "#ccc", fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>Gains</div>
                  <div style={{ fontSize: "20px", marginBottom: "8px" }}>😊</div>
                  <textarea
                    value={canvasData.gains}
                    onChange={(e) => handleInputChange("gains", e.target.value)}
                    style={{
                      width: "100%",
                      height: "50px",
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #555",
                      borderRadius: "4px",
                      color: "#fff",
                      fontSize: "11px",
                      padding: "4px",
                      resize: "none",
                    }}
                    placeholder="What gains do they want?"
                  />
                </div>

                {/* Customer Jobs - Right */}
                <div
                  style={{
                    position: "absolute",
                    right: "30px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "120px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ color: "#ccc", fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>
                    Customer Jobs
                  </div>
                  <div style={{ fontSize: "20px", marginBottom: "8px" }}>📋</div>
                  <textarea
                    value={canvasData.customerJobs}
                    onChange={(e) => handleInputChange("customerJobs", e.target.value)}
                    style={{
                      width: "100%",
                      height: "50px",
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #555",
                      borderRadius: "4px",
                      color: "#fff",
                      fontSize: "11px",
                      padding: "4px",
                      resize: "none",
                    }}
                    placeholder="What jobs do they need to do?"
                  />
                </div>

                {/* Pains - Bottom */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "30px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "120px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ color: "#ccc", fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>Pains</div>
                  <div style={{ fontSize: "20px", marginBottom: "8px" }}>😞</div>
                  <textarea
                    value={canvasData.pains}
                    onChange={(e) => handleInputChange("pains", e.target.value)}
                    style={{
                      width: "100%",
                      height: "50px",
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #555",
                      borderRadius: "4px",
                      color: "#fff",
                      fontSize: "11px",
                      padding: "4px",
                      resize: "none",
                    }}
                    placeholder="What pains do they experience?"
                  />
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div
              style={{
                marginTop: "60px",
                padding: "30px",
                backgroundColor: "#2a2a2a",
                borderRadius: "8px",
                color: "#ccc",
              }}
            >
              <h3 style={{ color: "#fff", marginBottom: "20px", fontSize: "18px" }}>Instructions</h3>
              <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
                <div style={{ marginBottom: "25px", padding: "15px", backgroundColor: "#1a1a1a", borderRadius: "4px" }}>
                  <p style={{ marginBottom: "10px" }}>
                    <strong style={{ color: "#fff" }}>Value Proposition:</strong> A clear statement that explains how
                    your product or service solves customers' problems, delivers specific benefits, and tells the ideal
                    customer why they should buy from you instead of the competition.
                  </p>
                  <p>
                    <strong style={{ color: "#fff" }}>Customer Segment:</strong> A specific group of people or
                    organizations that share similar characteristics, needs, behaviors, or demographics that your
                    business aims to serve.
                  </p>
                </div>

                <p style={{ marginBottom: "15px" }}>
                  <strong>Value Map (Left Square):</strong> Describe how your product or service creates value
                </p>
                <ul style={{ marginBottom: "20px", paddingLeft: "20px" }}>
                  <li>
                    <strong>Products & Services:</strong> List your offerings
                  </li>
                  <li>
                    <strong>Pain Relievers:</strong> How you solve customer problems
                  </li>
                  <li>
                    <strong>Gain Creators:</strong> How you create benefits for customers
                  </li>
                </ul>
                <p style={{ marginBottom: "15px" }}>
                  <strong>Customer Profile (Right Circle):</strong> Describe your customer segment
                </p>
                <ul style={{ paddingLeft: "20px" }}>
                  <li>
                    <strong>Customer Jobs:</strong> What customers are trying to accomplish
                  </li>
                  <li>
                    <strong>Pains:</strong> Problems and frustrations customers face
                  </li>
                  <li>
                    <strong>Gains:</strong> Benefits customers want to achieve
                  </li>
                </ul>
              </div>
            </div>

            {/* Save Changes Button */}
            <button
              onClick={handleSaveChanges}
              style={{
                marginTop: "20px",
                padding: "12px 24px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    )
  }

  // Benefit List Section Component
  const BenefitListSection = ({ isUnlocked }: { isUnlocked: boolean }) => (
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
        BENEFIT LIST
      </h1>

      <div style={{ display: "flex", justifyContent: "center", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ width: "600px" }}>
          <GeometricCard style={{ minHeight: "300px" }}>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "20px",
                color: "#ccc",
                textAlign: "center",
              }}
            >
              WHAT DOES USER GET?
            </h3>
            <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#ccc", textAlign: "center" }}>
              Explanation of What BENEFITS ARE
            </div>
          </GeometricCard>
        </div>
      </div>
    </div>
  )

  // 60-Second Pitch Section Component
  const SixtySecondPitchSection = ({ isUnlocked }: { isUnlocked: boolean }) => (
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
        60-SECOND PITCH
      </h1>

      <div style={{ display: "flex", justifyContent: "center", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ width: "700px" }}>
          <GeometricCard style={{ minHeight: "200px" }}>
            <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#ccc", textAlign: "center" }}>
              WHAT THE 60SECOND pitch is
            </div>
          </GeometricCard>
        </div>
      </div>
    </div>
  )

  // 1-Sentence Description Section Component
  const OneSentenceDescriptionSection = ({ isUnlocked }: { isUnlocked: boolean }) => (
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
        1-SENTENCE STARTUP DESCRIPTION
      </h1>

      <div style={{ display: "flex", justifyContent: "center", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ width: "600px" }}>
          <GeometricCard style={{ minHeight: "200px" }}>
            <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#ccc", textAlign: "center" }}>
              WHAT THE 1 sentence pitch is, now that they know their idea well.
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
        case "value-proposition":
          return <ValuePropositionSection isUnlocked={isUnlocked} />
        case "benefit-list":
          return <BenefitListSection isUnlocked={isUnlocked} />
        case "60-second-pitch":
          return <SixtySecondPitchSection isUnlocked={isUnlocked} />
        case "1-sentence-description":
          return <OneSentenceDescriptionSection isUnlocked={isUnlocked} />
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
              border: "1px solid #ccs",
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
