"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"

interface Report {
  id: string
  title: string
  type: "financial" | "performance" | "analytics" | "compliance"
  status: "draft" | "completed" | "scheduled" | "failed"
  createdDate: string
  lastModified: string
  size: string
  description: string
  author: string
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "financial" | "performance" | "analytics">("all")
  const [reports, setReports] = useState<Report[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    // Initialize with mock reports
    setReports([
      {
        id: uuidv4(),
        title: "Monthly Financial Summary - January 2024",
        type: "financial",
        status: "completed",
        createdDate: "2024-02-01",
        lastModified: "2024-02-01",
        size: "2.4 MB",
        description: "Comprehensive financial overview including revenue, expenses, and profit analysis",
        author: "Sarah Johnson",
      },
      {
        id: uuidv4(),
        title: "Team Performance Report Q1 2024",
        type: "performance",
        status: "completed",
        createdDate: "2024-01-28",
        lastModified: "2024-01-30",
        size: "1.8 MB",
        description: "Detailed analysis of team productivity, task completion rates, and efficiency metrics",
        author: "Mike Chen",
      },
      {
        id: uuidv4(),
        title: "User Analytics Dashboard Export",
        type: "analytics",
        status: "completed",
        createdDate: "2024-01-25",
        lastModified: "2024-01-25",
        size: "3.2 MB",
        description: "User behavior analysis, engagement metrics, and conversion funnel data",
        author: "Emily Rodriguez",
      },
      {
        id: uuidv4(),
        title: "Compliance Audit Report 2024",
        type: "compliance",
        status: "draft",
        createdDate: "2024-01-20",
        lastModified: "2024-01-22",
        size: "1.1 MB",
        description: "Annual compliance review covering regulatory requirements and internal policies",
        author: "David Kim",
      },
      {
        id: uuidv4(),
        title: "Revenue Forecast Analysis",
        type: "financial",
        status: "scheduled",
        createdDate: "2024-01-15",
        lastModified: "2024-01-15",
        size: "0.9 MB",
        description: "Projected revenue analysis for next quarter with scenario planning",
        author: "Sarah Johnson",
      },
      {
        id: uuidv4(),
        title: "System Performance Metrics",
        type: "performance",
        status: "failed",
        createdDate: "2024-01-10",
        lastModified: "2024-01-10",
        size: "0.0 MB",
        description: "Infrastructure performance analysis and optimization recommendations",
        author: "David Kim",
      },
    ])
  }, [])

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "all" || report.type === activeTab
    return matchesSearch && matchesTab
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10b981"
      case "draft":
        return "#f59e0b"
      case "scheduled":
        return "#3b82f6"
      case "failed":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "financial":
        return "#059669"
      case "performance":
        return "#7c3aed"
      case "analytics":
        return "#dc2626"
      case "compliance":
        return "#ea580c"
      default:
        return "#6b7280"
    }
  }

  const generateNewReport = async () => {
    setIsGenerating(true)
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const newReport: Report = {
      id: uuidv4(),
      title: `Generated Report - ${new Date().toLocaleDateString()}`,
      type: "analytics",
      status: "completed",
      createdDate: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
      size: "2.1 MB",
      description: "Auto-generated comprehensive business report with latest metrics and insights",
      author: "System Generated",
    }

    setReports((prev) => [newReport, ...prev])
    setIsGenerating(false)
  }

  const downloadReport = (reportId: string) => {
    // Simulate download
    const report = reports.find((r) => r.id === reportId)
    if (report) {
      alert(`Downloading: ${report.title}`)
    }
  }

  const deleteReport = (reportId: string) => {
    setReports((prev) => prev.filter((r) => r.id !== reportId))
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", padding: "20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#1f2937", marginBottom: "8px" }}>
              Reports & Analytics
            </h1>
            <p style={{ color: "#6b7280", fontSize: "16px" }}>Generate, manage, and download business reports</p>
          </div>
          <button
            onClick={generateNewReport}
            disabled={isGenerating}
            style={{
              padding: "12px 24px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: isGenerating ? "not-allowed" : "pointer",
              opacity: isGenerating ? 0.6 : 1,
            }}
          >
            {isGenerating ? "Generating..." : "+ Generate Report"}
          </button>
        </div>

        {/* Search and Stats */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "30px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              maxWidth: "400px",
              padding: "12px 16px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "16px",
              backgroundColor: "white",
            }}
          />
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#1f2937" }}>{reports.length}</div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>Total Reports</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#10b981" }}>
                {reports.filter((r) => r.status === "completed").length}
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>Completed</div>
            </div>
          </div>
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
            {(["all", "financial", "performance", "analytics"] as const).map((tab) => (
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

        {/* Reports Grid */}
        <div style={{ display: "grid", gap: "16px" }}>
          {filteredReports.map((report) => (
            <div
              key={report.id}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", margin: 0 }}>{report.title}</h3>
                    <span
                      style={{
                        backgroundColor: getTypeColor(report.type),
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "500",
                        textTransform: "capitalize",
                      }}
                    >
                      {report.type}
                    </span>
                    <span
                      style={{
                        backgroundColor: getStatusColor(report.status),
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "500",
                        textTransform: "capitalize",
                      }}
                    >
                      {report.status}
                    </span>
                  </div>
                  <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 12px 0" }}>{report.description}</p>
                  <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "#6b7280" }}>
                    <span>By {report.author}</span>
                    <span>Created: {new Date(report.createdDate).toLocaleDateString()}</span>
                    <span>Size: {report.size}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", marginLeft: "16px" }}>
                  {report.status === "completed" && (
                    <button
                      onClick={() => downloadReport(report.id)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#10b981",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      Download
                    </button>
                  )}
                  <button
                    onClick={() => deleteReport(report.id)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div style={{ textAlign: "center", marginTop: "60px" }}>
            <p style={{ fontSize: "18px", color: "#6b7280", marginBottom: "20px" }}>
              No reports found matching your criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm("")
                setActiveTab("all")
              }}
              style={{
                padding: "8px 16px",
                backgroundColor: "#f3f4f6",
                color: "#374151",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
