"use client"

import { useState } from "react"
import { mockTeamMembers, mockProjects, mockTasks, type TeamMember, type Project, type Task } from "@/lib/team-data"

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState<"members" | "projects" | "analytics">("members")
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers)
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#10b981"
      case "away":
        return "#f59e0b"
      case "inactive":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "#dc2626"
      case "high":
        return "#ea580c"
      case "medium":
        return "#d97706"
      case "low":
        return "#65a30d"
      default:
        return "#6b7280"
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", padding: "20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#1f2937", marginBottom: "8px" }}>
            Team Management
          </h1>
          <p style={{ color: "#6b7280", fontSize: "16px" }}>
            Manage your team members, projects, and track performance
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: "30px" }}>
          <input
            type="text"
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "12px 16px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "16px",
              backgroundColor: "white",
            }}
          />
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: "30px" }}>
          <div
            style={{
              display: "flex",
              gap: "4px",
              backgroundColor: "#f1f5f9",
              padding: "4px",
              borderRadius: "8px",
              width: "fit-content",
            }}
          >
            {(["members", "projects", "analytics"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: activeTab === tab ? "white" : "transparent",
                  color: activeTab === tab ? "#1f2937" : "#6b7280",
                  fontWeight: activeTab === tab ? "600" : "400",
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === "members" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "24px",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        backgroundColor: "#e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "12px",
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "#6b7280",
                      }}
                    >
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", margin: 0 }}>
                        {member.name}
                      </h3>
                      <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>{member.role}</p>
                    </div>
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: getStatusColor(member.status),
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>Skills:</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {member.skills.map((skill) => (
                        <span
                          key={skill}
                          style={{
                            backgroundColor: "#f3f4f6",
                            color: "#374151",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", textAlign: "center" }}
                  >
                    <div>
                      <div style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937" }}>
                        {member.performance.tasksCompleted}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>Completed</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937" }}>
                        {member.performance.tasksInProgress}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>In Progress</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937" }}>
                        {member.performance.efficiency}%
                      </div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>Efficiency</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div>
            <div style={{ display: "grid", gap: "16px" }}>
              {projects.map((project) => (
                <div
                  key={project.id}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "24px",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      marginBottom: "16px",
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", margin: "0 0 8px 0" }}>
                        {project.name}
                      </h3>
                      <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>{project.description}</p>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span
                        style={{
                          backgroundColor: getPriorityColor(project.priority),
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "500",
                          textTransform: "capitalize",
                        }}
                      >
                        {project.priority}
                      </span>
                      <span
                        style={{
                          backgroundColor:
                            project.status === "completed"
                              ? "#10b981"
                              : project.status === "in-progress"
                                ? "#3b82f6"
                                : "#6b7280",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "500",
                          textTransform: "capitalize",
                        }}
                      >
                        {project.status.replace("-", " ")}
                      </span>
                    </div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "14px", color: "#6b7280" }}>Progress</span>
                      <span style={{ fontSize: "14px", fontWeight: "500", color: "#1f2937" }}>{project.progress}%</span>
                    </div>
                    <div style={{ width: "100%", height: "8px", backgroundColor: "#f3f4f6", borderRadius: "4px" }}>
                      <div
                        style={{
                          width: `${project.progress}%`,
                          height: "100%",
                          backgroundColor: "#3b82f6",
                          borderRadius: "4px",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", textAlign: "center" }}
                  >
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: "bold", color: "#1f2937" }}>
                        ${project.budget.toLocaleString()}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>Budget</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: "bold", color: "#1f2937" }}>
                        ${project.spent.toLocaleString()}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>Spent</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: "bold", color: "#1f2937" }}>
                        {project.teamMembers.length}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>Team Members</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
                marginBottom: "30px",
              }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#6b7280", margin: "0 0 8px 0" }}>
                  Total Team Members
                </h3>
                <div style={{ fontSize: "32px", fontWeight: "bold", color: "#1f2937" }}>{teamMembers.length}</div>
              </div>
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#6b7280", margin: "0 0 8px 0" }}>
                  Active Projects
                </h3>
                <div style={{ fontSize: "32px", fontWeight: "bold", color: "#1f2937" }}>
                  {projects.filter((p) => p.status === "in-progress").length}
                </div>
              </div>
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#6b7280", margin: "0 0 8px 0" }}>
                  Completed Tasks
                </h3>
                <div style={{ fontSize: "32px", fontWeight: "bold", color: "#1f2937" }}>
                  {tasks.filter((t) => t.status === "completed").length}
                </div>
              </div>
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#6b7280", margin: "0 0 8px 0" }}>
                  Team Efficiency
                </h3>
                <div style={{ fontSize: "32px", fontWeight: "bold", color: "#1f2937" }}>
                  {Math.round(teamMembers.reduce((sum, m) => sum + m.performance.efficiency, 0) / teamMembers.length)}%
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", marginBottom: "16px" }}>
                Team Performance Overview
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                {teamMembers.map((member) => (
                  <div key={member.id} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ minWidth: "150px", fontSize: "14px", fontWeight: "500", color: "#1f2937" }}>
                      {member.name}
                    </div>
                    <div style={{ flex: 1, height: "8px", backgroundColor: "#f3f4f6", borderRadius: "4px" }}>
                      <div
                        style={{
                          width: `${member.performance.efficiency}%`,
                          height: "100%",
                          backgroundColor: "#10b981",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        minWidth: "50px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#1f2937",
                        textAlign: "right",
                      }}
                    >
                      {member.performance.efficiency}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
