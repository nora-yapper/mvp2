"use client"

import { useState, useEffect } from "react"

interface HomebaseComponent {
  id: string
  title: string
  content: string
}

export default function HomebaseTaskPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentComponent, setCurrentComponent] = useState<HomebaseComponent | null>(null)
  const [editedContent, setEditedContent] = useState("")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const componentId = params.get("component")

    if (componentId) {
      // Load components from session storage
      const storedComponents = sessionStorage.getItem("homebaseComponents")
      if (storedComponents) {
        const components: HomebaseComponent[] = JSON.parse(storedComponents)
        const component = components.find((c) => c.id === componentId)
        if (component) {
          setCurrentComponent(component)
          setEditedContent(component.content)
        }
      }
    }
  }, [])

  const handleSave = () => {
    if (!currentComponent) return

    // Load current components
    const storedComponents = sessionStorage.getItem("homebaseComponents")
    if (storedComponents) {
      const components: HomebaseComponent[] = JSON.parse(storedComponents)
      const updatedComponents = components.map((c) =>
        c.id === currentComponent.id ? { ...c, content: editedContent } : c,
      )

      // Save back to session storage
      sessionStorage.setItem("homebaseComponents", JSON.stringify(updatedComponents))

      // Update current component
      setCurrentComponent({ ...currentComponent, content: editedContent })
    }
  }

  const handleBack = () => {
    window.location.href = "/homebase"
  }

  if (!currentComponent) {
    return <div>Loading...</div>
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

        {/* Component Title */}
        <h2 style={{ marginLeft: "20px", fontSize: "18px", color: "#333" }}>{currentComponent.title}</h2>
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
          {currentComponent.title.toUpperCase()}
        </h1>

        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div
            style={{
              backgroundColor: "#2a2a2a",
              color: "#e0e0e0",
              padding: "40px",
              borderRadius: "8px",
              marginBottom: "30px",
            }}
          >
            <h3 style={{ fontSize: "24px", marginBottom: "20px", color: "#fff" }}>Edit Content</h3>
            <p style={{ marginBottom: "20px", lineHeight: "1.6" }}>
              Use this space to add detailed information about your startup. You can include company description,
              mission, vision, team information, or any other relevant details.
            </p>

            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>Content</label>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "300px",
                  padding: "15px",
                  backgroundColor: "#1a1a1a",
                  color: "#e0e0e0",
                  border: "1px solid #444",
                  borderRadius: "4px",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
                placeholder="Enter your content here..."
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleSave}
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
                Save Changes
              </button>
              <button
                onClick={handleBack}
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
                Back to Homebase
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div
            style={{
              backgroundColor: "#2a2a2a",
              color: "#e0e0e0",
              padding: "40px",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ fontSize: "24px", marginBottom: "20px", color: "#fff" }}>Preview</h3>
            <div
              style={{
                backgroundColor: "#1a1a1a",
                padding: "20px",
                borderRadius: "4px",
                border: "1px solid #444",
                minHeight: "100px",
                whiteSpace: "pre-wrap",
                lineHeight: "1.6",
              }}
            >
              {editedContent || "Your content will appear here..."}
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
