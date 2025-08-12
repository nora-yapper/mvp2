"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"

interface HomebaseComponent {
  id: string
  title: string
  content: string
  createdAt: string
}

const HomebasePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [components, setComponents] = useState<HomebaseComponent[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newComponentTitle, setNewComponentTitle] = useState("")

  useEffect(() => {
    // Load components from session storage
    const storedComponents = sessionStorage.getItem("homebaseComponents")
    if (storedComponents) {
      setComponents(JSON.parse(storedComponents))
    } else {
      // Initialize with default components using uuid
      const defaultComponents: HomebaseComponent[] = [
        {
          id: uuidv4(),
          title: "Company Overview",
          content: "Add your company description, mission, and vision here.",
          createdAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          title: "Team Information",
          content: "Describe your team members, roles, and expertise.",
          createdAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          title: "Product Details",
          content: "Outline your product features, benefits, and roadmap.",
          createdAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          title: "Market Analysis",
          content: "Include market research, target audience, and competitive analysis.",
          createdAt: new Date().toISOString(),
        },
      ]
      setComponents(defaultComponents)
      sessionStorage.setItem("homebaseComponents", JSON.stringify(defaultComponents))
    }
  }, [])

  const addNewComponent = () => {
    if (newComponentTitle.trim()) {
      const newComponent: HomebaseComponent = {
        id: uuidv4(),
        title: newComponentTitle,
        content: "Click to edit this component and add your content.",
        createdAt: new Date().toISOString(),
      }

      const updatedComponents = [...components, newComponent]
      setComponents(updatedComponents)
      sessionStorage.setItem("homebaseComponents", JSON.stringify(updatedComponents))

      setNewComponentTitle("")
      setShowAddModal(false)
    }
  }

  const deleteComponent = (id: string) => {
    const updatedComponents = components.filter((comp) => comp.id !== id)
    setComponents(updatedComponents)
    sessionStorage.setItem("homebaseComponents", JSON.stringify(updatedComponents))
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

        {/* Title */}
        <h2 style={{ marginLeft: "20px", fontSize: "18px", color: "#333" }}>Homebase</h2>

        {/* Add Component Button */}
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            marginLeft: "auto",
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          + Add Component
        </button>
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
            onClick={() => (window.location.href = "/homebase")}
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

        {/* Components Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {components.map((component) => (
            <div
              key={component.id}
              style={{
                backgroundColor: "#2a2a2a",
                borderRadius: "8px",
                padding: "30px",
                border: "1px solid #444",
                position: "relative",
                cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
              onClick={() => {
                window.location.href = `/homebase/task?component=${component.id}`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteComponent(component.id)
                }}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "none",
                  border: "none",
                  color: "#dc3545",
                  fontSize: "18px",
                  cursor: "pointer",
                  padding: "5px",
                }}
              >
                ×
              </button>

              <h3
                style={{
                  fontSize: "20px",
                  color: "#fff",
                  marginBottom: "15px",
                  paddingRight: "30px",
                }}
              >
                {component.title}
              </h3>
              <p
                style={{
                  color: "#ccc",
                  lineHeight: "1.6",
                  marginBottom: "15px",
                }}
              >
                {component.content}
              </p>
              <div
                style={{
                  fontSize: "12px",
                  color: "#888",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>ID: {component.id.slice(0, 8)}...</span>
                <span>{new Date(component.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        {components.length === 0 && (
          <div style={{ textAlign: "center", marginTop: "60px" }}>
            <p style={{ fontSize: "18px", color: "#666", marginBottom: "20px" }}>
              No components yet. Add your first component to get started!
            </p>
          </div>
        )}
      </div>

      {/* Add Component Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              backgroundColor: "#2a2a2a",
              color: "#e0e0e0",
              padding: "40px",
              borderRadius: "8px",
              maxWidth: "500px",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: "24px", color: "#fff", marginBottom: "20px" }}>Add New Component</h3>
            <input
              type="text"
              value={newComponentTitle}
              onChange={(e) => setNewComponentTitle(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addNewComponent()}
              placeholder="Enter component title..."
              style={{
                width: "100%",
                padding: "15px",
                backgroundColor: "#1a1a1a",
                color: "#e0e0e0",
                border: "1px solid #444",
                borderRadius: "4px",
                fontSize: "16px",
                marginBottom: "20px",
              }}
            />
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={addNewComponent}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Add Component
              </button>
            </div>
          </div>
        </div>
      )}

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

export default HomebasePage
