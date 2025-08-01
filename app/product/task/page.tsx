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

  // Sample data for Action Table Part 2
  const actionTableData = [
    {
      id: 1,
      feature: "VP for VCs",
      description: "come up with specific additional features for investors",
      potential: 8.33,
      importance: 9.33,
      complexity: 6.0,
      score: 7.92,
      priority: "BETA",
      priorityColor: "#4A90E2",
    },
    {
      id: 2,
      feature: "MVP testing platform",
      description: "project to develop a baby platform for MVP testing",
      potential: 6.0,
      importance: 4.0,
      complexity: 5.67,
      score: 5.08,
      priority: "Postpone",
      priorityColor: "#F5A623",
    },
    {
      id: 3,
      feature: "App for founders",
      description:
        "focused on entrepreneurial mindset, skills, work-life balance, habits, and team skills and cohesion (team buildings/team management), track energy levels!",
      potential: 6.0,
      importance: 4.33,
      complexity: 5.67,
      score: 5.22,
      priority: "Postpone",
      priorityColor: "#F5A623",
    },
    {
      id: 4,
      feature: "Alstronaut",
      description: "chatbot",
      potential: 6.33,
      importance: 8.0,
      complexity: 6.33,
      score: 7.0,
      priority: "BETA",
      priorityColor: "#4A90E2",
    },
    {
      id: 5,
      feature: "Personalized motivational reminders",
      description: "popup reminders while screens load",
      potential: 7.33,
      importance: 4.0,
      complexity: 2.0,
      score: 4.13,
      priority: "BETA",
      priorityColor: "#4A90E2",
    },
    {
      id: 6,
      feature: "Ranking investors (reviews) + incubators",
      description:
        "rank globally investors and incubators (founders can leave reviews and their experiences with them)",
      potential: 8.67,
      importance: 6.33,
      complexity: 6.33,
      score: 6.92,
      priority: "Postpone",
      priorityColor: "#F5A623",
    },
    {
      id: 7,
      feature: "Verified startups (+requirements)",
      description: "startups need to meet a certain set of requirements to be able to contact a mentor or an investor",
      potential: 9.33,
      importance: 8.67,
      complexity: 7.0,
      score: 8.25,
      priority: "MVP",
      priorityColor: "#7ED321",
    },
    {
      id: 8,
      feature: "AI adapted for small businesses",
      description: "add a set of rules to the AI model in order to make specific map for small business owners",
      potential: 4.67,
      importance: 4.0,
      complexity: 4.67,
      score: 4.4,
      priority: "Postpone",
      priorityColor: "#F5A623",
    },
    {
      id: 9,
      feature: "Hackatons",
      description: "project to develop a baby platform for hackatons",
      potential: 8.33,
      importance: 3.0,
      complexity: 4.67,
      score: 4.92,
      priority: "Postpone",
      priorityColor: "#F5A623",
    },
    {
      id: 10,
      feature: "Startup get feedback from the platform (analysis)",
      description:
        "Analysis button - analyses your weaknesses, areas for improvement, strengths, gives suggestions like a person...",
      potential: 10.0,
      importance: 10.0,
      complexity: 9.0,
      score: 9.65,
      priority: "MVP",
      priorityColor: "#7ED321",
    },
    {
      id: 11,
      feature: "Gamification",
      description:
        "develop a system of gamified features that keep the startups engaged (progress bars, badges, levels, rewards, +RESEARCH, animated characters)",
      potential: 9.33,
      importance: 9.33,
      complexity: 7.0,
      score: 8.52,
      priority: "MVP",
      priorityColor: "#7ED321",
    },
    {
      id: 12,
      feature: "Business evaluation",
      description: "advanced financial analysis prior to the funding process + person",
      potential: 8.67,
      importance: 7.33,
      complexity: 9.33,
      score: 8.37,
      priority: "Postpone",
      priorityColor: "#F5A623",
    },
    {
      id: 13,
      feature: "Video course",
      description: "educational part of the AI map",
      potential: 6.67,
      importance: 7.0,
      complexity: 5.33,
      score: 6.33,
      priority: "BETA",
      priorityColor: "#4A90E2",
    },
    {
      id: 14,
      feature: "Reporting hirarchy",
      description:
        "task level, weekly level, quarterly, yearly... plus they have to be automated, but founders can review them before sending + ON DEMAND reports",
      potential: 9.67,
      importance: 9.0,
      complexity: 8.33,
      score: 8.93,
      priority: "MVP",
      priorityColor: "#7ED321",
    },
    {
      id: 15,
      feature: "AI animated characters (anime girls)",
      description: "guiding through the platform (for Vito)",
      potential: 4.67,
      importance: 3.0,
      complexity: 3.67,
      score: 3.65,
      priority: "BETA",
      priorityColor: "#4A90E2",
    },
    {
      id: 16,
      feature: "Progress tracking",
      description: "set KPIs to follow + metrics to follow",
      potential: 9.33,
      importance: 9.67,
      complexity: 7.0,
      score: 8.65,
      priority: "MVP",
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
          backgroundColor: "#e8b4cb",
          padding: "15px 20px",
          borderRadius: "8px 8px 0 0",
          marginBottom: "0",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: "600",
            color: "#333",
          }}
        >
          Action Table
        </h1>
      </div>

      {/* Toolbar */}
      <div
        style={{
          backgroundColor: "white",
          padding: "12px 20px",
          borderBottom: "1px solid #e1e5e9",
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <button style={{ background: "none", border: "none", fontSize: "16px", cursor: "pointer" }}>↻</button>
        <button style={{ background: "none", border: "none", fontSize: "16px", cursor: "pointer" }}>⊞</button>
        <button style={{ background: "none", border: "none", fontSize: "16px", cursor: "pointer" }}>∇</button>
        <button style={{ background: "none", border: "none", fontSize: "16px", cursor: "pointer" }}>↕</button>
        <button style={{ background: "none", border: "none", fontSize: "16px", cursor: "pointer" }}>≡</button>
        <button style={{ background: "none", border: "none", fontSize: "16px", cursor: "pointer" }}>🔗</button>
      </div>

      {/* Table Container */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "0 0 8px 8px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {/* Table Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "40px 200px 350px 80px 80px 80px 80px 100px 60px",
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #e1e5e9",
            fontSize: "13px",
            fontWeight: "500",
            color: "#6c757d",
          }}
        >
          <div style={{ padding: "12px 8px", textAlign: "center" }}>⋮⋮</div>
          <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>📋</span> Feature
          </div>
          <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>≡</span> Description
          </div>
          <div style={{ padding: "12px 8px", textAlign: "center" }}># Potential</div>
          <div style={{ padding: "12px 8px", textAlign: "center" }}># Importance</div>
          <div style={{ padding: "12px 8px", textAlign: "center" }}># Complexity</div>
          <div style={{ padding: "12px 8px", textAlign: "center" }}># Score</div>
          <div style={{ padding: "12px 8px", textAlign: "center", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>⊙</span> Priority
          </div>
          <div style={{ padding: "12px 8px", textAlign: "center" }}># no</div>
        </div>

        {/* Table Body */}
        <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {actionTableData.map((row, index) => (
            <div
              key={row.id}
              style={{
                display: "grid",
                gridTemplateColumns: "40px 200px 350px 80px 80px 80px 80px 100px 60px",
                borderBottom: index < actionTableData.length - 1 ? "1px solid #f1f3f4" : "none",
                fontSize: "13px",
                backgroundColor: index % 2 === 0 ? "white" : "#fafbfc",
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
                <span style={{ fontSize: "10px", color: "#9aa0a6" }}>⋮</span>
                <span style={{ fontSize: "10px", color: "#9aa0a6" }}>⊞</span>
                <span style={{ fontSize: "10px", color: "#9aa0a6" }}>⊟</span>
              </div>

              {/* Feature */}
              <div
                style={{
                  padding: "12px 16px",
                  fontWeight: "500",
                  color: "#202124",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {row.feature}
              </div>

              {/* Description */}
              <div
                style={{
                  padding: "12px 16px",
                  color: "#5f6368",
                  lineHeight: "1.4",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {row.description}
              </div>

              {/* Potential */}
              <div
                style={{
                  padding: "12px 8px",
                  textAlign: "center",
                  color: "#202124",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {row.potential.toFixed(2)}
              </div>

              {/* Importance */}
              <div
                style={{
                  padding: "12px 8px",
                  textAlign: "center",
                  color: "#202124",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {row.importance.toFixed(2)}
              </div>

              {/* Complexity */}
              <div
                style={{
                  padding: "12px 8px",
                  textAlign: "center",
                  color: "#202124",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {row.complexity.toFixed(2)}
              </div>

              {/* Score */}
              <div
                style={{
                  padding: "12px 8px",
                  textAlign: "center",
                  color: "#202124",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {row.score.toFixed(2)}
              </div>

              {/* Priority */}
              <div
                style={{
                  padding: "12px 8px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    backgroundColor: row.priorityColor,
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: "500",
                  }}
                >
                  {row.priority}
                </span>
              </div>

              {/* Number */}
              <div
                style={{
                  padding: "12px 8px",
                  textAlign: "center",
                  color: "#5f6368",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {row.id}
              </div>
            </div>
          ))}
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
