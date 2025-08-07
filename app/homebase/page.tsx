"use client"

import React, { useState } from "react"
import { Plus, Clock } from 'lucide-react'

export default function CommandDeckPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mission, setMission] = useState("")

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#e2e8f0" }}>
      {/* Hamburger Menu - Top Left */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          background: "#1e293b",
          border: "1px solid #334155",
          fontSize: "24px",
          cursor: "pointer",
          zIndex: 1000,
          color: "#e2e8f0",
          width: "50px",
          height: "50px",
          clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#334155"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#1e293b"
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
          backgroundColor: "#1e293b",
          transition: "left 0.3s ease",
          zIndex: 999,
          padding: "20px",
          borderRight: "1px solid #334155",
        }}
      >
        {/* Top section - Settings and Profile icons */}
        <div style={{ marginTop: "0px", marginBottom: "30px" }}>
          <div style={{ display: "flex", gap: "20px", justifyContent: "right" }}>
            <button
              style={{
                background: "#0f172a",
                border: "1px solid #334155",
                fontSize: "24px",
                cursor: "pointer",
                color: "#e2e8f0",
                width: "45px",
                height: "45px",
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              }}
            >
              ⚙️
            </button>
            <button
              style={{
                background: "#0f172a",
                border: "1px solid #334155",
                fontSize: "24px",
                cursor: "pointer",
                color: "#e2e8f0",
                width: "45px",
                height: "45px",
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              }}
            >
              👤
            </button>
          </div>
        </div>

        {/* Six vertically stacked buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { label: "Map", onClick: () => (window.location.href = "/main"), active: false },
            { label: "Command Deck", onClick: () => (window.location.href = "/homebase"), active: true },
            { label: "Health Check", onClick: () => (window.location.href = "/health-check"), active: false },
            { label: "Forecast", onClick: () => (window.location.href = "/forecast"), active: false },
            { label: "Reports", onClick: () => (window.location.href = "/reports"), active: false },
            { label: "Network", onClick: () => (window.location.href = "/network"), active: false },
          ].map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              style={{
                padding: "18px",
                fontSize: "16px",
                cursor: "pointer",
                border: "1px solid #334155",
                backgroundColor: item.active ? "#3b82f6" : "#0f172a",
                color: "#e2e8f0",
                width: "100%",
                clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                letterSpacing: "0.05em",
                fontWeight: "500",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (!item.active) {
                  e.currentTarget.style.backgroundColor = "#334155"
                }
              }}
              onMouseLeave={(e) => {
                if (!item.active) {
                  e.currentTarget.style.backgroundColor = "#0f172a"
                }
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "80px 40px 40px 40px", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "600", margin: "0", color: "#f1f5f9" }}>
            Command Deck
          </h1>
          <button
            style={{
              background: "transparent",
              border: "1px solid #475569",
              color: "#e2e8f0",
              padding: "12px 24px",
              fontSize: "16px",
              cursor: "pointer",
              clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#1e293b"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent"
            }}
          >
            Recalibrate
          </button>
        </div>

        {/* Set Your Mission Section */}
        <div style={{ marginBottom: "60px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px", color: "#f1f5f9" }}>
            Set Your Mission
          </h2>
          <textarea
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            placeholder="Describe your big goal..."
            style={{
              width: "100%",
              height: "120px",
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              color: "#e2e8f0",
              fontSize: "16px",
              padding: "20px",
              resize: "none",
              clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
              outline: "none",
              marginBottom: "20px",
            }}
          />
          <button
            style={{
              background: "#3b82f6",
              border: "1px solid #2563eb",
              color: "white",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#2563eb"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#3b82f6"
            }}
          >
            Generate Plan
          </button>
        </div>

        {/* Your Current Plan Section */}
        <div style={{ marginBottom: "60px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px", color: "#f1f5f9" }}>
            Your Current Plan
          </h2>
          
          <div
            style={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
              padding: "30px",
            }}
          >
            {/* Plan Views Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: "600", margin: "0", color: "#f1f5f9" }}>
                Plan Views
              </h3>
              
              <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                {/* Action Buttons */}
                <button
                  style={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    color: "#e2e8f0",
                    padding: "10px 16px",
                    fontSize: "14px",
                    cursor: "pointer",
                    clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#334155"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#0f172a"
                  }}
                >
                  <Plus size={16} />
                  Add Task
                </button>
                
                <button
                  style={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    color: "#e2e8f0",
                    padding: "10px 16px",
                    fontSize: "14px",
                    cursor: "pointer",
                    clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#334155"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#0f172a"
                  }}
                >
                  <Clock size={16} />
                  Task History
                </button>

                {/* View Toggle Buttons */}
                <div style={{ display: "flex", gap: "8px" }}>
                  {["Timeline", "Kanban", "Table"].map((view, index) => (
                    <button
                      key={view}
                      style={{
                        background: view === "Timeline" ? "#3b82f6" : "#0f172a",
                        border: "1px solid #334155",
                        color: "#e2e8f0",
                        padding: "10px 16px",
                        fontSize: "14px",
                        cursor: "pointer",
                        clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (view !== "Timeline") {
                          e.currentTarget.style.backgroundColor = "#334155"
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (view !== "Timeline") {
                          e.currentTarget.style.backgroundColor = "#0f172a"
                        }
                      }}
                    >
                      {view}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Timeline View */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", minHeight: "300px" }}>
              {/* Tasks Column */}
              <div
                style={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                  padding: "20px",
                }}
              >
                <div style={{ marginBottom: "15px" }}>
                  <h4 style={{ fontSize: "18px", fontWeight: "600", margin: "0 0 5px 0", color: "#f1f5f9" }}>
                    Tasks
                  </h4>
                  <p style={{ fontSize: "14px", color: "#94a3b8", margin: "0" }}>
                    0 records
                  </p>
                </div>
                <div style={{ textAlign: "center", color: "#64748b", fontSize: "14px", lineHeight: "1.5", marginTop: "40px" }}>
                  No tasks currently. Generate and implement a plan to see tasks here.
                </div>
              </div>

              {/* August 2025 Column */}
              <div
                style={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                  padding: "20px",
                }}
              >
                <div style={{ marginBottom: "15px", textAlign: "center" }}>
                  <h4 style={{ fontSize: "18px", fontWeight: "600", margin: "0 0 5px 0", color: "#f1f5f9" }}>
                    August
                  </h4>
                  <p style={{ fontSize: "14px", color: "#94a3b8", margin: "0" }}>
                    2025
                  </p>
                </div>
                <div style={{ textAlign: "center", color: "#64748b", fontSize: "14px", marginTop: "40px" }}>
                  Timeline will appear when tasks are added
                </div>
              </div>

              {/* September 2025 Column */}
              <div
                style={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                  padding: "20px",
                }}
              >
                <div style={{ marginBottom: "15px", textAlign: "center" }}>
                  <h4 style={{ fontSize: "18px", fontWeight: "600", margin: "0 0 5px 0", color: "#f1f5f9" }}>
                    September
                  </h4>
                  <p style={{ fontSize: "14px", color: "#94a3b8", margin: "0" }}>
                    2025
                  </p>
                </div>
                <div style={{ textAlign: "center", color: "#64748b", fontSize: "14px", marginTop: "40px" }}>
                  Timeline will appear when tasks are added
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Workload Section */}
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px", color: "#f1f5f9" }}>
            Team Workload
          </h2>
          
          <div
            style={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
              padding: "30px",
            }}
          >
            {[
              { name: "Sarah Chen", percentage: 45, status: "Underloaded", color: "#eab308" },
              { name: "Alex Johnson", percentage: 75, status: "Balanced", color: "#22c55e" },
              { name: "Mike Rodriguez", percentage: 92, status: "Overloaded", color: "#ef4444" },
              { name: "Emily Davis", percentage: 68, status: "Balanced", color: "#22c55e" },
              { name: "James Wilson", percentage: 34, status: "Underloaded", color: "#eab308" },
            ].map((member, index) => (
              <div key={index} style={{ marginBottom: index < 4 ? "25px" : "0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <h4 style={{ fontSize: "16px", fontWeight: "500", margin: "0", color: "#f1f5f9" }}>
                    {member.name}
                  </h4>
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <span style={{ fontSize: "14px", color: member.color, fontWeight: "500" }}>
                      {member.status}
                    </span>
                    <span style={{ fontSize: "14px", color: "#94a3b8", fontWeight: "500" }}>
                      {member.percentage}%
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    backgroundColor: "#334155",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${member.percentage}%`,
                      height: "100%",
                      backgroundColor: "#3b82f6",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            ))}
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
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 998,
          }}
        />
      )}
    </div>
  )
}
