"use client"

import type React from "react"

import { useState, useEffect } from "react"

export default function ResearchDetailPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState<string>("questions")
  const [unlockedSteps, setUnlockedSteps] = useState<string[]>(["overview"])
  const [overviewContent, setOverviewContent] = useState<string | null>(null)

  useEffect(() => {
    // Load saved overview content
    const savedOverview = sessionStorage.getItem("researchOverview")
    setOverviewContent(savedOverview)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const step = params.get("step") || "questions"
    const options = params.get("options")

    setCurrentStep(step)

    if (options) {
      setSelectedOptions(options.split(","))
    }

    // Load unlocked steps from session storage
    const storedUnlocked = sessionStorage.getItem("researchUnlockedSteps")
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

  // Always include Interview Questions as mandatory, plus Overview
  const allSections = [
    "overview",
    "questions",
    ...selectedOptions.filter((opt) => opt !== "questions" && opt !== "overview"),
  ]

  const sectionLabels: { [key: string]: string } = {
    overview: "Overview",
    questions: "Interview Questions",
    preparation: "Interview Preparation",
    outreach: "Outreach",
    interviews: "Interviews",
    evaluation: "Evaluation",
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

  const handleOverviewComplete = () => {
    // Unlock the questions section
    const newUnlockedSteps = [...unlockedSteps, "questions"]
    setUnlockedSteps(newUnlockedSteps)
    // Save to session storage
    sessionStorage.setItem("researchUnlockedSteps", newUnlockedSteps.join(","))
  }

  const handleTaskClick = (sectionId: string, taskId: string) => {
    if (sectionId === "overview") {
      // Complete overview and unlock questions
      handleOverviewComplete()
      const optionsParam = selectedOptions.join(",")
      window.location.href = `/research/task?section=${sectionId}&task=${taskId}&options=${optionsParam}`
    } else if (sectionId === "questions" && unlockedSteps.includes("questions")) {
      const optionsParam = selectedOptions.join(",")
      window.location.href = `/research/task?section=${sectionId}&task=${taskId}&options=${optionsParam}`
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
        ...(clickable && {
          ":hover": {
            backgroundColor: "#3a3a3a",
            transform: "translateY(-2px)",
          },
        }),
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
          onClick={() => handleTaskClick("overview", "research-goals")}
          style={{ fontSize: "18px", lineHeight: "1.6" }}
        >
          <h3 style={{ fontSize: "20px", marginBottom: "15px", color: "#fff" }}>Research Goals & Objectives</h3>
          {overviewContent ? (
            <div>
              <p style={{ marginBottom: "15px", fontSize: "16px", lineHeight: "1.5", color: "#ccc" }}>
                Your Research Overview:
              </p>
              <div
                style={{
                  backgroundColor: "#1a1a1a",
                  padding: "15px",
                  borderRadius: "4px",
                  border: "1px solid #444",
                  marginBottom: "15px",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {overviewContent.split("\n\n").map((section, index) => (
                  <div
                    key={index}
                    style={{ marginBottom: index < overviewContent.split("\n\n").length - 1 ? "12px" : "0" }}
                  >
                    {section}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: "14px", color: "#888" }}>Click to edit or regenerate your research overview.</p>
            </div>
          ) : (
            <div>
              <p style={{ marginBottom: "20px" }}>
                Define the problem you're tackling and what you need to learn from your research.
              </p>
              <p>Click to start defining your research goals and get AI-powered analysis of your problem statement.</p>
            </div>
          )}
        </GeometricCard>
      </div>
    </div>
  )

  // Questions Section Component
  const QuestionsSection = ({ isUnlocked }: { isUnlocked: boolean }) => (
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
        INTERVIEW QUESTIONS
      </h1>

      <div style={{ display: "flex", gap: "40px", maxWidth: "1000px", margin: "0 auto" }}>
        {/* Get Started Card */}
        <div style={{ flex: "0 0 300px" }}>
          <GeometricCard clickable={isUnlocked} onClick={() => handleTaskClick("questions", "get-started")}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "20px",
                color: "#ccc",
                textAlign: "center",
              }}
            >
              GET STARTED
            </h3>
            <p style={{ fontSize: "14px", lineHeight: "1.5" }}>
              Learn how to ask better questions - including tips, examples, and a Mom Test mini-game.
            </p>
          </GeometricCard>
        </div>

        {/* Questions Card */}
        <div style={{ flex: 1 }}>
          <GeometricCard clickable={isUnlocked} onClick={() => handleTaskClick("questions", "question-bank")}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "20px",
                color: "#ccc",
                textAlign: "center",
              }}
            >
              QUESTIONS
            </h3>
            <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
              <p style={{ marginBottom: "15px" }}>
                Write your interview questions and get instant feedback to make them stronger.
              </p>
            </div>
          </GeometricCard>
        </div>
      </div>
    </div>
  )

  // Preparation Section Component (Non-clickable)
  const PreparationSection = ({ isUnlocked }: { isUnlocked: boolean }) => (
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
        INTERVIEW
        <br />
        PREPARATIONS
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "30px", maxWidth: "900px" }}>
        {/* Top Card */}
        <div style={{ alignSelf: "flex-end", width: "400px" }}>
          <GeometricCard style={{ minHeight: "150px" }}>
            <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#ccc" }}>
              Preparation content and guidelines for conducting effective interviews.
            </div>
          </GeometricCard>
        </div>

        {/* Bottom Card */}
        <div style={{ alignSelf: "flex-start", width: "500px" }}>
          <GeometricCard style={{ minHeight: "200px" }}>
            <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#ccc" }}>
              Detailed preparation steps and methodology for interview process.
            </div>
          </GeometricCard>
        </div>
      </div>
    </div>
  )

  // Outreach Section Component (Non-clickable)
  const OutreachSection = ({ isUnlocked }: { isUnlocked: boolean }) => (
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
        OUTREACH
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "30px", maxWidth: "1000px" }}>
        {/* Top Right Card */}
        <div style={{ alignSelf: "flex-end", width: "350px" }}>
          <GeometricCard style={{ minHeight: "120px" }}>
            <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#ccc" }}>
              Contact strategies and outreach methods.
            </div>
          </GeometricCard>
        </div>

        {/* Middle Left Card */}
        <div style={{ alignSelf: "flex-start", width: "450px" }}>
          <GeometricCard style={{ minHeight: "180px" }}>
            <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#ccc" }}>
              Detailed outreach planning and execution guidelines.
            </div>
          </GeometricCard>
        </div>

        {/* Bottom Left Card */}
        <div style={{ alignSelf: "flex-start", width: "400px", marginLeft: "50px" }}>
          <GeometricCard style={{ minHeight: "150px" }}>
            <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#ccc" }}>
              Follow-up strategies and communication templates.
            </div>
          </GeometricCard>
        </div>
      </div>
    </div>
  )

  // Interviews Section Component (Non-clickable)
  const InterviewsSection = ({ isUnlocked }: { isUnlocked: boolean }) => (
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
          textAlign: "right",
          letterSpacing: "0.1em",
        }}
      >
        INTERVIEWS
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "40px", maxWidth: "900px" }}>
        {/* Top Left Card */}
        <div style={{ alignSelf: "flex-start", width: "400px" }}>
          <GeometricCard style={{ minHeight: "150px" }}>
            <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#ccc" }}>
              Interview execution and best practices.
            </div>
          </GeometricCard>
        </div>

        {/* Bottom Right Card */}
        <div style={{ alignSelf: "flex-end", width: "500px" }}>
          <GeometricCard style={{ minHeight: "200px" }}>
            <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#ccc" }}>
              Data collection and interview documentation methods.
            </div>
          </GeometricCard>
        </div>
      </div>
    </div>
  )

  // Evaluation Section Component (Non-clickable)
  const EvaluationSection = ({ isUnlocked }: { isUnlocked: boolean }) => (
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
          textAlign: "right",
          letterSpacing: "0.1em",
        }}
      >
        EVALUATION
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "30px", maxWidth: "900px" }}>
        {/* Top Right Card */}
        <div style={{ alignSelf: "flex-end", width: "400px" }}>
          <GeometricCard style={{ minHeight: "150px" }}>
            <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#ccc" }}>Analysis and evaluation criteria.</div>
          </GeometricCard>
        </div>

        {/* Bottom Left Card */}
        <div style={{ alignSelf: "flex-start", width: "500px" }}>
          <GeometricCard style={{ minHeight: "200px" }}>
            <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#ccc" }}>
              Results interpretation and decision-making framework.
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
        case "questions":
          return <QuestionsSection isUnlocked={isUnlocked} />
        case "preparation":
          return <PreparationSection isUnlocked={isUnlocked} />
        case "outreach":
          return <OutreachSection isUnlocked={isUnlocked} />
        case "interviews":
          return <InterviewsSection isUnlocked={isUnlocked} />
        case "evaluation":
          return <EvaluationSection isUnlocked={isUnlocked} />
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
          onClick={() => (window.location.href = "/research/plan")}
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
            Health Check
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
