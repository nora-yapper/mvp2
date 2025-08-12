"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"

interface HomebaseComponent {
  id: string
  title: string
  content: string
}

export default function HomebaseWorkspacePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [components, setComponents] = useState<HomebaseComponent[]>([])
  const [tasks, setTasks] = useState([])

  // Load components from session storage on mount
  useEffect(() => {
    const storedComponents = sessionStorage.getItem("homebaseComponents")
    if (storedComponents) {
      setComponents(JSON.parse(storedComponents))
    } else {
      // Initialize with comprehensive "About Your Startup" component
      const defaultComponent: HomebaseComponent = {
        id: "about-startup", // Keep this as is since it's a special component
        title: "About Your Startup",
        content: JSON.stringify({
          basicInfo: {
            startupName: "",
            shortDescription: "",
            industrySector: "",
            stage: "Idea",
            teamMembers: "",
          },
          motivation: "",
          assets: {
            website: "",
            pitchDeck: "",
            otherWorkspaces: "",
          },
        }),
      }
      setComponents([defaultComponent])
      sessionStorage.setItem("homebaseComponents", JSON.stringify([defaultComponent]))
    }
  }, [])

  // Save components to session storage whenever components change
  useEffect(() => {
    if (components.length > 0) {
      sessionStorage.setItem("homebaseComponents", JSON.stringify(components))
    }
  }, [components])

  useEffect(() => {
    const loadTasks = () => {
      const savedTasks = localStorage.getItem("commandDeckTasks")
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks))
      }
    }

    loadTasks()

    // Listen for storage changes to update tasks in real-time
    const handleStorageChange = () => {
      loadTasks()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const addNewComponent = () => {
    const newComponent: HomebaseComponent = {
      id: uuidv4(),
      title: "New Component",
      content: "Enter your content here.",
    }
    setComponents([...components, newComponent])
  }

  const updateComponentTitle = (id: string, newTitle: string) => {
    setComponents(components.map((comp) => (comp.id === id ? { ...comp, title: newTitle } : comp)))
  }

  const handleComponentClick = (component: HomebaseComponent) => {
    window.location.href = `/homebase/task?component=${component.id}`
  }

  const handleBackToMain = () => {
    window.location.href = "/main"
  }

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
          onClick={handleBackToMain}
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
        <h2 style={{ marginLeft: "20px", fontSize: "18px", color: "#333" }}>Homebase Workspace</h2>
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
          HOMEBASE
        </h1>

        {/* Scrollable Content Area */}
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            maxHeight: "calc(100vh - 200px)",
            overflowY: "auto",
            paddingRight: "10px",
          }}
        >
          {/* Components Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            {components.map((component) => (
              <div
                key={component.id}
                style={{
                  backgroundColor: "#2a2a2a",
                  border: "1px solid #444",
                  borderRadius: "8px",
                  padding: "20px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  minHeight: "150px",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={() => handleComponentClick(component)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#3a3a3a"
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#2a2a2a"
                  e.currentTarget.style.transform = "translateY(0px)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                <input
                  type="text"
                  value={component.title}
                  onChange={(e) => {
                    e.stopPropagation()
                    updateComponentTitle(component.id, e.target.value)
                  }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#fff",
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginBottom: "15px",
                    outline: "none",
                    width: "100%",
                  }}
                />
                <div
                  style={{
                    color: "#ccc",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {component.id === "about-startup"
                    ? (() => {
                        try {
                          const data = JSON.parse(component.content)
                          return (
                            <div>
                              <div>
                                <strong>Name:</strong> {data.basicInfo?.startupName || "Not specified"}
                              </div>
                              <div>
                                <strong>Description:</strong> {data.basicInfo?.shortDescription || "Not specified"}
                              </div>
                              <div>
                                <strong>Industry:</strong> {data.basicInfo?.industrySector || "Not specified"}
                              </div>
                              <div>
                                <strong>Stage:</strong> {data.basicInfo?.stage || "Idea"}
                              </div>
                            </div>
                          )
                        } catch {
                          return "Click to add your startup information"
                        }
                      })()
                    : component.content}
                </div>
              </div>
            ))}

            {/* Command Deck Tasks Component */}
            <div
              style={{
                backgroundColor: "#2a2a2a",
                border: "1px solid #444",
                borderRadius: "8px",
                padding: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                minHeight: "150px",
                display: "flex",
                flexDirection: "column",
              }}
              onClick={() => (window.location.href = "/homebase/tasks")}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#3a3a3a"
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#2a2a2a"
                e.currentTarget.style.transform = "translateY(0px)"
                e.currentTarget.style.boxShadow = "none"
              }}
            >
              <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: "bold", marginBottom: "15px" }}>
                Command Deck Tasks
              </h3>
              <div style={{ color: "#ccc", fontSize: "14px", lineHeight: "1.5", flex: 1 }}>
                {tasks.length > 0 ? (
                  <div>
                    <div>
                      <strong>Active Tasks:</strong> {tasks.filter((t) => t.status === "pending").length}
                    </div>
                    <div>
                      <strong>Total Tasks:</strong> {tasks.length}
                    </div>
                    <div style={{ marginTop: "10px", fontSize: "12px", color: "#888" }}>
                      Recent:{" "}
                      {tasks
                        .slice(-2)
                        .map((t) => t.title.substring(0, 30) + "...")
                        .join(", ")}
                    </div>
                  </div>
                ) : (
                  "No tasks yet. Implement suggestions from Forecast to add tasks here."
                )}
              </div>
            </div>

            {/* Add New Component Button */}
            <div
              onClick={addNewComponent}
              style={{
                backgroundColor: "#2a2a2a",
                border: "2px dashed #666",
                borderRadius: "8px",
                padding: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                minHeight: "150px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#3a3a3a"
                e.currentTarget.style.borderColor = "#888"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#2a2a2a"
                e.currentTarget.style.borderColor = "#666"
              }}
            >
              <div
                style={{
                  fontSize: "48px",
                  color: "#666",
                  marginBottom: "10px",
                }}
              >
                +
              </div>
              <div
                style={{
                  color: "#888",
                  fontSize: "16px",
                  textAlign: "center",
                }}
              >
                Add New Component
              </div>
            </div>
          </div>
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
