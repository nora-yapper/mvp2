"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Check, X } from "lucide-react"
import { getTeamMembers, saveTeamMembers, type TeamMember } from "@/lib/team-data"

export default function TeamPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [editingMember, setEditingMember] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    role: "",
    email: "",
    skills: [] as string[],
  })
  const [newSkill, setNewSkill] = useState("")

  useEffect(() => {
    setTeamMembers(getTeamMembers())
  }, [])

  const handleSaveTeam = (updatedMembers: TeamMember[]) => {
    setTeamMembers(updatedMembers)
    saveTeamMembers(updatedMembers)
  }

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member.id)
    setEditForm({
      name: member.name,
      role: member.role,
      email: member.email,
      skills: [...member.skills],
    })
  }

  const handleSaveEdit = () => {
    if (!editingMember) return

    const updatedMembers = teamMembers.map((member) =>
      member.id === editingMember ? { ...member, ...editForm } : member,
    )

    handleSaveTeam(updatedMembers)
    setEditingMember(null)
    setEditForm({ name: "", role: "", email: "", skills: [] })
  }

  const handleAddMember = () => {
    if (!editForm.name || !editForm.role) return

    const newMember: TeamMember = {
      id: Date.now().toString(),
      ...editForm,
    }

    const updatedMembers = [...teamMembers, newMember]
    handleSaveTeam(updatedMembers)
    setShowAddForm(false)
    setEditForm({ name: "", role: "", email: "", skills: [] })
  }

  const handleRemoveMember = (id: string) => {
    const updatedMembers = teamMembers.filter((member) => member.id !== id)
    handleSaveTeam(updatedMembers)
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !editForm.skills.includes(newSkill.trim())) {
      setEditForm({
        ...editForm,
        skills: [...editForm.skills, newSkill.trim()],
      })
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditForm({
      ...editForm,
      skills: editForm.skills.filter((skill) => skill !== skillToRemove),
    })
  }

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
            { label: "Command Deck", onClick: () => (window.location.href = "/homebase"), active: false },
            { label: "Health Analysis", onClick: () => (window.location.href = "/health-check"), active: false },
            { label: "Forecast", onClick: () => (window.location.href = "/forecast"), active: false },
            { label: "Reports", onClick: () => (window.location.href = "/reports"), active: false },
            { label: "Network", onClick: () => (window.location.href = "/network"), active: false },
            { label: "Team", onClick: () => {}, active: true },
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
      <div style={{ padding: "40px 60px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "400", margin: "0 0 16px 0", color: "#e0e0e0" }}>Team Management</h1>
        <p style={{ fontSize: "18px", color: "#999", margin: "0 0 60px 0" }}>
          Manage your team members, roles, and skills for better task assignment.
        </p>
      </div>

      {/* Add Team Member Button */}
      <div style={{ padding: "0 60px 40px", display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            padding: "12px 24px",
            backgroundColor: "#007bff",
            border: "1px solid #0056b3",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
            clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Plus size={16} />
          Add Team Member
        </button>
      </div>

      {/* Team Members Grid */}
      <div style={{ padding: "0 60px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "20px" }}>
          {teamMembers.map((member) => (
            <div
              key={member.id}
              style={{
                backgroundColor: "#2a2a2a",
                border: "1px solid #444",
                clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
                padding: "24px",
              }}
            >
              {editingMember === member.id ? (
                // Edit Form
                <div>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", marginBottom: "8px", color: "#ccc" }}>Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #444",
                        color: "#e0e0e0",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", marginBottom: "8px", color: "#ccc" }}>Role</label>
                    <input
                      type="text"
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #444",
                        color: "#e0e0e0",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", marginBottom: "8px", color: "#ccc" }}>Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #444",
                        color: "#e0e0e0",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", marginBottom: "8px", color: "#ccc" }}>Skills</label>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                        placeholder="Add a skill"
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          backgroundColor: "#1a1a1a",
                          border: "1px solid #444",
                          color: "#e0e0e0",
                          fontSize: "14px",
                          outline: "none",
                        }}
                      />
                      <button
                        onClick={handleAddSkill}
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "#007bff",
                          border: "1px solid #0056b3",
                          color: "white",
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                      >
                        Add
                      </button>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {editForm.skills.map((skill) => (
                        <span
                          key={skill}
                          style={{
                            padding: "4px 8px",
                            backgroundColor: "#007bff",
                            color: "white",
                            fontSize: "12px",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          {skill}
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "white",
                              cursor: "pointer",
                              padding: "0",
                              fontSize: "12px",
                            }}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={handleSaveEdit}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#22c55e",
                        border: "1px solid #16a34a",
                        color: "white",
                        fontSize: "14px",
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
                        setEditingMember(null)
                        setEditForm({ name: "", role: "", email: "", skills: [] })
                      }}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#6b7280",
                        border: "1px solid #4b5563",
                        color: "white",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Display Mode
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "16px",
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: "20px", fontWeight: "600", margin: "0 0 4px 0", color: "#e0e0e0" }}>
                        {member.name}
                      </h3>
                      <p style={{ fontSize: "16px", color: "#007bff", margin: "0 0 8px 0" }}>{member.role}</p>
                      <p style={{ fontSize: "14px", color: "#999", margin: "0" }}>{member.email}</p>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleEditMember(member)}
                        style={{
                          background: "transparent",
                          border: "1px solid #444",
                          color: "#999",
                          cursor: "pointer",
                          padding: "8px",
                          clipPath:
                            "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        style={{
                          background: "transparent",
                          border: "1px solid #ef4444",
                          color: "#ef4444",
                          cursor: "pointer",
                          padding: "8px",
                          clipPath:
                            "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: "500", margin: "0 0 8px 0", color: "#ccc" }}>Skills</h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {member.skills.map((skill) => (
                        <span
                          key={skill}
                          style={{
                            padding: "6px 12px",
                            backgroundColor: "#444",
                            color: "#e0e0e0",
                            fontSize: "12px",
                            borderRadius: "4px",
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            zIndex: 1001,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
              padding: "30px",
              maxWidth: "500px",
              width: "100%",
            }}
          >
            <h3 style={{ fontSize: "24px", fontWeight: "600", margin: "0 0 24px 0", color: "#e0e0e0" }}>
              Add Team Member
            </h3>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#ccc" }}>Name *</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #444",
                  color: "#e0e0e0",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#ccc" }}>Role *</label>
              <input
                type="text"
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #444",
                  color: "#e0e0e0",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#ccc" }}>Email</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #444",
                  color: "#e0e0e0",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#ccc" }}>Skills</label>
              <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                  placeholder="Add a skill"
                  style={{
                    flex: 1,
                    padding: "12px",
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #444",
                    color: "#e0e0e0",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
                <button
                  onClick={handleAddSkill}
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "#007bff",
                    border: "1px solid #0056b3",
                    color: "white",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  Add
                </button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {editForm.skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#007bff",
                      color: "white",
                      fontSize: "12px",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        padding: "0",
                        fontSize: "12px",
                      }}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setEditForm({ name: "", role: "", email: "", skills: [] })
                  setNewSkill("")
                }}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#6b7280",
                  border: "1px solid #4b5563",
                  color: "white",
                  fontSize: "16px",
                  cursor: "pointer",
                  clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                disabled={!editForm.name || !editForm.role}
                style={{
                  padding: "12px 24px",
                  backgroundColor: editForm.name && editForm.role ? "#22c55e" : "#444",
                  border: `1px solid ${editForm.name && editForm.role ? "#16a34a" : "#333"}`,
                  color: "white",
                  fontSize: "16px",
                  cursor: editForm.name && editForm.role ? "pointer" : "not-allowed",
                  clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                }}
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
