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

interface ActionTableRow {
  id: string
  ideaFromPart1: string
  feature: string
  description: string
  potential: number | null
  importance: number | null
  complexity: number | null
  score: number | null
  priority: string
  priorityColor: string
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
    <div style={{ flex: 1, minHeight: "400px", position: "relative", overflow: "visible" }}>
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
          overflow: "visible", // Changed from "hidden" to "visible"
          padding: "10px", // Add padding to provide space for notes near edges
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
              left: `${Math.max(0, Math.min(postIt.x, 280))}px`, // Constrain x position
              top: `${Math.max(0, Math.min(postIt.y, 250))}px`, // Constrain y position
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
                    zIndex: 10, // Ensure button stays on top
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
  const [currentSection, setCurrentSection] = useState<string>("")
  const [currentTask, setCurrentTask] = useState<string>("")
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  // Post-it states for Action Table Part 1
  const [keyInsights, setKeyInsights] = useState<PostIt[]>([
    { id: "1", text: "Users struggle with investor matching", color: "#FFB3BA", x: 50, y: 50 },
    { id: "2", text: "Need better progress tracking", color: "#BAFFC9", x: 180, y: 80 },
    { id: "3", text: "Onboarding is too complex", color: "#BAE1FF", x: 100, y: 150 },
  ])
  const [ideas, setIdeas] = useState<PostIt[]>([
    { id: "4", text: "AI-powered mentor matching system", color: "#FFFFBA", x: 60, y: 40 },
    { id: "5", text: "Gamified progress dashboard", color: "#FFD1DC", x: 200, y: 90 },
    { id: "6", text: "Simplified onboarding wizard", color: "#E0BBE4", x: 120, y: 160 },
    { id: "7", text: "Investor feedback platform", color: "#C7CEEA", x: 80, y: 220 },
    { id: "8", text: "Automated reporting system", color: "#FFC9A3", x: 220, y: 180 },
  ])
  const [possibleDirections, setPossibleDirections] = useState<PostIt[]>([])
  const [issues, setIssues] = useState<PostIt[]>([])

  // Action Table Part 2 state
  const [actionTableRows, setActionTableRows] = useState<ActionTableRow[]>([])

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

    // Initialize with empty table - users can import manually using the button
    if (section === "action-table" && task === "development-plan" && actionTableRows.length === 0) {
      // Start with empty table
    }
  }, [ideas])

  const generateId = () => Math.random().toString(36).substr(2, 9)

  // Action Table Part 2 functions
  const addNewRow = () => {
    const newRow: ActionTableRow = {
      id: generateId(),
      ideaFromPart1: "",
      feature: "",
      description: "",
      potential: null,
      importance: null,
      complexity: null,
      score: null,
      priority: "MVP",
      priorityColor: "#4A90E2",
    }
    setActionTableRows([...actionTableRows, newRow])
  }

  const updateRowField = (id: string, field: keyof ActionTableRow, value: any) => {
    setActionTableRows((rows) =>
      rows.map((row) => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: value }

          // Auto-calculate score when potential, importance, or complexity changes
          if (field === "potential" || field === "importance" || field === "complexity") {
            const potential = field === "potential" ? value : row.potential
            const importance = field === "importance" ? value : row.importance
            const complexity = field === "complexity" ? value : row.complexity

            if (potential !== null && importance !== null && complexity !== null) {
              // Simple scoring formula: (potential + importance) / complexity
              const score = ((potential + importance) / complexity) * 2
              updatedRow.score = Math.round(score * 100) / 100
            }
          }

          // Update priority color based on priority selection
          if (field === "priority") {
            const priorityColors: { [key: string]: string } = {
              MVP: "#4A90E2",
              BETA: "#7ED321",
              Prototype: "#9013FE",
              Postpone: "#F5A623",
              Later: "#757575",
            }
            updatedRow.priorityColor = priorityColors[value] || "#4A90E2"
          }

          return updatedRow
        }
        return row
      }),
    )
  }

  const deleteRow = (id: string) => {
    setActionTableRows((rows) => rows.filter((row) => row.id !== id))
  }

  // Post-it board handlers for Part 1
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
          onClick={addNewRow}
          style={{
            background: "#4A90E2",
            border: "none",
            borderRadius: "4px",
            padding: "8px 12px",
            fontSize: "14px",
            cursor: "pointer",
            color: "white",
            fontWeight: "500",
          }}
          title="Add new feature row"
        >
          + Add Feature
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
          title="Export"
        >
          📤
        </button>
        <button
          onClick={() => {
            if (actionTableRows.length > 0) {
              const confirmed = window.confirm(
                "This will overwrite all current ideas in the table with fresh data from Action Table Part 1. Are you sure you want to continue?",
              )
              if (!confirmed) return
            }

            // Import ideas from Part 1
            const importedRows: ActionTableRow[] = ideas.map((idea, index) => ({
              id: generateId(),
              ideaFromPart1: idea.text,
              feature: "",
              description: "",
              potential: null,
              importance: null,
              complexity: null,
              score: null,
              priority: "MVP",
              priorityColor: "#4A90E2",
            }))
            setActionTableRows(importedRows)
          }}
          style={{
            background: "#28a745",
            border: "none",
            borderRadius: "4px",
            padding: "8px 12px",
            fontSize: "14px",
            cursor: "pointer",
            color: "white",
            fontWeight: "500",
            marginLeft: "10px",
          }}
          title="Import ideas from Action Table Part 1"
        >
          📥 Import from Part 1
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
            gridTemplateColumns: "40px 220px 200px 300px 100px 100px 100px 100px 120px 60px 40px",
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
          <div style={{ padding: "16px 8px", textAlign: "center" }}>🗑️</div>
        </div>

        {/* Table Body */}
        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {actionTableRows.map((row, index) => (
            <div
              key={row.id}
              style={{
                display: "grid",
                gridTemplateColumns: "40px 220px 200px 300px 100px 100px 100px 100px 120px 60px 40px",
                borderBottom: index < actionTableRows.length - 1 ? "1px solid #f1f3f4" : "none",
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
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  value={row.ideaFromPart1}
                  onChange={(e) => updateRowField(row.id, "ideaFromPart1", e.target.value)}
                  placeholder="Enter or edit idea from Part 1"
                  style={{
                    width: "100%",
                    border: "1px dashed #4A90E2",
                    borderRadius: "4px",
                    padding: "8px 10px",
                    fontSize: "12px",
                    backgroundColor: "#f8f9fa",
                    fontStyle: row.ideaFromPart1 ? "normal" : "italic",
                  }}
                />
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
                  value={row.feature}
                  onChange={(e) => updateRowField(row.id, "feature", e.target.value)}
                  placeholder="Define your feature name"
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
                  value={row.description}
                  onChange={(e) => updateRowField(row.id, "description", e.target.value)}
                  placeholder="Describe what this feature does and how it helps users"
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
                  value={row.potential || ""}
                  onChange={(e) =>
                    updateRowField(row.id, "potential", e.target.value ? Number.parseInt(e.target.value) : null)
                  }
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
                  value={row.importance || ""}
                  onChange={(e) =>
                    updateRowField(row.id, "importance", e.target.value ? Number.parseInt(e.target.value) : null)
                  }
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
                  value={row.complexity || ""}
                  onChange={(e) =>
                    updateRowField(row.id, "complexity", e.target.value ? Number.parseInt(e.target.value) : null)
                  }
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
                  color: row.score ? "#333" : "#6c757d",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                }}
              >
                {row.score ? row.score.toFixed(2) : "—"}
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
                  value={row.priority}
                  onChange={(e) => updateRowField(row.id, "priority", e.target.value)}
                  style={{
                    border: "1px solid #dee2e6",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    fontSize: "11px",
                    backgroundColor: row.priorityColor,
                    color: "white",
                    fontWeight: "500",
                  }}
                >
                  <option value="MVP">MVP</option>
                  <option value="BETA">BETA</option>
                  <option value="Prototype">Prototype</option>
                  <option value="Postpone">Postpone</option>
                  <option value="Later">Later</option>
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
                {index + 1}
              </div>

              {/* Delete Button */}
              <div
                style={{
                  padding: "12px 8px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={() => deleteRow(row.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#dc3545",
                    cursor: "pointer",
                    fontSize: "16px",
                    padding: "4px",
                    borderRadius: "4px",
                  }}
                  title="Delete this row"
                >
                  🗑️
                </button>
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
              Auto-imported from your Action Table Part 1 "Ideas" section. You can edit these or add new ones manually.
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
              Auto-calculated based on your ratings: (Potential + Importance) ÷ Complexity × 2. Higher scores = higher
              priority.
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
            <p style={{ lineHeight: "1.6", marginBottom: "20px" }}>
              Action Table Part 1 helps you take the insights you gathered from interviews and start turning them into
              product opportunities. For each problem or need you uncovered, write down an initial idea in response—it
              doesn't have to be a finished feature yet, just a potential direction to explore.
            </p>
            <p style={{ lineHeight: "1.6", marginBottom: "20px" }}>
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
