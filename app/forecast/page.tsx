"use client"

import { useState, useEffect } from "react"
import { ArrowUp, X, Edit2, Check, Clock, User } from "lucide-react"
import { getTeamMembers, type TeamMember } from "@/lib/team-data"

interface ActionStep {
  id: string
  task: string
  assignee: string
  deadline: string
  completed: boolean
}

interface Suggestion {
  id: string
  type: "opportunity" | "warning"
  title: string
  description: string
  deadline?: string
  priority?: string
}

export default function ForecastPage() {
  const [whatIfQuestion, setWhatIfQuestion] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dismissedNotifications, setDismissedNotifications] = useState<string[]>([])
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([])
  const [showImplementPopup, setShowImplementPopup] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null)
  const [actionSteps, setActionSteps] = useState<ActionStep[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [editingStep, setEditingStep] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [showHistory, setShowHistory] = useState(false)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [editingAssignee, setEditingAssignee] = useState<string | null>(null)
  const [editingAssigneeName, setEditingAssigneeName] = useState<string | null>(null)
  const [editAssigneeText, setEditAssigneeText] = useState("")
  const [whatIfAnalysis, setWhatIfAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  useEffect(() => {
    setTeamMembers(getTeamMembers())
  }, [])

  const suggestions: Suggestion[] = [
    {
      id: "techcrunch",
      type: "opportunity",
      title: "Apply to TechCrunch Disrupt in 2 weeks — ideal readiness window",
      description: "Recommended action: Prepare pitch deck and demo",
      deadline: "September 15",
    },
    {
      id: "fundraising",
      type: "warning",
      title: "Burn rate projects runway end in 46 days — consider fundraising",
      description: "Recommended action: Initiate Series A conversations",
      priority: "Critical by October 20",
    },
    {
      id: "vision",
      type: "warning",
      title: "Clarity of vision has dropped 13% — re-align team",
      description: "Recommended action: Schedule all-hands strategy session",
      priority: "Trending negative",
    },
  ]

  const handleDismiss = (notificationId: string) => {
    setDismissedNotifications((prev) => [...prev, notificationId])
  }

  const handleDismissSuggestion = (suggestionId: string) => {
    setDismissedSuggestions((prev) => [...prev, suggestionId])
  }

  const generateActionSteps = async (suggestion: Suggestion) => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-implementation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          suggestion: suggestion,
          teamMembers: teamMembers,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Convert to our format with IDs
      const steps = data.steps.map((step: any, index: number) => ({
        id: (index + 1).toString(),
        task: step.task || `Complete action for: ${suggestion.title}`,
        assignee: step.assignee || "Founder",
        deadline: step.deadline || "2025-09-15",
        completed: false,
      }))

      setActionSteps(steps)
    } catch (error) {
      console.error("Error generating action steps:", error)
      // Create fallback steps specific to the suggestion
      const fallbackSteps = createFallbackSteps(suggestion)
      setActionSteps(fallbackSteps)
    }
    setIsGenerating(false)
  }

  const createFallbackSteps = (suggestion: Suggestion) => {
    // Create unique fallback steps based on the suggestion type and content
    if (suggestion.id === "techcrunch") {
      return [
        {
          id: "1",
          task: "Research TechCrunch Disrupt application requirements using free online resources",
          assignee: teamMembers.find((m) => m.role.includes("CEO"))?.name || "Alex Chen",
          deadline: "2025-09-01",
          completed: false,
        },
        {
          id: "2",
          task: "Create 10-slide pitch deck using Canva or Google Slides template",
          assignee: teamMembers.find((m) => m.skills.includes("Design"))?.name || "Marcus Johnson",
          deadline: "2025-09-05",
          completed: false,
        },
        {
          id: "3",
          task: "Record 3-minute product demo video using Loom or phone camera",
          assignee:
            teamMembers.find((m) => m.role.includes("CTO") || m.skills.includes("Development"))?.name || "Sarah Kim",
          deadline: "2025-09-08",
          completed: false,
        },
        {
          id: "4",
          task: "Submit application and leverage personal network for introductions",
          assignee: teamMembers.find((m) => m.role.includes("CEO"))?.name || "Alex Chen",
          deadline: "2025-09-12",
          completed: false,
        },
      ]
    } else if (suggestion.id === "fundraising") {
      return [
        {
          id: "1",
          task: "Create basic financial model in Google Sheets with 18-month projections",
          assignee: teamMembers.find((m) => m.role.includes("CEO"))?.name || "Alex Chen",
          deadline: "2025-09-05",
          completed: false,
        },
        {
          id: "2",
          task: "Build fundraising deck using existing pitch deck + financial slides",
          assignee: teamMembers.find((m) => m.skills.includes("Design"))?.name || "Marcus Johnson",
          deadline: "2025-09-10",
          completed: false,
        },
        {
          id: "3",
          task: "Research 15-20 relevant investors using AngelList and Crunchbase free tiers",
          assignee: teamMembers.find((m) => m.skills.includes("Business Development"))?.name || "Alex Chen",
          deadline: "2025-09-08",
          completed: false,
        },
        {
          id: "4",
          task: "Reach out to warm connections for investor introductions",
          assignee: teamMembers.find((m) => m.role.includes("CEO"))?.name || "Alex Chen",
          deadline: "2025-09-15",
          completed: false,
        },
        {
          id: "5",
          task: "Organize key documents in Google Drive for due diligence",
          assignee: teamMembers.find((m) => m.role.includes("CTO"))?.name || "Sarah Kim",
          deadline: "2025-09-20",
          completed: false,
        },
      ]
    } else if (suggestion.id === "vision") {
      return [
        {
          id: "1",
          task: "Send anonymous Google Form survey to team about company direction",
          assignee: teamMembers.find((m) => m.role.includes("CEO"))?.name || "Alex Chen",
          deadline: "2025-09-03",
          completed: false,
        },
        {
          id: "2",
          task: "Schedule 90-minute team meeting at office or co-working space",
          assignee: teamMembers.find((m) => m.role.includes("CEO"))?.name || "Alex Chen",
          deadline: "2025-09-06",
          completed: false,
        },
        {
          id: "3",
          task: "Draft 1-page company mission and 2025 goals document",
          assignee: teamMembers.find((m) => m.role.includes("CEO"))?.name || "Alex Chen",
          deadline: "2025-09-10",
          completed: false,
        },
        {
          id: "4",
          task: "Create simple roadmap visual using Miro free plan or whiteboard",
          assignee: teamMembers.find((m) => m.skills.includes("Design"))?.name || "Marcus Johnson",
          deadline: "2025-09-12",
          completed: false,
        },
        {
          id: "5",
          task: "Implement weekly 15-minute team standup meetings",
          assignee: teamMembers.find((m) => m.role.includes("CEO"))?.name || "Alex Chen",
          deadline: "2025-09-15",
          completed: false,
        },
      ]
    }

    // Generic fallback
    return [
      {
        id: "1",
        task: `Define specific action items for: ${suggestion.title}`,
        assignee: teamMembers.find((m) => m.role.includes("CEO"))?.name || "Alex Chen",
        deadline: "2025-09-01",
        completed: false,
      },
    ]
  }

  const handleImplement = async (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion)
    setShowImplementPopup(true)
    await generateActionSteps(suggestion)
  }

  const handleEditStep = (stepId: string, currentText: string) => {
    setEditingStep(stepId)
    setEditText(currentText)
  }

  const handleSaveEdit = (stepId: string) => {
    setActionSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, task: editText } : step)))
    setEditingStep(null)
    setEditText("")
  }

  const handleAssigneeChange = (stepId: string, newAssignee: string) => {
    setActionSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, assignee: newAssignee } : step)))
  }

  const addTasksToCommandDeck = (steps: ActionStep[]) => {
    // Get existing tasks from localStorage
    const existingTasks = JSON.parse(localStorage.getItem("commandDeckTasks") || "[]")

    // Convert action steps to command deck task format
    const newTasks = steps.map((step, index) => ({
      id: `forecast-${Date.now()}-${index}`,
      title: step.task,
      assignee: step.assignee,
      deadline: step.deadline,
      status: "pending",
      priority: "medium",
      source: "forecast",
      createdAt: new Date().toISOString(),
    }))

    // Combine and save
    const allTasks = [...existingTasks, ...newTasks]
    localStorage.setItem("commandDeckTasks", JSON.stringify(allTasks))
  }

  const handleConfirmImplementation = () => {
    // Add steps to Command Deck
    addTasksToCommandDeck(actionSteps)

    // Dismiss the suggestion since it's been implemented
    if (selectedSuggestion) {
      handleDismissSuggestion(selectedSuggestion.id)
    }

    // Close popup
    setShowImplementPopup(false)
    setSelectedSuggestion(null)
    setActionSteps([])

    // Show success message
    alert(`${actionSteps.length} tasks have been added to your Command Deck!`)
  }

  const handleAnalyzeWhatIf = async () => {
    if (!whatIfQuestion.trim()) return

    setIsAnalyzing(true)
    setAnalysisError(null)
    setWhatIfAnalysis(null)

    try {
      const response = await fetch("/api/analyze-what-if", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scenario: whatIfQuestion,
          currentContext: {
            stage: "early-stage",
            team_size: teamMembers.length,
            runway_days: 127,
            current_priorities: ["MVP development", "User acquisition", "Fundraising"],
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setWhatIfAnalysis(data.analysis)
    } catch (error) {
      console.error("What-if analysis error:", error)
      setAnalysisError(error instanceof Error ? error.message : "Failed to analyze scenario")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <>
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
                onKeyPress={(e) => {
                  if (e.key === "Enter" && whatIfQuestion.trim()) {
                    handleAnalyzeWhatIf()
                  }
                }}
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
                onClick={handleAnalyzeWhatIf}
                disabled={!whatIfQuestion.trim() || isAnalyzing}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: whatIfQuestion.trim() && !isAnalyzing ? "#007bff" : "#444",
                  border: "1px solid #555",
                  color: "#e0e0e0",
                  width: "40px",
                  height: "40px",
                  cursor: whatIfQuestion.trim() && !isAnalyzing ? "pointer" : "not-allowed",
                  clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isAnalyzing ? (
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid #e0e0e0",
                      borderTop: "2px solid transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                ) : (
                  <ArrowUp size={16} />
                )}
              </button>
            </div>

            {/* Analysis Results */}
            {isAnalyzing && (
              <div style={{ marginTop: "30px", textAlign: "center", color: "#999" }}>
                <div style={{ fontSize: "16px", marginBottom: "8px" }}>Analyzing scenario impact...</div>
                <div style={{ fontSize: "14px" }}>Evaluating effects on timeline, resources, and strategy</div>
              </div>
            )}

            {analysisError && (
              <div
                style={{
                  marginTop: "30px",
                  padding: "20px",
                  backgroundColor: "#2d1b1b",
                  border: "1px solid #5c2626",
                  color: "#ef4444",
                  clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                }}
              >
                <strong>Analysis Error:</strong> {analysisError}
              </div>
            )}

            {whatIfAnalysis && !isAnalyzing && (
              <div style={{ marginTop: "30px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "500", margin: "0 0 24px 0", color: "#e0e0e0" }}>
                  Scenario Impact Analysis
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  {/* Timeline Impact */}
                  {whatIfAnalysis.timeline && (
                    <div
                      style={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #333",
                        clipPath:
                          "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                        padding: "20px",
                      }}
                    >
                      <h4 style={{ fontSize: "16px", fontWeight: "500", margin: "0 0 12px 0", color: "#22c55e" }}>
                        📅 Timeline Impact
                      </h4>
                      <p style={{ fontSize: "14px", color: "#e0e0e0", margin: "0", lineHeight: "1.5" }}>
                        {whatIfAnalysis.timeline}
                      </p>
                    </div>
                  )}

                  {/* Resource Impact */}
                  {whatIfAnalysis.resources && (
                    <div
                      style={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #333",
                        clipPath:
                          "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                        padding: "20px",
                      }}
                    >
                      <h4 style={{ fontSize: "16px", fontWeight: "500", margin: "0 0 12px 0", color: "#f59e0b" }}>
                        💰 Resource Impact
                      </h4>
                      <p style={{ fontSize: "14px", color: "#e0e0e0", margin: "0", lineHeight: "1.5" }}>
                        {whatIfAnalysis.resources}
                      </p>
                    </div>
                  )}

                  {/* Team Dynamics */}
                  {whatIfAnalysis.team && (
                    <div
                      style={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #333",
                        clipPath:
                          "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                        padding: "20px",
                      }}
                    >
                      <h4 style={{ fontSize: "16px", fontWeight: "500", margin: "0 0 12px 0", color: "#8b5cf6" }}>
                        👥 Team Dynamics
                      </h4>
                      <p style={{ fontSize: "14px", color: "#e0e0e0", margin: "0", lineHeight: "1.5" }}>
                        {whatIfAnalysis.team}
                      </p>
                    </div>
                  )}

                  {/* Investor Relations */}
                  {whatIfAnalysis.investors && (
                    <div
                      style={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #333",
                        clipPath:
                          "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                        padding: "20px",
                      }}
                    >
                      <h4 style={{ fontSize: "16px", fontWeight: "500", margin: "0 0 12px 0", color: "#ef4444" }}>
                        🤝 Investor Relations
                      </h4>
                      <p style={{ fontSize: "14px", color: "#e0e0e0", margin: "0", lineHeight: "1.5" }}>
                        {whatIfAnalysis.investors}
                      </p>
                    </div>
                  )}

                  {/* Market Position */}
                  {whatIfAnalysis.market && (
                    <div
                      style={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #333",
                        clipPath:
                          "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                        padding: "20px",
                      }}
                    >
                      <h4 style={{ fontSize: "16px", fontWeight: "500", margin: "0 0 12px 0", color: "#06b6d4" }}>
                        📈 Market Position
                      </h4>
                      <p style={{ fontSize: "14px", color: "#e0e0e0", margin: "0", lineHeight: "1.5" }}>
                        {whatIfAnalysis.market}
                      </p>
                    </div>
                  )}

                  {/* Strategic Recommendations */}
                  {whatIfAnalysis.recommendations && (
                    <div
                      style={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #333",
                        clipPath:
                          "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                        padding: "20px",
                        gridColumn: "1 / -1",
                      }}
                    >
                      <h4 style={{ fontSize: "16px", fontWeight: "500", margin: "0 0 12px 0", color: "#10b981" }}>
                        💡 Strategic Recommendations
                      </h4>
                      <p style={{ fontSize: "14px", color: "#e0e0e0", margin: "0", lineHeight: "1.5" }}>
                        {whatIfAnalysis.recommendations}
                      </p>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: "20px", textAlign: "center" }}>
                  <button
                    onClick={() => {
                      setWhatIfAnalysis(null)
                      setWhatIfQuestion("")
                      setAnalysisError(null)
                    }}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: "#6b7280",
                      border: "1px solid #4b5563",
                      color: "white",
                      fontSize: "14px",
                      cursor: "pointer",
                      clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                      fontWeight: "500",
                    }}
                  >
                    Clear Analysis
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Opportunity & Warning Feed */}
        <div style={{ padding: "0 60px 60px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "500", margin: "0", color: "#e0e0e0" }}>
              Opportunity & Warning Feed
            </h2>
            <button
              onClick={() => setShowHistory(!showHistory)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#2a2a2a",
                border: "1px solid #444",
                color: "#e0e0e0",
                fontSize: "14px",
                cursor: "pointer",
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                transition: "all 0.3s ease",
              }}
            >
              {showHistory ? "Hide History" : "View History"}
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {suggestions
              .filter((suggestion) => !dismissedSuggestions.includes(suggestion.id))
              .map((suggestion) => (
                <div
                  key={suggestion.id}
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
                          backgroundColor: suggestion.type === "opportunity" ? "#22c55e" : "#ef4444",
                          color: "white",
                          fontSize: "12px",
                          fontWeight: "500",
                          clipPath:
                            "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                        }}
                      >
                        {suggestion.type === "opportunity" ? "Opportunity" : "Warning"}
                      </span>
                      <span style={{ color: "#999", fontSize: "14px" }}>
                        {suggestion.deadline ? `Due ${suggestion.deadline}` : suggestion.priority}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "18px", fontWeight: "500", margin: "0 0 8px 0", color: "#e0e0e0" }}>
                      {suggestion.title}
                    </h3>
                    <p style={{ fontSize: "14px", color: "#999", margin: "0" }}>{suggestion.description}</p>
                  </div>
                  <div style={{ display: "flex", gap: "12px", marginLeft: "20px" }}>
                    <button
                      onClick={() => handleDismissSuggestion(suggestion.id)}
                      style={{
                        padding: "12px 20px",
                        backgroundColor: "#2a2a2a",
                        border: "1px solid #444",
                        color: "#999",
                        fontSize: "14px",
                        cursor: "pointer",
                        clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                        fontWeight: "500",
                        transition: "all 0.3s ease",
                      }}
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleImplement(suggestion)}
                      style={{
                        padding: "12px 24px",
                        backgroundColor: "#007bff",
                        border: "1px solid #0056b3",
                        color: "white",
                        fontSize: "14px",
                        cursor: "pointer",
                        clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                        fontWeight: "500",
                        transition: "all 0.3s ease",
                      }}
                    >
                      Implement
                    </button>
                  </div>
                </div>
              ))}

            {/* Show message when all suggestions are dismissed */}
            {dismissedSuggestions.length === suggestions.length && (
              <div style={{ padding: "40px", textAlign: "center", color: "#999" }}>
                All suggestions have been dismissed or implemented.
              </div>
            )}

            {/* History Section */}
            {showHistory && dismissedSuggestions.length > 0 && (
              <div style={{ marginTop: "30px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "500", margin: "0 0 20px 0", color: "#e0e0e0" }}>
                  Dismissed History
                </h3>
                {suggestions
                  .filter((suggestion) => dismissedSuggestions.includes(suggestion.id))
                  .map((suggestion) => (
                    <div
                      key={suggestion.id}
                      style={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #333",
                        clipPath:
                          "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
                        padding: "20px",
                        marginBottom: "12px",
                        opacity: 0.6,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                        <span
                          style={{
                            padding: "4px 12px",
                            backgroundColor: suggestion.type === "opportunity" ? "#22c55e" : "#ef4444",
                            color: "white",
                            fontSize: "12px",
                            fontWeight: "500",
                            clipPath:
                              "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                          }}
                        >
                          {suggestion.type === "opportunity" ? "Opportunity" : "Warning"}
                        </span>
                        <span style={{ color: "#666", fontSize: "12px" }}>DISMISSED</span>
                      </div>
                      <h4 style={{ fontSize: "16px", fontWeight: "500", margin: "0 0 4px 0", color: "#ccc" }}>
                        {suggestion.title}
                      </h4>
                      <p style={{ fontSize: "14px", color: "#666", margin: "0" }}>{suggestion.description}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Implementation Popup */}
        {showImplementPopup && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.8)",
              zIndex: 1001,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "#2a2a2a",
                border: "1px solid #444",
                clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                padding: "30px",
                maxWidth: "800px",
                width: "100%",
                maxHeight: "80vh",
                overflowY: "auto",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "24px", fontWeight: "600", margin: "0 0 8px 0", color: "#e0e0e0" }}>
                    Implementation Plan
                  </h3>
                  <p style={{ fontSize: "16px", color: "#999", margin: "0" }}>{selectedSuggestion?.title}</p>
                </div>
                <button
                  onClick={() => {
                    setShowImplementPopup(false)
                    setSelectedSuggestion(null)
                    setActionSteps([])
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#999",
                    cursor: "pointer",
                    fontSize: "24px",
                    padding: "0",
                  }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Loading State */}
              {isGenerating && (
                <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                  <div style={{ fontSize: "16px", marginBottom: "12px" }}>
                    Generating startup-focused action steps...
                  </div>
                  <div style={{ fontSize: "14px" }}>Tailoring recommendations for your team size and resources</div>
                </div>
              )}

              {/* Action Steps */}
              {!isGenerating && actionSteps.length > 0 && (
                <div style={{ marginBottom: "30px" }}>
                  <h4 style={{ fontSize: "18px", fontWeight: "500", margin: "0 0 20px 0", color: "#e0e0e0" }}>
                    Action Steps
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {actionSteps.map((step, index) => (
                      <div
                        key={step.id}
                        style={{
                          backgroundColor: "#1a1a1a",
                          border: "1px solid #333",
                          clipPath:
                            "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                          padding: "20px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                          <div
                            style={{
                              backgroundColor: "#007bff",
                              color: "white",
                              width: "24px",
                              height: "24px",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              fontWeight: "600",
                              flexShrink: 0,
                              marginTop: "2px",
                            }}
                          >
                            {index + 1}
                          </div>
                          <div style={{ flex: 1 }}>
                            {editingStep === step.id ? (
                              <div style={{ marginBottom: "12px" }}>
                                <textarea
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  style={{
                                    width: "100%",
                                    minHeight: "60px",
                                    padding: "12px",
                                    backgroundColor: "#2a2a2a",
                                    border: "1px solid #444",
                                    color: "#e0e0e0",
                                    fontSize: "14px",
                                    resize: "vertical",
                                    outline: "none",
                                  }}
                                />
                                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                                  <button
                                    onClick={() => handleSaveEdit(step.id)}
                                    style={{
                                      padding: "6px 12px",
                                      backgroundColor: "#22c55e",
                                      border: "1px solid #16a34a",
                                      color: "white",
                                      fontSize: "12px",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "4px",
                                    }}
                                  >
                                    <Check size={14} />
                                    Save
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingStep(null)
                                      setEditText("")
                                    }}
                                    style={{
                                      padding: "6px 12px",
                                      backgroundColor: "#6b7280",
                                      border: "1px solid #4b5563",
                                      color: "white",
                                      fontSize: "12px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div style={{ marginBottom: "12px" }}>
                                <div
                                  style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
                                >
                                  <p
                                    style={{
                                      fontSize: "16px",
                                      color: "#e0e0e0",
                                      margin: "0",
                                      lineHeight: "1.4",
                                      flex: 1,
                                    }}
                                  >
                                    {step.task}
                                  </p>
                                  <button
                                    onClick={() => handleEditStep(step.id, step.task)}
                                    style={{
                                      background: "transparent",
                                      border: "none",
                                      color: "#999",
                                      cursor: "pointer",
                                      padding: "4px",
                                      marginLeft: "12px",
                                    }}
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                </div>
                              </div>
                            )}
                            <div style={{ display: "flex", gap: "20px", fontSize: "14px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  color: "#999",
                                  position: "relative",
                                }}
                              >
                                <User size={14} />
                                <select
                                  value={step.assignee}
                                  onChange={(e) => handleAssigneeChange(step.id, e.target.value)}
                                  style={{
                                    padding: "6px 12px",
                                    backgroundColor: "#1a1a1a",
                                    border: "1px solid #444",
                                    color: "#e0e0e0",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                    clipPath:
                                      "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                                    outline: "none",
                                    minWidth: "150px",
                                  }}
                                >
                                  {teamMembers.map((member) => (
                                    <option
                                      key={member.id}
                                      value={member.name}
                                      style={{ backgroundColor: "#1a1a1a", color: "#e0e0e0" }}
                                    >
                                      {member.name} - {member.role}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#999" }}>
                                <Clock size={14} />
                                {step.deadline}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              {!isGenerating && actionSteps.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "12px",
                    paddingTop: "20px",
                    borderTop: "1px solid #444",
                  }}
                >
                  <button
                    onClick={() => {
                      setShowImplementPopup(false)
                      setSelectedSuggestion(null)
                      setActionSteps([])
                    }}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: "#6b7280",
                      border: "1px solid #4b5563",
                      color: "white",
                      fontSize: "16px",
                      cursor: "pointer",
                      clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                      fontWeight: "500",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmImplementation}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: "#22c55e",
                      border: "1px solid #16a34a",
                      color: "white",
                      fontSize: "16px",
                      cursor: "pointer",
                      clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                      fontWeight: "500",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Confirm Implementation
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}
