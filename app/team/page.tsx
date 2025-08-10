"use client"

import { useState } from "react"
import { User, Mail, Edit2, Plus, X, Check } from "lucide-react"
import { defaultTeamMembers, type TeamMember } from "@/lib/team-data"

export default function TeamPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(defaultTeamMembers)
  const [editingMember, setEditingMember] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editForm, setEditForm] = useState<Partial<TeamMember>>({})
  const [newMemberForm, setNewMemberForm] = useState<Partial<TeamMember>>({
    name: "",
    role: "",
    skills: [],
    email: "",
  })

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member.id)
    setEditForm({
      name: member.name,
      role: member.role,
      skills: [...member.skills],
      email: member.email,
    })
  }

  const handleSaveEdit = () => {
    if (!editingMember) return

    setTeamMembers((prev) => prev.map((member) => (member.id === editingMember ? { ...member, ...editForm } : member)))
    setEditingMember(null)
    setEditForm({})
  }

  const handleAddMember = () => {
    if (!newMemberForm.name || !newMemberForm.role) return

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: newMemberForm.name,
      role: newMemberForm.role,
      skills: newMemberForm.skills || [],
      email: newMemberForm.email,
      avatar: "/placeholder-user.jpg",
    }

    setTeamMembers((prev) => [...prev, newMember])
    setNewMemberForm({ name: "", role: "", skills: [], email: "" })
    setShowAddForm(false)
  }

  const handleRemoveMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((member) => member.id !== id))
  }

  const addSkill = (skill: string, isEdit = false) => {
    if (isEdit) {
      setEditForm((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), skill],
      }))
    } else {
      setNewMemberForm((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), skill],
      }))
    }
  }

  const removeSkill = (skillIndex: number, isEdit = false) => {
    if (isEdit) {
      setEditForm((prev) => ({
        ...prev,
        skills: prev.skills?.filter((_, index) => index !== skillIndex) || [],
      }))
    } else {
      setNewMemberForm((prev) => ({
        ...prev,
        skills: prev.skills?.filter((_, index) => index !== skillIndex) || [],
      }))
    }
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
      <div style={{ padding: "40px 60px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "400", margin: "0 0 16px 0", color: "#e0e0e0" }}>Team Management</h1>
        <p style={{ fontSize: "18px", color: "#999", margin: "0 0 60px 0" }}>
          Manage your team members, roles, and skills for better task assignment.
        </p>
      </div>

      {/* Add Member Button */}
      <div style={{ padding: "0 60px 30px", display: "flex", justifyContent: "flex-end" }}>
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
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
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#999" }}>
                      Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name || ""}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #444",
                        color: "#e0e0e0",
                        fontSize: "16px",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#999" }}>
                      Role
                    </label>
                    <input
                      type="text"
                      value={editForm.role || ""}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, role: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #444",
                        color: "#e0e0e0",
                        fontSize: "16px",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#999" }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={editForm.email || ""}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #444",
                        color: "#e0e0e0",
                        fontSize: "16px",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#999" }}>
                      Skills
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                      {editForm.skills?.map((skill, index) => (
                        <span
                          key={index}
                          style={{
                            padding: "4px 8px",
                            backgroundColor: "#007bff",
                            color: "white",
                            fontSize: "12px",
                            clipPath:
                              "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill(index, true)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "white",
                              cursor: "pointer",
                              padding: "0",
                            }}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Add skill and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                          addSkill(e.currentTarget.value.trim(), true)
                          e.currentTarget.value = ""
                        }
                      }}
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
                  <div style={{ display: "flex", gap: "12px" }}>
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
                        setEditForm({})
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
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          backgroundColor: "#444",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <User size={24} color="#999" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: "18px", fontWeight: "600", margin: "0 0 4px 0", color: "#e0e0e0" }}>
                          {member.name}
                        </h3>
                        <p style={{ fontSize: "14px", color: "#999", margin: "0" }}>{member.role}</p>
                      </div>
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
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {member.email && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                      <Mail size={16} color="#999" />
                      <span style={{ fontSize: "14px", color: "#999" }}>{member.email}</span>
                    </div>
                  )}

                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: "500", margin: "0 0 8px 0", color: "#e0e0e0" }}>
                      Skills
                    </h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {member.skills.map((skill, index) => (
                        <span
                          key={index}
                          style={{
                            padding: "4px 8px",
                            backgroundColor: "#444",
                            color: "#e0e0e0",
                            fontSize: "12px",
                            clipPath:
                              "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
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
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}
            >
              <h3 style={{ fontSize: "24px", fontWeight: "600", margin: "0", color: "#e0e0e0" }}>Add Team Member</h3>
              <button
                onClick={() => setShowAddForm(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#999",
                  cursor: "pointer",
                  fontSize: "24px",
                  padding: "0",
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#999" }}>Name</label>
              <input
                type="text"
                value={newMemberForm.name || ""}
                onChange={(e) => setNewMemberForm((prev) => ({ ...prev, name: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #444",
                  color: "#e0e0e0",
                  fontSize: "16px",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#999" }}>Role</label>
              <input
                type="text"
                value={newMemberForm.role || ""}
                onChange={(e) => setNewMemberForm((prev) => ({ ...prev, role: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #444",
                  color: "#e0e0e0",
                  fontSize: "16px",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#999" }}>Email</label>
              <input
                type="email"
                value={newMemberForm.email || ""}
                onChange={(e) => setNewMemberForm((prev) => ({ ...prev, email: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #444",
                  color: "#e0e0e0",
                  fontSize: "16px",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#999" }}>Skills</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                {newMemberForm.skills?.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#007bff",
                      color: "white",
                      fontSize: "12px",
                      clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(index, false)}
                      style={{ background: "none", border: "none", color: "white", cursor: "pointer", padding: "0" }}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add skill and press Enter"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    addSkill(e.currentTarget.value.trim(), false)
                    e.currentTarget.value = ""
                  }
                }}
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

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowAddForm(false)}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#6b7280",
                  border: "1px solid #4b5563",
                  color: "white",
                  fontSize: "16px",
                  cursor: "pointer",
                  clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                  fontWeight: "500",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#22c55e",
                  border: "1px solid #16a34a",
                  color: "white",
                  fontSize: "16px",
                  cursor: "pointer",
                  clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                  fontWeight: "500",
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
