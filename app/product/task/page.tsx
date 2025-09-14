"use client"

import { useState, useEffect } from "react"
import { earnTokensForStep } from "@/lib/token-integration"
import { useSearchParams } from "next/navigation"
import { TokenDisplay } from "@/components/token-display"

const ProductTaskPage = () => {
  const searchParams = useSearchParams()
  const section = searchParams.get("section") || ""
  const task = searchParams.get("task") || ""
  const optionsParam = searchParams.get("options") || ""
  const options = optionsParam ? optionsParam.split(",") : []

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [postIts, setPostIts] = useState<{
    ideas: string[]
    issues: string[]
    risks: string[]
  }>({
    ideas: [],
    issues: [],
    risks: [],
  })
  const [newPostIt, setNewPostIt] = useState("")
  const [activeColumn, setActiveColumn] = useState<"ideas" | "issues" | "risks">("ideas")

  useEffect(() => {
    // Load saved post-its from session storage
    const savedPostIts = sessionStorage.getItem("productActionTablePostIts")
    if (savedPostIts) {
      setPostIts(JSON.parse(savedPostIts))
    }
  }, [])

  const addPostIt = () => {
    if (newPostIt.trim()) {
      const updatedPostIts = {
        ...postIts,
        [activeColumn]: [...postIts[activeColumn], newPostIt.trim()],
      }
      setPostIts(updatedPostIts)
      setNewPostIt("")

      // Save to session storage
      sessionStorage.setItem("productActionTablePostIts", JSON.stringify(updatedPostIts))

      // Award tokens for adding post-its
      earnTokensForStep("PRODUCT_ACTION_TABLE")
    }
  }

  const removePostIt = (column: "ideas" | "issues" | "risks", index: number) => {
    const updatedPostIts = {
      ...postIts,
      [column]: postIts[column].filter((_, i) => i !== index),
    }
    setPostIts(updatedPostIts)

    // Save to session storage
    sessionStorage.setItem("productActionTablePostIts", JSON.stringify(updatedPostIts))
  }

  const handleSave = () => {
    // Save logic here
    sessionStorage.setItem("productActionTablePostIts", JSON.stringify(postIts))
    earnTokensForStep("PRODUCT_ACTION_TABLE")
    alert("Progress saved!")
  }

  const handleCompletion = () => {
    // Completion logic here
    earnTokensForStep("PRODUCT_ACTION_TABLE")
  }

  const handleBack = () => {
    const optionsParam = options.join(",")
    window.location.href = `/product/detail?step=${section}&options=${optionsParam}`
  }

  // Render different content based on the task
  const renderTaskContent = () => {
    if (section === "action-table" && task === "priority-tasks") {
      return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "10px", color: "#333" }}>Action Table - Part 1</h1>
          <p style={{ fontSize: "16px", color: "#666", marginBottom: "40px" }}>
            Turn your interview insights into early product ideas and note any possible issues or risks each idea could
            bring.
          </p>

          {/* Add Post-it Section */}
          <div style={{ marginBottom: "30px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <button
                onClick={() => setActiveColumn("ideas")}
                style={{
                  padding: "8px 16px",
                  backgroundColor: activeColumn === "ideas" ? "#007bff" : "#e9ecef",
                  color: activeColumn === "ideas" ? "white" : "#333",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Ideas
              </button>
              <button
                onClick={() => setActiveColumn("issues")}
                style={{
                  padding: "8px 16px",
                  backgroundColor: activeColumn === "issues" ? "#dc3545" : "#e9ecef",
                  color: activeColumn === "issues" ? "white" : "#333",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Issues
              </button>
              <button
                onClick={() => setActiveColumn("risks")}
                style={{
                  padding: "8px 16px",
                  backgroundColor: activeColumn === "risks" ? "#ffc107" : "#e9ecef",
                  color: activeColumn === "risks" ? "#333" : "#333",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Risks
              </button>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={newPostIt}
                onChange={(e) => setNewPostIt(e.target.value)}
                placeholder={`Add a new ${activeColumn.slice(0, -1)}...`}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
                onKeyPress={(e) => e.key === "Enter" && addPostIt()}
              />
              <button
                onClick={addPostIt}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Add
              </button>
            </div>
          </div>

          {/* Three Column Layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "30px", minHeight: "500px" }}>
            {/* Ideas Column */}
            <div>
              <h3
                style={{
                  fontSize: "18px",
                  marginBottom: "20px",
                  color: "#007bff",
                  textAlign: "center",
                  padding: "10px",
                  backgroundColor: "#e3f2fd",
                  borderRadius: "8px",
                }}
              >
                💡 Product Ideas
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {postIts.ideas.map((idea, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#fff3cd",
                      padding: "15px",
                      borderRadius: "8px",
                      border: "1px solid #ffeaa7",
                      position: "relative",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <button
                      onClick={() => removePostIt("ideas", index)}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        background: "none",
                        border: "none",
                        fontSize: "16px",
                        cursor: "pointer",
                        color: "#999",
                      }}
                    >
                      ×
                    </button>
                    <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.4" }}>{idea}</p>
                  </div>
                ))}
                {postIts.ideas.length === 0 && (
                  <div
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      color: "#999",
                      fontStyle: "italic",
                      border: "2px dashed #ddd",
                      borderRadius: "8px",
                    }}
                  >
                    No ideas yet. Add some above!
                  </div>
                )}
              </div>
            </div>

            {/* Issues Column */}
            <div>
              <h3
                style={{
                  fontSize: "18px",
                  marginBottom: "20px",
                  color: "#dc3545",
                  textAlign: "center",
                  padding: "10px",
                  backgroundColor: "#f8d7da",
                  borderRadius: "8px",
                }}
              >
                ⚠️ Potential Issues
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {postIts.issues.map((issue, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#f8d7da",
                      padding: "15px",
                      borderRadius: "8px",
                      border: "1px solid #f5c6cb",
                      position: "relative",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <button
                      onClick={() => removePostIt("issues", index)}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        background: "none",
                        border: "none",
                        fontSize: "16px",
                        cursor: "pointer",
                        color: "#999",
                      }}
                    >
                      ×
                    </button>
                    <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.4" }}>{issue}</p>
                  </div>
                ))}
                {postIts.issues.length === 0 && (
                  <div
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      color: "#999",
                      fontStyle: "italic",
                      border: "2px dashed #ddd",
                      borderRadius: "8px",
                    }}
                  >
                    No issues identified yet.
                  </div>
                )}
              </div>
            </div>

            {/* Risks Column */}
            <div>
              <h3
                style={{
                  fontSize: "18px",
                  marginBottom: "20px",
                  color: "#856404",
                  textAlign: "center",
                  padding: "10px",
                  backgroundColor: "#fff3cd",
                  borderRadius: "8px",
                }}
              >
                🚨 Risks
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {postIts.risks.map((risk, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#fff3cd",
                      padding: "15px",
                      borderRadius: "8px",
                      border: "1px solid #ffeaa7",
                      position: "relative",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <button
                      onClick={() => removePostIt("risks", index)}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        background: "none",
                        border: "none",
                        fontSize: "16px",
                        cursor: "pointer",
                        color: "#999",
                      }}
                    >
                      ×
                    </button>
                    <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.4" }}>{risk}</p>
                  </div>
                ))}
                {postIts.risks.length === 0 && (
                  <div
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      color: "#999",
                      fontStyle: "italic",
                      border: "2px dashed #ddd",
                      borderRadius: "8px",
                    }}
                  >
                    No risks identified yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div style={{ marginTop: "40px", textAlign: "center" }}>
            <button
              onClick={handleSave}
              style={{
                padding: "12px 30px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Save Progress
            </button>
            <button
              onClick={handleCompletion}
              style={{
                padding: "12px 30px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                cursor: "pointer",
                marginLeft: "10px",
              }}
            >
              Complete Task
            </button>
          </div>
        </div>
      )
    }

    // Default content for other tasks
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Task: {task}</h1>
        <p>Section: {section}</p>
        <p>This task interface is not yet implemented.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TokenDisplay />
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
          onClick={handleBack}
          style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          ←
        </button>

        <div style={{ marginLeft: "20px", fontSize: "16px", fontWeight: "500" }}>
          Product Task: {task.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
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

        {/* Navigation buttons */}
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
            Health Check
          </button>
          <button
            onClick={() => (window.location.href = "/forecast")}
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
            onClick={() => (window.location.href = "/reports")}
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
            onClick={() => (window.location.href = "/network")}
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

      {/* Main Content */}
      <div style={{ marginTop: "60px", paddingBottom: "40px" }}>{renderTaskContent()}</div>

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

export default ProductTaskPage
