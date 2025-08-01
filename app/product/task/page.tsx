"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface PostIt {
  id: string
  text: string
  color: string
  x: number
  y: number
}

interface PostItBoardProps {
  title: string
  postIts: PostIt[]
  onAddPostIt: (postIt: Omit<PostIt, "id">) => void
  onEditPostIt: (id: string, text: string) => void
  onDeletePostIt: (id: string) => void
  onMovePostIt: (id: string, x: number, y: number) => void
  onChangeColor: (id: string, color: string) => void
}

const PostItBoard: React.FC<PostItBoardProps> = ({
  title,
  postIts,
  onAddPostIt,
  onEditPostIt,
  onDeletePostIt,
  onMovePostIt,
  onChangeColor,
}) => {
  const [draggedPostIt, setDraggedPostIt] = useState<string | null>(null)
  const [editingPostIt, setEditingPostIt] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  const colors = [
    "#FFB3BA",
    "#BAFFC9",
    "#BAE1FF",
    "#FFFFBA",
    "#FFD1DC",
    "#E0BBE4",
    "#C7CEEA",
    "#FFC9A3",
    "#D4F1A4",
    "#B3E5FC",
  ]

  const handleAddPostIt = () => {
    const newPostIt = {
      text: "New note",
      color: colors[Math.floor(Math.random() * colors.length)],
      x: Math.random() * 200,
      y: Math.random() * 200,
    }
    onAddPostIt(newPostIt)
  }

  const handleEditStart = (postIt: PostIt) => {
    setEditingPostIt(postIt.id)
    setEditText(postIt.text)
  }

  const handleEditSave = () => {
    if (editingPostIt) {
      onEditPostIt(editingPostIt, editText)
      setEditingPostIt(null)
      setEditText("")
    }
  }

  const handleEditCancel = () => {
    setEditingPostIt(null)
    setEditText("")
  }

  const handleColorChange = (postItId: string, newColor: string) => {
    onChangeColor(postItId, newColor)
  }

  const handleDragStart = (e: React.DragEvent, postItId: string) => {
    setDraggedPostIt(postItId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedPostIt) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      onMovePostIt(draggedPostIt, x, y)
      setDraggedPostIt(null)
    }
  }

  return (
    <div style={{ flex: 1, minHeight: "400px", position: "relative" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
          padding: "0 10px",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "#e0e0e0",
            margin: 0,
          }}
        >
          {title}
        </h3>
        <button
          onClick={handleAddPostIt}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "5px 10px",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          + Add Note
        </button>
      </div>

      <div
        style={{
          border: "2px dashed #555",
          borderRadius: "8px",
          minHeight: "350px",
          position: "relative",
          backgroundColor: "#1a1a1a",
          overflow: "hidden",
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {postIts.map((postIt) => (
          <div
            key={postIt.id}
            draggable={editingPostIt !== postIt.id}
            onDragStart={(e) => handleDragStart(e, postIt.id)}
            style={{
              position: "absolute",
              left: `${postIt.x}px`,
              top: `${postIt.y}px`,
              width: editingPostIt === postIt.id ? "160px" : "120px",
              minHeight: editingPostIt === postIt.id ? "140px" : "80px",
              backgroundColor: postIt.color,
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "8px",
              fontSize: "12px",
              cursor: editingPostIt === postIt.id ? "default" : "move",
              boxShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              zIndex: draggedPostIt === postIt.id ? 1000 : editingPostIt === postIt.id ? 999 : 1,
              color: "#333",
            }}
            onDoubleClick={() => handleEditStart(postIt)}
          >
            {editingPostIt === postIt.id ? (
              <div>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{
                    width: "100%",
                    height: "60px",
                    border: "1px solid #555",
                    backgroundColor: "rgba(255,255,255,0.9)",
                    color: "#333",
                    fontSize: "12px",
                    resize: "none",
                    outline: "none",
                    borderRadius: "4px",
                    padding: "4px",
                    marginBottom: "8px",
                  }}
                  autoFocus
                />

                {/* Color Picker */}
                <div style={{ marginBottom: "8px" }}>
                  <div style={{ fontSize: "10px", marginBottom: "4px", fontWeight: "bold" }}>Color:</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(postIt.id, color)}
                        style={{
                          width: "16px",
                          height: "16px",
                          backgroundColor: color,
                          border: postIt.color === color ? "2px solid #333" : "1px solid #999",
                          borderRadius: "3px",
                          cursor: "pointer",
                          padding: 0,
                        }}
                        title={`Change to ${color}`}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "4px" }}>
                  <button
                    onClick={handleEditSave}
                    style={{
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "2px",
                      padding: "2px 6px",
                      fontSize: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={handleEditCancel}
                    style={{
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: "2px",
                      padding: "2px 6px",
                      fontSize: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ wordWrap: "break-word", marginBottom: "4px", color: "#333" }}>{postIt.text}</div>
                <button
                  onClick={() => onDeletePostIt(postIt.id)}
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "16px",
                    height: "16px",
                    fontSize: "10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ProductTaskPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [section, setSection] = useState("")
  const [task, setTask] = useState("")
  const [options, setOptions] = useState<string[]>([])

  // Post-it states for each board
  const [keyInsights, setKeyInsights] = useState<PostIt[]>([])
  const [ideas, setIdeas] = useState<PostIt[]>([])
  const [possibleDirections, setPossibleDirections] = useState<PostIt[]>([])
  const [issues, setIssues] = useState<PostIt[]>([])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setSection(params.get("section") || "")
    setTask(params.get("task") || "")
    const optionsParam = params.get("options")
    if (optionsParam) {
      setOptions(optionsParam.split(","))
    }
  }, [])

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const handleAddPostIt = (boardType: string) => (postIt: Omit<PostIt, "id">) => {
    const newPostIt = { ...postIt, id: generateId() }
    switch (boardType) {
      case "keyInsights":
        setKeyInsights((prev) => [...prev, newPostIt])
        break
      case "ideas":
        setIdeas((prev) => [...prev, newPostIt])
        break
      case "possibleDirections":
        setPossibleDirections((prev) => [...prev, newPostIt])
        break
      case "issues":
        setIssues((prev) => [...prev, newPostIt])
        break
    }
  }

  const handleEditPostIt = (boardType: string) => (id: string, text: string) => {
    const updateBoard = (prev: PostIt[]) => prev.map((postIt) => (postIt.id === id ? { ...postIt, text } : postIt))

    switch (boardType) {
      case "keyInsights":
        setKeyInsights(updateBoard)
        break
      case "ideas":
        setIdeas(updateBoard)
        break
      case "possibleDirections":
        setPossibleDirections(updateBoard)
        break
      case "issues":
        setIssues(updateBoard)
        break
    }
  }

  const handleDeletePostIt = (boardType: string) => (id: string) => {
    const filterBoard = (prev: PostIt[]) => prev.filter((postIt) => postIt.id !== id)

    switch (boardType) {
      case "keyInsights":
        setKeyInsights(filterBoard)
        break
      case "ideas":
        setIdeas(filterBoard)
        break
      case "possibleDirections":
        setPossibleDirections(filterBoard)
        break
      case "issues":
        setIssues(filterBoard)
        break
    }
  }

  const handleMovePostIt = (boardType: string) => (id: string, x: number, y: number) => {
    const updateBoard = (prev: PostIt[]) => prev.map((postIt) => (postIt.id === id ? { ...postIt, x, y } : postIt))

    switch (boardType) {
      case "keyInsights":
        setKeyInsights(updateBoard)
        break
      case "ideas":
        setIdeas(updateBoard)
        break
      case "possibleDirections":
        setPossibleDirections(updateBoard)
        break
      case "issues":
        setIssues(updateBoard)
        break
    }
  }

  const handleChangeColor = (boardType: string) => (id: string, color: string) => {
    const updateBoard = (prev: PostIt[]) => prev.map((postIt) => (postIt.id === id ? { ...postIt, color } : postIt))

    switch (boardType) {
      case "keyInsights":
        setKeyInsights(updateBoard)
        break
      case "ideas":
        setIdeas(updateBoard)
        break
      case "possibleDirections":
        setPossibleDirections(updateBoard)
        break
      case "issues":
        setIssues(updateBoard)
        break
    }
  }

  const renderPriorityTasksContent = () => (
    <div style={{ padding: "40px", backgroundColor: "#1a1a1a", minHeight: "100vh", color: "#e0e0e0" }}>
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: "30px",
          color: "#e0e0e0",
          textAlign: "center",
        }}
      >
        ACTION TABLE PART 01
      </h1>

      {/* Main Board Layout */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "40px",
          minHeight: "500px",
          backgroundColor: "#2a2a2a",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        {/* Key Insights Column */}
        <PostItBoard
          title="Key Insights"
          postIts={keyInsights}
          onAddPostIt={handleAddPostIt("keyInsights")}
          onEditPostIt={handleEditPostIt("keyInsights")}
          onDeletePostIt={handleDeletePostIt("keyInsights")}
          onMovePostIt={handleMovePostIt("keyInsights")}
          onChangeColor={handleChangeColor("keyInsights")}
        />

        {/* Ideas Column */}
        <PostItBoard
          title="Ideas"
          postIts={ideas}
          onAddPostIt={handleAddPostIt("ideas")}
          onEditPostIt={handleEditPostIt("ideas")}
          onDeletePostIt={handleDeletePostIt("ideas")}
          onMovePostIt={handleMovePostIt("ideas")}
          onChangeColor={handleChangeColor("ideas")}
        />

        {/* Right Column - Split into two */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Possible Directions */}
          <div style={{ flex: 1 }}>
            <PostItBoard
              title="Possible Directions"
              postIts={possibleDirections}
              onAddPostIt={handleAddPostIt("possibleDirections")}
              onEditPostIt={handleEditPostIt("possibleDirections")}
              onDeletePostIt={handleDeletePostIt("possibleDirections")}
              onMovePostIt={handleMovePostIt("possibleDirections")}
              onChangeColor={handleChangeColor("possibleDirections")}
            />
          </div>

          {/* Issues */}
          <div style={{ flex: 1 }}>
            <PostItBoard
              title="Issues"
              postIts={issues}
              onAddPostIt={handleAddPostIt("issues")}
              onEditPostIt={handleEditPostIt("issues")}
              onDeletePostIt={handleDeletePostIt("issues")}
              onMovePostIt={handleMovePostIt("issues")}
              onChangeColor={handleChangeColor("issues")}
            />
          </div>
        </div>
      </div>

      {/* Instructions Section */}
      <div
        style={{
          backgroundColor: "#2a2a2a",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          marginTop: "40px",
          color: "#e0e0e0",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "20px",
            color: "#e0e0e0",
          }}
        >
          How to Use this Action Table
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "10px", color: "#ccc" }}>
              What This Task Is For:
            </h3>
            <p style={{ lineHeight: "1.6", color: "#b0b0b0", marginBottom: "15px" }}>
              Action Table Part 1 helps you take the insights you gathered from interviews and start turning them into
              product opportunities. For each problem or need you uncovered, write down an initial idea in response—it
              doesn't have to be a finished feature yet, just a potential direction to explore.
            </p>
            <p style={{ lineHeight: "1.6", color: "#b0b0b0" }}>
              Alongside each idea, note any issues it might cause or challenges it could bring. This is your space to
              think critically and creatively about how to move from research to action.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "10px", color: "#ccc" }}>
              How to Use It:
            </h3>
            <ul style={{ lineHeight: "1.6", color: "#b0b0b0", paddingLeft: "20px" }}>
              <li style={{ marginBottom: "8px" }}>
                <strong>Add Notes:</strong> Click the "+ Add Note" button in each section to create virtual post-it
                notes
              </li>
              <li style={{ marginBottom: "8px" }}>
                <strong>Edit Notes:</strong> Double-click any post-it to edit its content and change its color
              </li>
              <li style={{ marginBottom: "8px" }}>
                <strong>Move Notes:</strong> Drag and drop post-its to reorganize them within each section
              </li>
              <li style={{ marginBottom: "8px" }}>
                <strong>Delete Notes:</strong> Click the "×" button on any post-it to remove it
              </li>
              <li>
                <strong>Organize:</strong> Use different colored post-its to categorize related ideas and insights
              </li>
            </ul>
          </div>
        </div>

        <div
          style={{
            marginTop: "25px",
            padding: "20px",
            backgroundColor: "#1a1a1a",
            borderRadius: "6px",
          }}
        >
          <h4 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "10px", color: "#ccc" }}>
            Section Guidelines:
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
            <div>
              <strong style={{ color: "#e0e0e0" }}>Key Insights:</strong>
              <p style={{ fontSize: "14px", color: "#b0b0b0", margin: "5px 0 0 0" }}>
                Important discoveries, user feedback, market observations
              </p>
            </div>
            <div>
              <strong style={{ color: "#e0e0e0" }}>Ideas:</strong>
              <p style={{ fontSize: "14px", color: "#b0b0b0", margin: "5px 0 0 0" }}>
                Potential solutions, features, or approaches to explore
              </p>
            </div>
            <div>
              <strong style={{ color: "#e0e0e0" }}>Possible Directions:</strong>
              <p style={{ fontSize: "14px", color: "#b0b0b0", margin: "5px 0 0 0" }}>
                Strategic paths and next steps to consider
              </p>
            </div>
            <div>
              <strong style={{ color: "#e0e0e0" }}>Issues:</strong>
              <p style={{ fontSize: "14px", color: "#b0b0b0", margin: "5px 0 0 0" }}>
                Challenges, risks, and problems that need attention
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTaskContent = () => {
    if (section === "action-table" && task === "priority-tasks") {
      return renderPriorityTasksContent()
    }

    // Default content for other tasks
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>{task?.replace("-", " ").toUpperCase()} Task</h1>
        <p style={{ fontSize: "1.2rem", color: "#666" }}>
          Task content for {section} - {task} will be implemented here.
        </p>
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
          onClick={() => {
            const optionsParam = options.join(",")
            window.location.href = `/product/detail?options=${optionsParam}`
          }}
          style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          ←
        </button>

        <div style={{ marginLeft: "20px", fontSize: "16px", fontWeight: "bold" }}>
          {section?.replace("-", " ").toUpperCase()} - {task?.replace("-", " ").toUpperCase()}
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
