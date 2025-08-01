"use client"
import { useState, useEffect } from "react"

export default function ProductTaskPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState<string>("")
  const [currentTask, setCurrentTask] = useState<string>("")
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const section = params.get("section") || ""
    const task = params.get("task") || ""
    const options = params.get("options") || ""

    setCurrentSection(section)
    setCurrentTask(task)
    if (options) {
      setSelectedOptions(options.split(","))
    }
  }, [])

  // Sample data for Action Table Part 2 with instructional content
  const actionTableData = [
    {
      id: 1,
      ideaFromPart1: "User feedback system for investor interactions",
      feature: "Click here to define your feature name",
      description: "Describe what this feature does and how it helps users solve their problem",
      potential: "Rate 1-10: Market opportunity size",
      importance: "Rate 1-10: How critical is this for users?",
      complexity: "Rate 1-10: Development difficulty",
      score: "Auto-calculated priority score",
      priority: "MVP",
      priorityColor: "#4A90E2",
    },
    {
      id: 2,
      ideaFromPart1: "Simplified onboarding for new startups",
      feature: "Click here to define your feature name",
      description: "Describe what this feature does and how it helps users solve their problem",
      potential: "Rate 1-10: Market opportunity size",
      importance: "Rate 1-10: How critical is this for users?",
      complexity: "Rate 1-10: Development difficulty",
      score: "Auto-calculated priority score",
      priority: "BETA",
      priorityColor: "#7ED321",
    },
    {
      id: 3,
      ideaFromPart1: "AI-powered mentor matching",
      feature: "Click here to define your feature name",
      description: "Describe what this feature does and how it helps users solve their problem",
      potential: "Rate 1-10: Market opportunity size",
      importance: "Rate 1-10: How critical is this for users?",
      complexity: "Rate 1-10: Development difficulty",
      score: "Auto-calculated priority score",
      priority: "Postpone",
      priorityColor: "#F5A623",
    },
    {
      id: 4,
      ideaFromPart1: "Progress tracking dashboard",
      feature: "Click here to define your feature name",
      description: "Describe what this feature does and how it helps users solve their problem",
      potential: "Rate 1-10: Market opportunity size",
      importance: "Rate 1-10: How critical is this for users?",
      complexity: "Rate 1-10: Development difficulty",
      score: "Auto-calculated priority score",
      priority: "MVP",
      priorityColor: "#4A90E2",
    },
    {
      id: 5,
      ideaFromPart1: "Gamified learning modules",
      feature: "Click here to define your feature name",
      description: "Describe what this feature does and how it helps users solve their problem",
      potential: "Rate 1-10: Market opportunity size",
      importance: "Rate 1-10: How critical is this for users?",
      complexity: "Rate 1-10: Development difficulty",
      score: "Auto-calculated priority score",
      priority: "BETA",
      priorityColor: "#7ED321",
    },
  ]

  const renderActionTablePart2 = () => (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#4A90E2",
          padding: "20px 30px",
          borderRadius: "8px 8px 0 0",
          marginBottom: "0",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "24px",
            fontWeight: "600",
            color: "white",
          }}
        >
          Action Table Part 2: Feature Development & Prioritization
        </h1>
      </div>

      {/* Instructions Section */}
      <div
        style={{
          backgroundColor: "white",
          padding: "25px 30px",
          borderBottom: "1px solid #e1e5e9",
          fontSize: "14px",
          lineHeight: "1.6",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "600", color: "#333" }}>
            How to Use This Table
          </h3>
          <p style={{ margin: "0 0 15px 0", color: "#666" }}>
            Transform your ideas from Action Table Part 1 into concrete, evaluated features. This table helps you define
            what to build, assess its value, and decide when to develop it.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
          <div>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600", color: "#4A90E2" }}>
              Step 1: Define Features
            </h4>
            <ul style={{ margin: "0", paddingLeft: "18px", color: "#666" }}>
              <li>Review ideas imported from Part 1</li>
              <li>Define concrete feature names</li>
              <li>Write clear descriptions of functionality</li>
            </ul>
          </div>
          <div>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600", color: "#4A90E2" }}>
              Step 2: Evaluate & Prioritize
            </h4>
            <ul style={{ margin: "0", paddingLeft: "18px", color: "#666" }}>
              <li>Rate potential, importance, and complexity</li>
              <li>Review auto-calculated priority scores</li>
              <li>Assign development stages (MVP, BETA, etc.)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div
        style={{
          backgroundColor: "white",
          padding: "12px 30px",
          borderBottom: "1px solid #e1e5e9",
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <button
          style={{
            background: "none",
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "6px 8px",
            fontSize: "14px",
            cursor: "pointer",
            color: "#666",
          }}
          title="Refresh data"
        >
          ↻
        </button>
        <button
          style={{
            background: "none",
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "6px 8px",
            fontSize: "14px",
            cursor: "pointer",
            color: "#666",
          }}
          title="Add new row"
        >
          +
        </button>
        <button
          style={{
            background: "none",
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "6px 8px",
            fontSize: "14px",
            cursor: "pointer",
            color: "#666",
          }}
          title="Filter"
        >
          ⚡
        </button>
        <button
          style={{
            background: "none",
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "6px 8px",
            fontSize: "14px",
            cursor: "pointer",
            color: "#666",
          }}
          title="Sort"
        >
          ↕
        </button>
        <button
          style={{
            background: "none",
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "6px 8px",
            fontSize: "14px",
            cursor: "pointer",
            color: "#666",
          }}
          title="View options"
        >
          ≡
        </button>
        <button
          style={{
            background: "none",
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "6px 8px",
            fontSize: "14px",
            cursor: "pointer",
            color: "#666",
          }}
          title="Export"
        >
          📤
        </button>
      </div>

      {/* Table Container */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "0 0 8px 8px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        {/* Table Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "40px 220px 200px 300px 100px 100px 100px 100px 120px 60px",
            backgroundColor: "#f8f9fa",
            borderBottom: "2px solid #e1e5e9",
            fontSize: "13px",
            fontWeight: "600",
            color: "#495057",
          }}
        >
          <div style={{ padding: "16px 8px", textAlign: "center" }}>⋮⋮</div>
          <div style={{ padding: "16px 16px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "#4A90E2" }}>💡</span> Ideas from Part 1
          </div>
          <div style={{ padding: "16px 16px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "#4A90E2" }}>🎯</span> Feature Name
          </div>
          <div style={{ padding: "16px 16px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "#4A90E2" }}>📝</span> Feature Description
          </div>
          <div style={{ padding: "16px 8px", textAlign: "center" }}>
            <div style={{ fontWeight: "600" }}>Potential</div>
            <div style={{ fontSize: "11px", color: "#6c757d", marginTop: "2px" }}>Market Size</div>
          </div>
          <div style={{ padding: "16px 8px", textAlign: "center" }}>
            <div style={{ fontWeight: "600" }}>Importance</div>
            <div style={{ fontSize: "11px", color: "#6c757d", marginTop: "2px" }}>User Need</div>
          </div>
          <div style={{ padding: "16px 8px", textAlign: "center" }}>
            <div style={{ fontWeight: "600" }}>Complexity</div>
            <div style={{ fontSize: "11px", color: "#6c757d", marginTop: "2px" }}>Dev Effort</div>
          </div>
          <div style={{ padding: "16px 8px", textAlign: "center" }}>
            <div style={{ fontWeight: "600" }}>Score</div>
            <div style={{ fontSize: "11px", color: "#6c757d", marginTop: "2px" }}>Priority</div>
          </div>
          <div
            style={{
              padding: "16px 8px",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ color: "#4A90E2" }}>🚀</span> Stage
            </div>
            <div style={{ fontSize: "11px", color: "#6c757d" }}>Development</div>
          </div>
          <div style={{ padding: "16px 8px", textAlign: "center" }}>#</div>
        </div>

        {/* Table Body */}
        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {actionTableData.map((row, index) => (
            <div
              key={row.id}
              style={{
                display: "grid",
                gridTemplateColumns: "40px 220px 200px 300px 100px 100px 100px 100px 120px 60px",
                borderBottom: index < actionTableData.length - 1 ? "1px solid #f1f3f4" : "none",
                fontSize: "13px",
                backgroundColor: index % 2 === 0 ? "white" : "#fafbfc",
                minHeight: "60px",
              }}
            >
              {/* Drag Handle */}
              <div
                style={{
                  padding: "12px 8px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2px",
                }}
              >
                <span style={{ fontSize: "12px", color: "#9aa0a6", cursor: "grab" }}>⋮⋮</span>
              </div>

              {/* Ideas from Part 1 */}
              <div
                style={{
                  padding: "12px 16px",
                  color: "#495057",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "12px",
                  fontStyle: "italic",
                  backgroundColor: "#f8f9fa",
                  border: "1px dashed #dee2e6",
                  margin: "8px 4px",
                  borderRadius: "4px",
                }}
              >
                {row.ideaFromPart1}
              </div>

              {/* Feature Name */}
              <div
                style={{
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  placeholder={row.feature}
                  style={{
                    width: "100%",
                    border: "1px solid #dee2e6",
                    borderRadius: "4px",
                    padding: "8px 10px",
                    fontSize: "12px",
                    backgroundColor: "white",
                  }}
                />
              </div>

              {/* Feature Description */}
              <div
                style={{
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <textarea
                  placeholder={row.description}
                  style={{
                    width: "100%",
                    border: "1px solid #dee2e6",
                    borderRadius: "4px",
                    padding: "8px 10px",
                    fontSize: "12px",
                    backgroundColor: "white",
                    minHeight: "36px",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* Potential */}
              <div
                style={{
                  padding: "12px 8px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <select
                  style={{
                    width: "60px",
                    border: "1px solid #dee2e6",
                    borderRadius: "4px",
                    padding: "4px",
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  <option value="">Rate</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              {/* Importance */}
              <div
                style={{
                  padding: "12px 8px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <select
                  style={{
                    width: "60px",
                    border: "1px solid #dee2e6",
                    borderRadius: "4px",
                    padding: "4px",
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  <option value="">Rate</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              {/* Complexity */}
              <div
                style={{
                  padding: "12px 8px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <select
                  style={{
                    width: "60px",
                    border: "1px solid #dee2e6",
                    borderRadius: "4px",
                    padding: "4px",
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  <option value="">Rate</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              {/* Score */}
              <div
                style={{
                  padding: "12px 8px",
                  textAlign: "center",
                  color: "#6c757d",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontStyle: "italic",
                }}
              >
                Auto-calc
              </div>

              {/* Priority/Stage */}
              <div
                style={{
                  padding: "12px 8px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <select
                  style={{
                    border: "1px solid #dee2e6",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    fontSize: "11px",
                    backgroundColor: row.priorityColor,
                    color: "white",
                    fontWeight: "500",
                  }}
                  defaultValue={row.priority}
                >
                  <option value="MVP" style={{ backgroundColor: "#4A90E2", color: "white" }}>
                    MVP
                  </option>
                  <option value="BETA" style={{ backgroundColor: "#7ED321", color: "white" }}>
                    BETA
                  </option>
                  <option value="Prototype" style={{ backgroundColor: "#9013FE", color: "white" }}>
                    Prototype
                  </option>
                  <option value="Postpone" style={{ backgroundColor: "#F5A623", color: "white" }}>
                    Postpone
                  </option>
                  <option value="Later" style={{ backgroundColor: "#757575", color: "white" }}>
                    Later
                  </option>
                </select>
              </div>

              {/* Number */}
              <div
                style={{
                  padding: "12px 8px",
                  textAlign: "center",
                  color: "#6c757d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "500",
                }}
              >
                {row.id}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Instructions */}
      <div
        style={{
          backgroundColor: "white",
          padding: "25px 30px",
          marginTop: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h3 style={{ margin: "0 0 15px 0", fontSize: "16px", fontWeight: "600", color: "#333" }}>
          Column Explanations
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            fontSize: "14px",
          }}
        >
          <div>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", fontWeight: "600", color: "#4A90E2" }}>
              💡 Ideas from Part 1
            </h4>
            <p style={{ margin: "0", color: "#666", fontSize: "12px", lineHeight: "1.4" }}>
              Automatically imported from your Action Table Part 1. These are the raw ideas you identified during your
              research phase.
            </p>
          </div>

          <div>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", fontWeight: "600", color: "#4A90E2" }}>
              🎯 Feature Name
            </h4>
            <p style={{ margin: "0", color: "#666", fontSize: "12px", lineHeight: "1.4" }}>
              Transform your idea into a concrete feature name. Be specific and user-focused (e.g., "One-click investor
              matching").
            </p>
          </div>

          <div>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", fontWeight: "600", color: "#4A90E2" }}>
              📝 Feature Description
            </h4>
            <p style={{ margin: "0", color: "#666", fontSize: "12px", lineHeight: "1.4" }}>
              Clearly explain what this feature does and how it solves the user's problem. Focus on benefits and
              functionality.
            </p>
          </div>

          <div>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", fontWeight: "600", color: "#4A90E2" }}>
              📊 Potential (1-10)
            </h4>
            <p style={{ margin: "0", color: "#666", fontSize: "12px", lineHeight: "1.4" }}>
              Rate the market opportunity size. How many users could benefit? What's the revenue potential?
            </p>
          </div>

          <div>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", fontWeight: "600", color: "#4A90E2" }}>
              ⭐ Importance (1-10)
            </h4>
            <p style={{ margin: "0", color: "#666", fontSize: "12px", lineHeight: "1.4" }}>
              How critical is this feature for your users? Does it solve a major pain point or nice-to-have?
            </p>
          </div>

          <div>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", fontWeight: "600", color: "#4A90E2" }}>
              🔧 Complexity (1-10)
            </h4>
            <p style={{ margin: "0", color: "#666", fontSize: "12px", lineHeight: "1.4" }}>
              Rate development difficulty. Consider technical challenges, time required, and resources needed.
            </p>
          </div>

          <div>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", fontWeight: "600", color: "#4A90E2" }}>
              🎯 Priority Score
            </h4>
            <p style={{ margin: "0", color: "#666", fontSize: "12px", lineHeight: "1.4" }}>
              Auto-calculated based on your ratings. Higher scores indicate features that should be prioritized.
            </p>
          </div>

          <div>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", fontWeight: "600", color: "#4A90E2" }}>
              🚀 Development Stage
            </h4>
            <p style={{ margin: "0", color: "#666", fontSize: "12px", lineHeight: "1.4" }}>
              Choose when to build: MVP (core launch), BETA (early testing), Prototype (validation), or Later.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderActionTablePart1 = () => (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        minHeight: "100vh",
        padding: "60px 40px",
        color: "#e0e0e0",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          color: "#666",
          fontWeight: "bold",
          marginBottom: "40px",
          textAlign: "center",
        }}
      >
        ACTION TABLE PART 01
      </h1>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div
          style={{
            backgroundColor: "#2a2a2a",
            padding: "40px",
            borderRadius: "8px",
            marginBottom: "30px",
          }}
        >
          <h3 style={{ fontSize: "20px", marginBottom: "20px", color: "#fff" }}>
            Transform Interview Insights into Product Ideas
          </h3>
          <p style={{ lineHeight: "1.6", marginBottom: "20px" }}>
            This section helps you convert your customer interview findings into concrete product concepts. Document
            each idea along with potential risks and opportunities.
          </p>
          <p style={{ lineHeight: "1.6" }}>
            Focus on identifying patterns from your interviews and translating user pain points into actionable product
            solutions.
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#2a2a2a",
            padding: "30px",
            borderRadius: "8px",
          }}
        >
          <h4 style={{ fontSize: "16px", marginBottom: "15px", color: "#ccc" }}>Key Activities:</h4>
          <ul style={{ lineHeight: "1.8", paddingLeft: "20px" }}>
            <li>Review interview transcripts and notes</li>
            <li>Identify recurring themes and pain points</li>
            <li>Brainstorm initial product ideas</li>
            <li>Assess potential risks for each idea</li>
            <li>Document opportunities and market potential</li>
          </ul>
        </div>
      </div>
    </div>
  )

  const renderOverviewTask = () => (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        minHeight: "100vh",
        padding: "60px 40px",
        color: "#e0e0e0",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          color: "#666",
          fontWeight: "bold",
          marginBottom: "40px",
          textAlign: "center",
        }}
      >
        PRODUCT STRATEGY & VISION
      </h1>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div
          style={{
            backgroundColor: "#2a2a2a",
            padding: "40px",
            borderRadius: "8px",
            marginBottom: "30px",
          }}
        >
          <h3 style={{ fontSize: "20px", marginBottom: "20px", color: "#fff" }}>Define Your Product Foundation</h3>
          <p style={{ lineHeight: "1.6", marginBottom: "20px" }}>
            Establish a clear product vision that aligns with your business goals and user needs. This foundational work
            will guide all subsequent product decisions.
          </p>
          <p style={{ lineHeight: "1.6" }}>
            Create a comprehensive strategy that encompasses market positioning, target audience, and core value
            propositions.
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#2a2a2a",
            padding: "30px",
            borderRadius: "8px",
          }}
        >
          <h4 style={{ fontSize: "16px", marginBottom: "15px", color: "#ccc" }}>Strategic Components:</h4>
          <ul style={{ lineHeight: "1.8", paddingLeft: "20px" }}>
            <li>Product vision statement</li>
            <li>Target market analysis</li>
            <li>Competitive landscape review</li>
            <li>Core value propositions</li>
            <li>Success metrics and KPIs</li>
            <li>Product roadmap framework</li>
          </ul>
        </div>
      </div>
    </div>
  )

  const renderTaskContent = () => {
    if (currentSection === "action-table") {
      if (currentTask === "development-plan") {
        return renderActionTablePart2()
      } else if (currentTask === "priority-tasks") {
        return renderActionTablePart1()
      }
    } else if (currentSection === "overview" && currentTask === "product-strategy") {
      return renderOverviewTask()
    }

    return (
      <div
        style={{
          backgroundColor: "#1a1a1a",
          minHeight: "100vh",
          padding: "60px 40px",
          color: "#e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>Task Not Found</h1>
          <p>The requested task could not be found.</p>
        </div>
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
          onClick={() => window.history.back()}
          style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          ←
        </button>

        {/* Task Title */}
        <div style={{ marginLeft: "20px", fontSize: "16px", fontWeight: "500" }}>
          {currentSection === "action-table" && currentTask === "development-plan" && "Action Table Part 2"}
          {currentSection === "action-table" && currentTask === "priority-tasks" && "Action Table Part 1"}
          {currentSection === "overview" && currentTask === "product-strategy" && "Product Strategy & Vision"}
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
            <button style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>⚙️</button>
            <button style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>👤</button>
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

      {/* Main Content */}
      <div style={{ marginTop: "60px" }}>{renderTaskContent()}</div>

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
