"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface HomebaseComponent {
  id: string
  title: string
  content: string
}

export default function HomebasePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [components, setComponents] = useState<HomebaseComponent[]>([
    {
      id: "about-startup",
      title: "About Your Startup",
      content: "Enter information about your startup here.",
    },
  ])

  // Load components from session storage
  useEffect(() => {
    const storedComponents = sessionStorage.getItem("homebaseComponents")
    if (storedComponents) {
      setComponents(JSON.parse(storedComponents))
    }
  }, [])

  // Save components to session storage whenever they change
  useEffect(() => {
    sessionStorage.setItem("homebaseComponents", JSON.stringify(components))
  }, [components])

  const addNewComponent = () => {
    const newComponent: HomebaseComponent = {
      id: `component-${Date.now()}`,
      title: "New Component",
      content: "Enter your content here.",
    }
    setComponents([...components, newComponent])
  }

  const updateComponent = (id: string, updates: Partial<HomebaseComponent>) => {
    setComponents(components.map((comp) => (comp.id === id ? { ...comp, ...updates } : comp)))
  }

  const deleteComponent = (id: string) => {
    if (components.length > 1) {
      // Don't allow deleting the last component
      setComponents(components.filter((comp) => comp.id !== id))
    }
  }

  const handleTaskClick = (componentId: string) => {
    window.location.href = `/homebase/task?component=${componentId}`
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(`section-${sectionId}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
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

  const ComponentSection = ({ component, index }: { component: HomebaseComponent; index: number }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editTitle, setEditTitle] = useState(component.title)

    const handleTitleSave = () => {
      updateComponent(component.id, { title: editTitle })
      setIsEditing(false)
    }

    const handleTitleCancel = () => {
      setEditTitle(component.title)
      setIsEditing(false)
    }

    return (
      <div
        id={`section-${component.id}`}
        style={{
          backgroundColor: "#1a1a1a",
          minHeight: "100vh",
          padding: "60px 40px",
          position: "relative",
        }}
      >
        {/* Component Title */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "60px" }}>
          {isEditing ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{
                  fontSize: "3.5rem",
                  color: "#666",
                  fontWeight: "bold",
                  letterSpacing: "0.1em",
                  backgroundColor: "#2a2a2a",
                  border: "2px solid #444",
                  borderRadius: "4px",
                  padding: "10px",
                  textAlign: index % 2 === 0 ? "left" : "right",
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleTitleSave()
                  if (e.key === "Escape") handleTitleCancel()
                }}
                autoFocus
              />
              <button
                onClick={handleTitleSave}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                ✓
              </button>
              <button
                onClick={handleTitleCancel}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          ) : (
            <h1
              onClick={() => setIsEditing(true)}
              style={{
                fontSize: "3.5rem",
                color: "#666",
                fontWeight: "bold",
                letterSpacing: "0.1em",
                textAlign: index % 2 === 0 ? "left" : "right",
                cursor: "pointer",
                flex: 1,
                margin: 0,
              }}
            >
              {component.title.toUpperCase()}
            </h1>
          )}

          {/* Delete button (only show if more than one component) */}
          {components.length > 1 && (
            <button
              onClick={() => deleteComponent(component.id)}
              style={{
                marginLeft: "20px",
                padding: "8px 12px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Delete
            </button>
          )}
        </div>

        {/* Component Content */}
        <div style={{ maxWidth: "800px", margin: index % 2 === 0 ? "0" : "0 0 0 auto" }}>
          <GeometricCard
            clickable={true}
            onClick={() => handleTaskClick(component.id)}
            style={{ fontSize: "18px", lineHeight: "1.6" }}
          >
            <h3 style={{ fontSize: "20px", marginBottom: "15px", color: "#fff" }}>{component.title}</h3>
            <p style={{ marginBottom: "20px" }}>{component.content}</p>
          </GeometricCard>
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
          onClick={() => (window.location.href = "/main")}
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
          {components.map((component) => (
            <button
              key={component.id}
              onClick={() => scrollToSection(component.id)}
              style={{
                padding: "5px 10px",
                fontSize: "12px",
                cursor: "pointer",
                border: "1px solid #ccc",
                backgroundColor: "white",
                borderRadius: "4px",
              }}
            >
              {component.title}
            </button>
          ))}
        </div>

        {/* Add Component Button */}
        <button
          onClick={addNewComponent}
          style={{
            marginLeft: "auto",
            padding: "8px 16px",
            fontSize: "16px",
            cursor: "pointer",
            border: "1px solid #007bff",
            backgroundColor: "#007bff",
            color: "white",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
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

      {/* Main Content - Scrollable Sections */}
      <div style={{ marginTop: "60px" }}>
        {components.map((component, index) => (
          <ComponentSection key={component.id} component={component} index={index} />
        ))}
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
