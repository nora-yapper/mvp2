"use client"

import { useState, useEffect } from "react"
import { Check, Clock, User, Trash2, Edit2 } from "lucide-react"

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

export default function CommandDeckTasksPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

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

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks)
    localStorage.setItem("commandDeckTasks", JSON.stringify(updatedTasks))
  }

  const toggleTaskStatus = (taskId: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: task.status === "pending" ? "completed" : ("pending" as const) } : task,
    )
    saveTasks(updatedTasks)
  }

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId)
    saveTasks(updatedTasks)
  }

  const handleEditTask = (taskId: string, currentTitle: string) => {
    setEditingTask(taskId)
    setEditText(currentTitle)
  }

  const saveTaskEdit = (taskId: string) => {
    const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, title: editText } : task))
    saveTasks(updatedTasks)
    setEditingTask(null)
    setEditText("")
  }

  const handleBackToWorkspace = () => {
    window.location.href = "/homebase/workspace"
  }

  const pendingTasks = tasks.filter((task) => task.status === "pending")
  const completedTasks = tasks.filter((task) => task.status === "completed")

  return (
    <div style={{ minHeight: "100vh", position: "relative", backgroundColor: "#1a1a1a" }}>
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
          onClick={handleBackToWorkspace}
          style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          ←
        </button>

        {/* Title */}
        <h2 style={{ marginLeft: "20px", fontSize: "18px", color: "#333" }}>Command Deck Tasks</h2>
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
            onClick={() => (window.location.href = "/homebase/workspace")}
            style={{
              padding: "15px",
              fontSize: "16px",
              cursor: "pointer",
              border: "1px solid #ccc",
              backgroundColor: "#007bff",
              color: "white",
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
      <div
        style={{
          marginTop: "60px",
          padding: "40px 20px",
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
            letterSpacing: "0.1em",
          }}
        >
          COMMAND DECK
        </h1>

        {/* Task Statistics */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", marginBottom: "40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
            <div
              style={{
                backgroundColor: "#2a2a2a",
                border: "1px solid #444",
                borderRadius: "8px",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <h3 style={{ color: "#007bff", fontSize: "24px", margin: "0 0 8px 0" }}>{pendingTasks.length}</h3>
              <p style={{ color: "#ccc", margin: "0" }}>Pending Tasks</p>
            </div>
            <div
              style={{
                backgroundColor: "#2a2a2a",
                border: "1px solid #444",
                borderRadius: "8px",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <h3 style={{ color: "#22c55e", fontSize: "24px", margin: "0 0 8px 0" }}>{completedTasks.length}</h3>
              <p style={{ color: "#ccc", margin: "0" }}>Completed Tasks</p>
            </div>
            <div
              style={{
                backgroundColor: "#2a2a2a",
                border: "1px solid #444",
                borderRadius: "8px",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <h3 style={{ color: "#e0e0e0", fontSize: "24px", margin: "0 0 8px 0" }}>{tasks.length}</h3>
              <p style={{ color: "#ccc", margin: "0" }}>Total Tasks</p>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {tasks.length === 0 ? (
            <div
              style={{
                backgroundColor: "#2a2a2a",
                border: "1px solid #444",
                borderRadius: "8px",
                padding: "40px",
                textAlign: "center",
              }}
            >
              <h3 style={{ color: "#666", fontSize: "24px", marginBottom: "16px" }}>No Tasks Yet</h3>
              <p style={{ color: "#999", marginBottom: "20px" }}>
                Tasks from Forecast implementations will appear here.
              </p>
              <button
                onClick={() => (window.location.href = "/forecast")}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#007bff",
                  border: "none",
                  color: "white",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Go to Forecast
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Pending Tasks */}
              {pendingTasks.length > 0 && (
                <div>
                  <h2 style={{ color: "#e0e0e0", fontSize: "24px", marginBottom: "20px" }}>
                    Pending Tasks ({pendingTasks.length})
                  </h2>
                  {pendingTasks.map((task) => (
                    <div
                      key={task.id}
                      style={{
                        backgroundColor: "#2a2a2a",
                        border: "1px solid #444",
                        borderRadius: "8px",
                        padding: "20px",
                        marginBottom: "12px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            border: "2px solid #007bff",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            marginTop: "2px",
                          }}
                        >
                          {task.status === "completed" && <Check size={14} color="#007bff" />}
                        </button>

                        <div style={{ flex: 1 }}>
                          {editingTask === task.id ? (
                            <div style={{ marginBottom: "12px" }}>
                              <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                style={{
                                  width: "100%",
                                  minHeight: "60px",
                                  padding: "12px",
                                  backgroundColor: "#1a1a1a",
                                  border: "1px solid #444",
                                  color: "#e0e0e0",
                                  fontSize: "14px",
                                  resize: "vertical",
                                  outline: "none",
                                }}
                              />
                              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                                <button
                                  onClick={() => saveTaskEdit(task.id)}
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
                                    setEditingTask(null)
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
                                  {task.title}
                                </p>
                                <div style={{ display: "flex", gap: "8px", marginLeft: "12px" }}>
                                  <button
                                    onClick={() => handleEditTask(task.id, task.title)}
                                    style={{
                                      background: "transparent",
                                      border: "none",
                                      color: "#999",
                                      cursor: "pointer",
                                      padding: "4px",
                                    }}
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => deleteTask(task.id)}
                                    style={{
                                      background: "transparent",
                                      border: "none",
                                      color: "#ef4444",
                                      cursor: "pointer",
                                      padding: "4px",
                                    }}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          <div style={{ display: "flex", gap: "20px", fontSize: "14px", color: "#999" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <User size={14} />
                              {task.assignee}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <Clock size={14} />
                              {task.deadline}
                            </div>
                            <div style={{ fontSize: "12px", color: "#666" }}>From: {task.source}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <div style={{ marginTop: "40px" }}>
                  <h2 style={{ color: "#e0e0e0", fontSize: "24px", marginBottom: "20px" }}>
                    Completed Tasks ({completedTasks.length})
                  </h2>
                  {completedTasks.map((task) => (
                    <div
                      key={task.id}
                      style={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #333",
                        borderRadius: "8px",
                        padding: "20px",
                        marginBottom: "12px",
                        opacity: 0.7,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            border: "2px solid #22c55e",
                            backgroundColor: "#22c55e",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            marginTop: "2px",
                          }}
                        >
                          <Check size={14} color="white" />
                        </button>

                        <div style={{ flex: 1 }}>
                          <div style={{ marginBottom: "12px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <p
                                style={{
                                  fontSize: "16px",
                                  color: "#ccc",
                                  margin: "0",
                                  lineHeight: "1.4",
                                  flex: 1,
                                  textDecoration: "line-through",
                                }}
                              >
                                {task.title}
                              </p>
                              <button
                                onClick={() => deleteTask(task.id)}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: "#ef4444",
                                  cursor: "pointer",
                                  padding: "4px",
                                  marginLeft: "12px",
                                }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: "20px", fontSize: "14px", color: "#666" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <User size={14} />
                              {task.assignee}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <Clock size={14} />
                              {task.deadline}
                            </div>
                            <div style={{ fontSize: "12px", color: "#555" }}>From: {task.source}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 998,
          }}
        />
      )}
    </div>
  )
}
