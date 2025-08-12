"use client"

import { useState, useEffect } from "react"

interface HomebaseComponent {
  id: string
  title: string
  content: string
}

interface StartupData {
  basicInfo: {
    startupName: string
    shortDescription: string
    industrySector: string
    stage: string
    teamMembers: string
  }
  motivation: string
  assets: {
    website: string
    pitchDeck: string
    otherWorkspaces: string
  }
}

export default function HomebaseTaskPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentComponent, setCurrentComponent] = useState<HomebaseComponent | null>(null)
  const [editedContent, setEditedContent] = useState("")
  const [startupData, setStartupData] = useState<StartupData | null>(null)

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

          // Handle structured data for "About Your Startup"
          if (component.id === "about-startup") {
            try {
              const parsedData = JSON.parse(component.content)
              setStartupData(parsedData)
            } catch {
              // Initialize with empty structure if parsing fails
              const emptyData: StartupData = {
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
              }
              setStartupData(emptyData)
            }
          } else {
            setEditedContent(component.content)
          }
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

      let updatedComponents
      if (currentComponent.id === "about-startup" && startupData) {
        // Save structured data as JSON string
        updatedComponents = components.map((c) =>
          c.id === currentComponent.id ? { ...c, content: JSON.stringify(startupData) } : c,
        )
        setCurrentComponent({ ...currentComponent, content: JSON.stringify(startupData) })
      } else {
        // Save regular text content
        updatedComponents = components.map((c) => (c.id === currentComponent.id ? { ...c, content: editedContent } : c))
        setCurrentComponent({ ...currentComponent, content: editedContent })
      }

      // Save back to session storage
      sessionStorage.setItem("homebaseComponents", JSON.stringify(updatedComponents))
    }
  }

  const handleBack = () => {
    window.location.href = "/homebase/workspace"
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
            {currentComponent.id === "about-startup" && startupData ? (
              // Structured form for "About Your Startup"
              <div>
                <h3 style={{ fontSize: "24px", marginBottom: "30px", color: "#fff" }}>About Your Startup</h3>

                {/* Basic Info Section */}
                <div style={{ marginBottom: "40px" }}>
                  <h4
                    style={{
                      fontSize: "20px",
                      marginBottom: "20px",
                      color: "#fff",
                      borderBottom: "1px solid #444",
                      paddingBottom: "10px",
                    }}
                  >
                    Basic Info
                  </h4>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#ccc" }}>
                      Startup Name
                    </label>
                    <p style={{ fontSize: "14px", color: "#888", marginBottom: "8px" }}>
                      What are you calling your startup (for now)?
                    </p>
                    <input
                      type="text"
                      value={startupData.basicInfo.startupName}
                      onChange={(e) =>
                        setStartupData({
                          ...startupData,
                          basicInfo: { ...startupData.basicInfo, startupName: e.target.value },
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: "#1a1a1a",
                        color: "#e0e0e0",
                        border: "1px solid #444",
                        borderRadius: "4px",
                        fontSize: "14px",
                      }}
                      placeholder="Enter your startup name"
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#ccc" }}>
                      Short Description
                    </label>
                    <p style={{ fontSize: "14px", color: "#888", marginBottom: "8px" }}>
                      A one-liner that explains what your startup does - think simple and clear. (e.g. "A tool that
                      helps freelancers track payments.")
                    </p>
                    <textarea
                      value={startupData.basicInfo.shortDescription}
                      onChange={(e) =>
                        setStartupData({
                          ...startupData,
                          basicInfo: { ...startupData.basicInfo, shortDescription: e.target.value },
                        })
                      }
                      style={{
                        width: "100%",
                        minHeight: "80px",
                        padding: "12px",
                        backgroundColor: "#1a1a1a",
                        color: "#e0e0e0",
                        border: "1px solid #444",
                        borderRadius: "4px",
                        fontSize: "14px",
                        resize: "vertical",
                      }}
                      placeholder="Describe what your startup does in one line"
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#ccc" }}>
                      Industry / Sector
                    </label>
                    <p style={{ fontSize: "14px", color: "#888", marginBottom: "8px" }}>
                      What space are you working in? (e.g. fintech, health, edtech, mobility)
                    </p>
                    <input
                      type="text"
                      value={startupData.basicInfo.industrySector}
                      onChange={(e) =>
                        setStartupData({
                          ...startupData,
                          basicInfo: { ...startupData.basicInfo, industrySector: e.target.value },
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: "#1a1a1a",
                        color: "#e0e0e0",
                        border: "1px solid #444",
                        borderRadius: "4px",
                        fontSize: "14px",
                      }}
                      placeholder="e.g. fintech, health, edtech, mobility"
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#ccc" }}>
                      Stage
                    </label>
                    <p style={{ fontSize: "14px", color: "#888", marginBottom: "8px" }}>How far along are you?</p>
                    <select
                      value={startupData.basicInfo.stage}
                      onChange={(e) =>
                        setStartupData({
                          ...startupData,
                          basicInfo: { ...startupData.basicInfo, stage: e.target.value },
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: "#1a1a1a",
                        color: "#e0e0e0",
                        border: "1px solid #444",
                        borderRadius: "4px",
                        fontSize: "14px",
                      }}
                    >
                      <option value="Idea">Idea</option>
                      <option value="MVP">MVP</option>
                      <option value="Beta">Beta</option>
                      <option value="Launched">Launched</option>
                      <option value="Revenue-Generating">Revenue-Generating</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#ccc" }}>
                      Team Members
                    </label>
                    <p style={{ fontSize: "14px", color: "#888", marginBottom: "8px" }}>
                      Who's building this? Add names and roles. (e.g. "Sara - Product, Mike - Tech")
                    </p>
                    <textarea
                      value={startupData.basicInfo.teamMembers}
                      onChange={(e) =>
                        setStartupData({
                          ...startupData,
                          basicInfo: { ...startupData.basicInfo, teamMembers: e.target.value },
                        })
                      }
                      style={{
                        width: "100%",
                        minHeight: "80px",
                        padding: "12px",
                        backgroundColor: "#1a1a1a",
                        color: "#e0e0e0",
                        border: "1px solid #444",
                        borderRadius: "4px",
                        fontSize: "14px",
                        resize: "vertical",
                      }}
                      placeholder="List team members and their roles"
                    />
                  </div>
                </div>

                {/* Motivation Section */}
                <div style={{ marginBottom: "40px" }}>
                  <h4
                    style={{
                      fontSize: "20px",
                      marginBottom: "20px",
                      color: "#fff",
                      borderBottom: "1px solid #444",
                      paddingBottom: "10px",
                    }}
                  >
                    Motivation
                  </h4>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#ccc" }}>
                      What's your motivation?
                    </label>
                    <p style={{ fontSize: "14px", color: "#888", marginBottom: "8px" }}>
                      Why do you want to build this? What drives you?
                    </p>
                    <textarea
                      value={startupData.motivation}
                      onChange={(e) =>
                        setStartupData({
                          ...startupData,
                          motivation: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        minHeight: "120px",
                        padding: "12px",
                        backgroundColor: "#1a1a1a",
                        color: "#e0e0e0",
                        border: "1px solid #444",
                        borderRadius: "4px",
                        fontSize: "14px",
                        resize: "vertical",
                      }}
                      placeholder="Explain what drives you to build this startup"
                    />
                  </div>
                </div>

                {/* Assets Section */}
                <div style={{ marginBottom: "30px" }}>
                  <h4
                    style={{
                      fontSize: "20px",
                      marginBottom: "20px",
                      color: "#fff",
                      borderBottom: "1px solid #444",
                      paddingBottom: "10px",
                    }}
                  >
                    Assets (Optional)
                  </h4>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#ccc" }}>
                      Website
                    </label>
                    <p style={{ fontSize: "14px", color: "#888", marginBottom: "8px" }}>
                      Drop a link if you already have a landing page or site.
                    </p>
                    <input
                      type="url"
                      value={startupData.assets.website}
                      onChange={(e) =>
                        setStartupData({
                          ...startupData,
                          assets: { ...startupData.assets, website: e.target.value },
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: "#1a1a1a",
                        color: "#e0e0e0",
                        border: "1px solid #444",
                        borderRadius: "4px",
                        fontSize: "14px",
                      }}
                      placeholder="https://your-website.com"
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#ccc" }}>
                      Pitch Deck
                    </label>
                    <p style={{ fontSize: "14px", color: "#888", marginBottom: "8px" }}>
                      Upload your current deck or paste a link - even a rough version helps.
                    </p>
                    <input
                      type="url"
                      value={startupData.assets.pitchDeck}
                      onChange={(e) =>
                        setStartupData({
                          ...startupData,
                          assets: { ...startupData.assets, pitchDeck: e.target.value },
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: "#1a1a1a",
                        color: "#e0e0e0",
                        border: "1px solid #444",
                        borderRadius: "4px",
                        fontSize: "14px",
                      }}
                      placeholder="Link to your pitch deck"
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#ccc" }}>
                      Other Workspaces
                    </label>
                    <p style={{ fontSize: "14px", color: "#888", marginBottom: "8px" }}>
                      Share links to Notion, Miro, Figma, or anything else you're using.
                    </p>
                    <textarea
                      value={startupData.assets.otherWorkspaces}
                      onChange={(e) =>
                        setStartupData({
                          ...startupData,
                          assets: { ...startupData.assets, otherWorkspaces: e.target.value },
                        })
                      }
                      style={{
                        width: "100%",
                        minHeight: "80px",
                        padding: "12px",
                        backgroundColor: "#1a1a1a",
                        color: "#e0e0e0",
                        border: "1px solid #444",
                        borderRadius: "4px",
                        fontSize: "14px",
                        resize: "vertical",
                      }}
                      placeholder="Links to Notion, Miro, Figma, etc."
                    />
                  </div>
                </div>
              </div>
            ) : (
              // Regular textarea for other components
              <div>
                <h3 style={{ fontSize: "24px", marginBottom: "20px", color: "#fff" }}>Edit Content</h3>
                <p style={{ marginBottom: "20px", lineHeight: "1.6" }}>
                  Use this space to add detailed information. You can include any relevant details or notes.
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
              </div>
            )}

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
            </div>
          </div>

          {/* Preview Section - only show for regular components */}
          {currentComponent.id !== "about-startup" && (
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
