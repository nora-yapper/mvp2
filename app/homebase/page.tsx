"use client"

import { useState, useEffect } from "react"

export default function CommandDeckPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [missionText, setMissionText] = useState("")

  interface Task {
    id: string
    title: string
    assignee: string
    deadline: string
    status: "pending" | "completed"
    priority: "low" | "medium" | "high"
    source: string
    createdAt: string
  }

  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const loadTasks = () => {
      const savedTasks = localStorage.getItem("commandDeckTasks")
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks))
      }
    }

    loadTasks()

    // Listen for storage changes
    const handleStorageChange = () => {
      loadTasks()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  return (
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
            { label: "Command Deck", onClick: () => {}, active: true },
            { label: "Health Analysis", onClick: () => (window.location.href = "/health-check"), active: false },
            { label: "Forecast", onClick: () => (window.location.href = "/forecast"), active: false },
            { label: "Reports", onClick: () => (window.location.href = "/reports"), active: false },
            { label: "Network", onClick: () => (window.location.href = "/network"), active: false },
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
      <div style={{ padding: "40px 60px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "400", margin: "0", color: "#e0e0e0" }}>Command Deck</h1>
        <button
          style={{
            padding: "12px 24px",
            backgroundColor: "#2a2a2a",
            border: "1px solid #444",
            color: "#e0e0e0",
            fontSize: "16px",
            cursor: "pointer",
            clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
            fontWeight: "500",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#3a3a3a"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#2a2a2a"
          }}
        >
          Recalibrate
        </button>
      </div>

      {/* Set Your Mission */}
      <div style={{ padding: "40px 60px 60px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "500", margin: "0 0 30px 0", color: "#e0e0e0" }}>
          Set Your Mission
        </h2>
        <textarea
          value={missionText}
          onChange={(e) => setMissionText(e.target.value)}
          placeholder="Describe your big goal..."
          style={{
            width: "100%",
            height: "120px",
            padding: "20px",
            backgroundColor: "#2a2a2a",
            border: "1px solid #444",
            color: "#e0e0e0",
            fontSize: "16px",
            resize: "none",
            clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
            outline: "none",
            marginBottom: "20px",
          }}
        />
        <button
          style={{
            padding: "12px 24px",
            backgroundColor: "#007bff",
            border: "1px solid #0056b3",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
            clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
            fontWeight: "500",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#0056b3"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#007bff"
          }}
        >
          Generate Plan
        </button>
      </div>

      {/* Your Current Plan */}
      <div style={{ padding: "0 60px 60px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "500", margin: "0 0 30px 0", color: "#e0e0e0" }}>
          Your Current Plan
        </h2>

        <div
          style={{
            backgroundColor: "#2a2a2a",
            border: "1px solid #444",
            clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
            overflow: "hidden",
          }}
        >
          {/* Plan Views Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "24px 30px",
              borderBottom: "1px solid #444",
            }}
          >
            <h3 style={{ fontSize: "20px", fontWeight: "500", margin: "0", color: "#e0e0e0" }}>Active Tasks</h3>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#999", fontSize: "14px" }}>
                <span>{tasks.filter((t) => t.status === "pending").length} pending</span>
                <span>•</span>
                <span>{tasks.filter((t) => t.status === "completed").length} completed</span>
              </div>
              <button
                onClick={() => (window.location.href = "/homebase/tasks")}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#007bff",
                  border: "1px solid #0056b3",
                  color: "white",
                  fontSize: "14px",
                  cursor: "pointer",
                  clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                  fontWeight: "500",
                }}
              >
                View All Tasks
              </button>
            </div>
          </div>

          {/* Tasks List */}
          <div style={{ padding: "24px 30px" }}>
            {tasks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
                <h4 style={{ fontSize: "18px", marginBottom: "12px", color: "#666" }}>No Active Tasks</h4>
                <p style={{ fontSize: "14px", marginBottom: "20px", color: "#999" }}>
                  Generate a plan or implement suggestions from Forecast to see tasks here.
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                  <button
                    onClick={() => (window.location.href = "/forecast")}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #444",
                      color: "#e0e0e0",
                      fontSize: "14px",
                      cursor: "pointer",
                      clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                    }}
                  >
                    Go to Forecast
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Show pending tasks first */}
                {tasks
                  .filter((task) => task.status === "pending")
                  .slice(0, 5) // Show only first 5 pending tasks
                  .map((task, index) => (
                    <div
                      key={task.id}
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
                            backgroundColor:
                              task.priority === "high" ? "#ef4444" : task.priority === "medium" ? "#eab308" : "#6b7280",
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
                          <p
                            style={{
                              fontSize: "16px",
                              color: "#e0e0e0",
                              margin: "0 0 12px 0",
                              lineHeight: "1.4",
                            }}
                          >
                            {task.title}
                          </p>
                          <div style={{ display: "flex", gap: "20px", fontSize: "14px", color: "#999" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <span>👤</span>
                              {task.assignee}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <span>📅</span>
                              {task.deadline}
                            </div>
                            <div style={{ fontSize: "12px", color: "#666" }}>From: {task.source}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Show recently completed tasks */}
                {tasks.filter((task) => task.status === "completed").length > 0 && (
                  <div style={{ marginTop: "20px" }}>
                    <h4 style={{ fontSize: "16px", color: "#999", marginBottom: "12px" }}>Recently Completed</h4>
                    {tasks
                      .filter((task) => task.status === "completed")
                      .slice(0, 3) // Show only 3 most recent completed tasks
                      .map((task) => (
                        <div
                          key={task.id}
                          style={{
                            backgroundColor: "#0f1419",
                            border: "1px solid #2a2a2a",
                            clipPath:
                              "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                            padding: "16px",
                            marginBottom: "8px",
                            opacity: 0.7,
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div
                              style={{
                                backgroundColor: "#22c55e",
                                color: "white",
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                flexShrink: 0,
                              }}
                            >
                              ✓
                            </div>
                            <p
                              style={{
                                fontSize: "14px",
                                color: "#999",
                                margin: "0",
                                textDecoration: "line-through",
                                flex: 1,
                              }}
                            >
                              {task.title}
                            </p>
                            <span style={{ fontSize: "12px", color: "#666" }}>{task.assignee}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {/* Show more tasks indicator */}
                {tasks.filter((task) => task.status === "pending").length > 5 && (
                  <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <button
                      onClick={() => (window.location.href = "/homebase/tasks")}
                      style={{
                        padding: "12px 24px",
                        backgroundColor: "#2a2a2a",
                        border: "1px solid #444",
                        color: "#e0e0e0",
                        fontSize: "14px",
                        cursor: "pointer",
                        clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                      }}
                    >
                      View {tasks.filter((task) => task.status === "pending").length - 5} More Tasks
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Team Workload */}
      <div style={{ padding: "0 60px 60px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "500", margin: "0 0 30px 0", color: "#e0e0e0" }}>Team Workload</h2>

        <div
          style={{
            backgroundColor: "#2a2a2a",
            border: "1px solid #444",
            clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
            padding: "30px",
          }}
        >
          {/* Team Members */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {[
              { name: "Sarah Chen", percentage: 45, status: "Underloaded", color: "#eab308" },
              { name: "Alex Johnson", percentage: 75, status: "Balanced", color: "#22c55e" },
              { name: "Mike Rodriguez", percentage: 92, status: "Overloaded", color: "#ef4444" },
              { name: "Emily Davis", percentage: 68, status: "Balanced", color: "#22c55e" },
              { name: "James Wilson", percentage: 34, status: "Underloaded", color: "#eab308" },
            ].map((member, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div style={{ width: "150px" }}>
                  <h4 style={{ fontSize: "16px", fontWeight: "500", margin: "0", color: "#e0e0e0" }}>{member.name}</h4>
                </div>
                <div style={{ flex: 1, position: "relative" }}>
                  <div
                    style={{
                      width: "100%",
                      height: "12px",
                      backgroundColor: "#1a1a1a",
                      clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${member.percentage}%`,
                        height: "100%",
                        backgroundColor: "#007bff",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>
                <div style={{ width: "120px", textAlign: "right" }}>
                  <span style={{ color: member.color, fontSize: "14px", fontWeight: "500" }}>{member.status}</span>
                </div>
                <div style={{ width: "50px", textAlign: "right" }}>
                  <span style={{ color: "#e0e0e0", fontSize: "14px", fontWeight: "500" }}>{member.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
