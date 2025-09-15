"use client"

import { useState, useEffect } from "react"
import { FileText, ArrowLeft, Plus, Eye, Download, Edit3, Trash2 } from "lucide-react"
import { jsPDF } from "jspdf"

export default function ReportsPage() {
  const [currentView, setCurrentView] = useState<"history" | "form" | "generated" | "viewing" | "editing">("history")
  const [viewingReport, setViewingReport] = useState<any>(null)
  const [editingContent, setEditingContent] = useState<any>({})
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    audience: "",
    sections: {
      startupDescription: true,
      progressOverview: true,
      tractionMilestones: true,
      risksBottlenecks: true,
      productStrategy: true,
      forecastPriorities: true,
    },
    notes: "",
  })

  const [savedReports, setSavedReports] = useState<
    Array<{
      id: string
      title: string
      date: string
      period: string
      audience: string
      sections: any
      notes: string
      content: {
        startupDescription?: string
        progressOverview?: string
        tractionMilestones?: string[]
        risksBottlenecks?: string
        productStrategy?: string
        forecastPriorities?: string
        additionalNotes?: string
      }
    }>
  >([])

  useEffect(() => {
    const savedReportsFromStorage = sessionStorage.getItem("savedReports")
    if (savedReportsFromStorage) {
      setSavedReports(JSON.parse(savedReportsFromStorage))
    }
  }, [])

  useEffect(() => {
    if (savedReports.length > 0) {
      sessionStorage.setItem("savedReports", JSON.stringify(savedReports))
    }
  }, [savedReports])

  const handleSectionToggle = (section: keyof typeof formData.sections) => {
    setFormData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: !prev.sections[section],
      },
    }))
  }

  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const validateForm = () => {
    const errors = []
    if (!formData.title.trim()) errors.push("title")
    if (!formData.startDate) errors.push("startDate")
    if (!formData.endDate) errors.push("endDate")
    if (!formData.audience) errors.push("audience")

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      errors.push("dateRange")
    }

    return errors
  }

  const generateReport = () => {
    const errors = validateForm()
    if (errors.length > 0) {
      setValidationErrors(errors)
      const reportOverview = document.getElementById("report-overview")
      if (reportOverview) {
        reportOverview.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      return
    }
    setValidationErrors([])
    setCurrentView("generated")
  }

  const backToForm = () => {
    setCurrentView("form")
  }

  const showReportHistory = () => {
    setCurrentView("history")
  }

  const createFirstReport = () => {
    setCurrentView("form")
  }

  const viewReport = (report: any) => {
    setViewingReport(report)
    setCurrentView("viewing")
  }

  const backToHistory = () => {
    setViewingReport(null)
    setCurrentView("history")
  }

  const editReport = (report: any) => {
    setViewingReport(report)
    setEditingContent({
      title: report.title,
      startupDescription:
        report.content?.startupDescription ||
        "Our startup is focused on delivering innovative solutions that address key market challenges. We have built a strong foundation with a clear value proposition and growing market traction.",
      progressOverview:
        report.content?.progressOverview ||
        "This quarter we have successfully delivered 87% of our planned objectives while maintaining high quality standards and team satisfaction. Our development velocity has increased by 40% compared to the previous quarter.",
      tractionMilestones: report.content?.tractionMilestones || [
        "Completed major platform upgrade affecting 50,000+ users",
        "Reduced system downtime by 65% through infrastructure improvements",
        "Onboarded 3 new team members with full integration success",
        "Reduced system downtime by 65% through infrastructure improvements",
        "Onboarded 3 new team members with full integration success",
        "Achieved 94% customer satisfaction score in latest survey",
      ],
      risksBottlenecks:
        report.content?.risksBottlenecks ||
        "While progress has been strong, we face ongoing challenges in scaling our operations and maintaining quality as we grow. Resource allocation and team coordination remain key focus areas that require immediate attention.",
      productStrategy:
        report.content?.productStrategy ||
        "Our product roadmap is aligned with market demands and user feedback. We've prioritized features that drive user engagement and retention, with a focus on scalability and performance optimization.",
      forecastPriorities:
        report.content?.forecastPriorities ||
        "Looking ahead, we're prioritizing system optimization, team expansion, and strategic partnerships. Our AI-powered recommendations suggest focusing on automation and process refinement to achieve our next growth phase.",
      additionalNotes: report.content?.additionalNotes || report.notes || "",
    })
    setCurrentView("editing")
  }

  const saveEditedReport = () => {
    const updatedReport = {
      ...viewingReport,
      title: editingContent.title,
      content: {
        startupDescription: editingContent.startupDescription,
        progressOverview: editingContent.progressOverview,
        tractionMilestones: editingContent.tractionMilestones,
        risksBottlenecks: editingContent.risksBottlenecks,
        productStrategy: editingContent.productStrategy,
        forecastPriorities: editingContent.forecastPriorities,
        additionalNotes: editingContent.additionalNotes,
      },
    }

    setSavedReports((prev) => prev.map((report) => (report.id === viewingReport.id ? updatedReport : report)))

    setViewingReport(updatedReport)
    setCurrentView("viewing")
    alert("Report updated successfully!")
  }

  const cancelEdit = () => {
    setCurrentView("viewing")
  }

  const deleteReport = (report: any) => {
    const updatedReports = savedReports.filter((r) => r.id !== report.id)
    setSavedReports(updatedReports)
    localStorage.setItem("savedReports", JSON.stringify(updatedReports))
    setViewingReport(null)
    setCurrentView("history")
  }

  // Toggle Switch Component
  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      style={{
        width: "52px",
        height: "28px",
        backgroundColor: checked ? "#007bff" : "#3a3a3a",
        border: "2px solid " + (checked ? "#0056b3" : "#555"),
        borderRadius: "14px",
        position: "relative",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          backgroundColor: "#fff",
          borderRadius: "50%",
          position: "absolute",
          top: "2px",
          left: checked ? "28px" : "2px",
          transition: "all 0.2s ease",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  )

  // Hamburger Menu with Sidebar
  const HamburgerMenu = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
      <>
        <div style={{ position: "fixed", top: "20px", left: "20px", display: "flex", gap: "10px", zIndex: 1000 }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "#2a2a2a",
              border: "1px solid #444",
              fontSize: "24px",
              cursor: "pointer",
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
        </div>

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
              { label: "Health Check", onClick: () => (window.location.href = "/health-check"), active: false },
              { label: "Forecast", onClick: () => (window.location.href = "/forecast"), active: false },
              { label: "Reports", onClick: () => {}, active: true },
              { label: "Network", onClick: () => (window.location.href = "/network"), active: false },
              { label: "Team", onClick: () => (window.location.href = "/team"), active: false },
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
      </>
    )
  }

  const saveReport = () => {
    const newReport = {
      id: Date.now().toString(),
      title: formData.title || "Untitled Report",
      date: new Date().toLocaleDateString(),
      period:
        formData.startDate && formData.endDate
          ? `${new Date(formData.startDate).toLocaleDateString()} - ${new Date(formData.endDate).toLocaleDateString()}`
          : "",
      audience: formData.audience,
      sections: formData.sections,
      notes: formData.notes,
      content: {
        startupDescription: formData.sections.startupDescription
          ? "Our startup is focused on delivering innovative solutions that address key market challenges. We have built a strong foundation with a clear value proposition and growing market traction."
          : undefined,
        progressOverview: formData.sections.progressOverview
          ? "This quarter we have successfully delivered 87% of our planned objectives while maintaining high quality standards and team satisfaction. Our development velocity has increased by 40% compared to the previous quarter."
          : undefined,
        tractionMilestones: formData.sections.tractionMilestones
          ? [
              "Completed major platform upgrade affecting 50,000+ users",
              "Reduced system downtime by 65% through infrastructure improvements",
              "Achieved 94% customer satisfaction score in latest survey",
            ]
          : undefined,
        risksBottlenecks: formData.sections.risksBottlenecks
          ? "While progress has been strong, we face ongoing challenges in scaling our operations and maintaining quality as we grow. Resource allocation and team coordination remain key focus areas that require immediate attention."
          : undefined,
        productStrategy: formData.sections.productStrategy
          ? "Our product roadmap is aligned with market demands and user feedback. We've prioritized features that drive user engagement and retention, with a focus on scalability and performance optimization."
          : undefined,
        forecastPriorities: formData.sections.forecastPriorities
          ? "Looking ahead, we're prioritizing system optimization, team expansion, and strategic partnerships. Our AI-powered recommendations suggest focusing on automation and process refinement to achieve our next growth phase."
          : undefined,
        additionalNotes: formData.notes || undefined,
      },
    }

    setSavedReports((prev) => [newReport, ...prev])
    setCurrentView("history")
  }

  const downloadPDF = (report?: any) => {
    const reportToDownload = report ||
      viewingReport || {
        title: formData.title || "Generated Report",
        startDate: formData.startDate,
        endDate: formData.endDate,
        audience: formData.audience,
        date: new Date().toLocaleDateString(),
        sections: formData.sections,
        content: {
          startupDescription: formData.sections.startupDescription
            ? "Our startup is focused on delivering innovative solutions that address key market challenges. We have built a strong foundation with a clear value proposition and growing market traction."
            : undefined,
          progressOverview: formData.sections.progressOverview
            ? "This quarter we have successfully delivered 87% of our planned objectives while maintaining high quality standards and team satisfaction. Our development velocity has increased by 40% compared to the previous quarter."
            : undefined,
          tractionMilestones: formData.sections.tractionMilestones
            ? [
                "Completed major platform upgrade affecting 50,000+ users",
                "Reduced system downtime by 65% through infrastructure improvements",
                "Achieved 94% customer satisfaction score in latest survey",
              ]
            : undefined,
          risksBottlenecks: formData.sections.risksBottlenecks
            ? "While progress has been strong, we face ongoing challenges in scaling our operations and maintaining quality as we grow. Resource allocation and team coordination remain key focus areas that require immediate attention."
            : undefined,
          productStrategy: formData.sections.productStrategy
            ? "Our product roadmap is aligned with market demands and user feedback. We've prioritized features that drive user engagement and retention, with a focus on scalability and performance optimization."
            : undefined,
          forecastPriorities: formData.sections.forecastPriorities
            ? "Looking ahead, we're prioritizing system optimization, team expansion, and strategic partnerships. Our AI-powered recommendations suggest focusing on automation and process refinement to achieve our next growth phase."
            : undefined,
          additionalNotes: formData.notes || undefined,
        },
        notes: formData.notes,
      }

    const pdfContent = `
REPORT: ${reportToDownload.title}

REPORTING PERIOD: ${reportToDownload.startDate ? new Date(reportToDownload.startDate).toLocaleDateString() : "N/A"} - ${reportToDownload.endDate ? new Date(reportToDownload.endDate).toLocaleDateString() : "N/A"}

AUDIENCE: ${reportToDownload.audience}

${
  reportToDownload.content.startupDescription
    ? `
STARTUP DESCRIPTION:
${reportToDownload.content.startupDescription}
`
    : ""
}

${
  reportToDownload.content.progressOverview
    ? `
PROGRESS OVERVIEW:
${reportToDownload.content.progressOverview}
`
    : ""
}

${
  reportToDownload.content.tractionMilestones
    ? `
TRACTION & MILESTONES:
${reportToDownload.content.tractionMilestones.map((milestone: string, index: number) => `${index + 1}. ${milestone}`).join("\n")}
`
    : ""
}

${
  reportToDownload.content.risksBottlenecks
    ? `
RISKS & BOTTLENECKS:
${reportToDownload.content.risksBottlenecks}
`
    : ""
}

${
  reportToDownload.content.productStrategy
    ? `
PRODUCT STRATEGY:
${reportToDownload.content.productStrategy}
`
    : ""
}

${
  reportToDownload.content.forecastPriorities
    ? `
FORECAST & PRIORITIES:
${reportToDownload.content.forecastPriorities}
`
    : ""
}

${
  reportToDownload.content.additionalNotes
    ? `
ADDITIONAL NOTES:
${reportToDownload.content.additionalNotes}
`
    : ""
}
`.trim()

    // Use jsPDF for proper PDF generation
    const doc = new jsPDF()

    // Set font and add content
    doc.setFontSize(16)
    doc.text(reportToDownload.title, 20, 20)

    doc.setFontSize(12)
    const dateRange = `${reportToDownload.startDate ? new Date(reportToDownload.startDate).toLocaleDateString() : "N/A"} - ${reportToDownload.endDate ? new Date(reportToDownload.endDate).toLocaleDateString() : "N/A"}`
    doc.text(`Reporting Period: ${dateRange}`, 20, 35)
    doc.text(`Audience: ${reportToDownload.audience}`, 20, 45)

    // Add content sections
    let yPosition = 65 // Adjust starting position since we removed Generated Date
    const lineHeight = 7
    const pageHeight = doc.internal.pageSize.height
    const margin = 20

    const addSection = (title: string, content: string) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(14)
      doc.text(title, margin, yPosition)
      yPosition += lineHeight + 3

      doc.setFontSize(10)
      const lines = doc.splitTextToSize(content, doc.internal.pageSize.width - 2 * margin)
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(line, margin, yPosition)
        yPosition += lineHeight
      })
      yPosition += 10
    }

    if (reportToDownload.content.startupDescription) {
      addSection("STARTUP DESCRIPTION", reportToDownload.content.startupDescription)
    }

    if (reportToDownload.content.progressOverview) {
      addSection("PROGRESS OVERVIEW", reportToDownload.content.progressOverview)
    }

    if (reportToDownload.content.tractionMilestones) {
      const milestonesText = reportToDownload.content.tractionMilestones
        .map((milestone: string, index: number) => `${index + 1}. ${milestone}`)
        .join("\n")
      addSection("TRACTION & MILESTONES", milestonesText)
    }

    if (reportToDownload.content.risksBottlenecks) {
      addSection("RISKS & BOTTLENECKS", reportToDownload.content.risksBottlenecks)
    }

    if (reportToDownload.content.productStrategy) {
      addSection("PRODUCT STRATEGY", reportToDownload.content.productStrategy)
    }

    if (reportToDownload.content.forecastPriorities) {
      addSection("FORECAST & PRIORITIES", reportToDownload.content.forecastPriorities)
    }

    if (reportToDownload.content.additionalNotes) {
      addSection("ADDITIONAL NOTES", reportToDownload.content.additionalNotes)
    }

    // Save the PDF
    const fileName = `${reportToDownload.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_report.pdf`
    doc.save(fileName)
  }

  // Main Header Component
  const MainHeader = () => (
    <div style={{ textAlign: "center", marginBottom: "40px" }}>
      <h1
        style={{
          textAlign: "center",
          fontSize: "42px",
          fontWeight: "300",
          marginBottom: "12px",
          letterSpacing: "0.02em",
          color: "#ffffff",
        }}
      >
        Reports
      </h1>
      <p style={{ fontSize: "18px", color: "#999", lineHeight: "1.5" }}>
        Generate comprehensive reports for all of your stakeholders
      </p>
    </div>
  )

  // Navigation Tabs Component
  const NavigationTabs = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "40px",
        gap: "4px",
        backgroundColor: "#2a2a2a",
        padding: "6px",
        borderRadius: "12px",
        border: "1px solid #444",
        maxWidth: "400px",
        margin: "0 auto 40px auto",
      }}
    >
      <button
        onClick={() => setCurrentView("history")}
        style={{
          padding: "12px 24px",
          fontSize: "15px",
          backgroundColor: currentView === "history" ? "#007bff" : "transparent",
          color: currentView === "history" ? "#fff" : "#ccc",
          border: "none",
          cursor: "pointer",
          borderRadius: "8px",
          fontWeight: "500",
          letterSpacing: "0.02em",
          transition: "all 0.2s ease",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
        onMouseEnter={(e) => {
          if (currentView !== "history") {
            e.currentTarget.style.backgroundColor = "#3a3a3a"
            e.currentTarget.style.color = "#fff"
          }
        }}
        onMouseLeave={(e) => {
          if (currentView !== "history") {
            e.currentTarget.style.backgroundColor = "transparent"
            e.currentTarget.style.color = "#ccc"
          }
        }}
      >
        <FileText size={16} />
        History
      </button>
      <button
        onClick={() => setCurrentView("form")}
        style={{
          padding: "12px 24px",
          fontSize: "15px",
          backgroundColor: currentView === "form" ? "#007bff" : "transparent",
          color: currentView === "form" ? "#fff" : "#ccc",
          border: "none",
          cursor: "pointer",
          borderRadius: "8px",
          fontWeight: "500",
          letterSpacing: "0.02em",
          transition: "all 0.2s ease",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
        onMouseEnter={(e) => {
          if (currentView !== "form") {
            e.currentTarget.style.backgroundColor = "#3a3a3a"
            e.currentTarget.style.color = "#fff"
          }
        }}
        onMouseLeave={(e) => {
          if (currentView !== "form") {
            e.currentTarget.style.backgroundColor = "transparent"
            e.currentTarget.style.color = "#ccc"
          }
        }}
      >
        <Plus size={16} />
        Create Report
      </button>
    </div>
  )

  if (currentView === "editing" && viewingReport) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#1a1a1a", color: "#e0e0e0" }}>
        <HamburgerMenu />

        <div style={{ padding: "100px 20px 40px", maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <input
              type="text"
              value={editingContent.title}
              onChange={(e) => setEditingContent((prev) => ({ ...prev, title: e.target.value }))}
              style={{
                fontSize: "36px",
                fontWeight: "400",
                marginBottom: "16px",
                letterSpacing: "0.02em",
                color: "#ffffff",
                backgroundColor: "transparent",
                border: "2px solid #444",
                borderRadius: "8px",
                padding: "12px 16px",
                textAlign: "center",
                width: "100%",
                maxWidth: "600px",
                outline: "none",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#007bff"
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#444"
              }}
            />
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "12px" }}>
              {viewingReport.period && <span style={{ fontSize: "16px", color: "#999" }}>{viewingReport.period}</span>}
              {viewingReport.audience && (
                <span style={{ fontSize: "16px", color: "#999" }}>
                  {viewingReport.audience.charAt(0).toUpperCase() + viewingReport.audience.slice(1)}
                </span>
              )}
            </div>
            <p style={{ fontSize: "14px", color: "#666" }}>Generated on {viewingReport.date}</p>
          </div>

          <div
            style={{
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              borderRadius: "16px",
              padding: "40px",
              marginBottom: "30px",
            }}
          >
            {viewingReport.sections?.startupDescription && (
              <>
                <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                  Startup Description
                </h3>
                <textarea
                  value={editingContent.startupDescription}
                  onChange={(e) => setEditingContent((prev) => ({ ...prev, startupDescription: e.target.value }))}
                  style={{
                    width: "100%",
                    minHeight: "120px",
                    fontSize: "16px",
                    lineHeight: "1.7",
                    color: "#e0e0e0",
                    backgroundColor: "#1a1a1a",
                    border: "2px solid #444",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "32px",
                    outline: "none",
                    resize: "vertical",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#007bff"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#444"
                  }}
                />
              </>
            )}

            {viewingReport.sections?.progressOverview && (
              <>
                <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                  Progress Overview
                </h3>
                <textarea
                  value={editingContent.progressOverview}
                  onChange={(e) => setEditingContent((prev) => ({ ...prev, progressOverview: e.target.value }))}
                  style={{
                    width: "100%",
                    minHeight: "120px",
                    fontSize: "16px",
                    lineHeight: "1.7",
                    color: "#e0e0e0",
                    backgroundColor: "#1a1a1a",
                    border: "2px solid #444",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "32px",
                    outline: "none",
                    resize: "vertical",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#007bff"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#444"
                  }}
                />
              </>
            )}

            {viewingReport.sections?.tractionMilestones && (
              <>
                <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                  Traction & Milestones
                </h3>
                <div style={{ marginBottom: "32px" }}>
                  {editingContent.tractionMilestones.map((milestone: string, index: number) => (
                    <div
                      key={index}
                      style={{ display: "flex", gap: "12px", marginBottom: "12px", alignItems: "center" }}
                    >
                      <input
                        type="text"
                        value={milestone}
                        onChange={(e) => {
                          const newMilestones = [...editingContent.tractionMilestones]
                          newMilestones[index] = e.target.value
                          setEditingContent((prev) => ({ ...prev, tractionMilestones: newMilestones }))
                        }}
                        style={{
                          flex: 1,
                          fontSize: "16px",
                          color: "#e0e0e0",
                          backgroundColor: "#1a1a1a",
                          border: "2px solid #444",
                          borderRadius: "8px",
                          padding: "12px 16px",
                          outline: "none",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#007bff"
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#444"
                        }}
                      />
                      <button
                        onClick={() => {
                          const newMilestones = editingContent.tractionMilestones.filter((_, i) => i !== index)
                          setEditingContent((prev) => ({ ...prev, tractionMilestones: newMilestones }))
                        }}
                        style={{
                          padding: "8px",
                          backgroundColor: "#dc3545",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setEditingContent((prev) => ({
                        ...prev,
                        tractionMilestones: [...prev.tractionMilestones, "New milestone"],
                      }))
                    }}
                    style={{
                      padding: "12px 20px",
                      backgroundColor: "#28a745",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Plus size={16} />
                    Add Milestone
                  </button>
                </div>
              </>
            )}

            {viewingReport.sections?.risksBottlenecks && (
              <>
                <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                  Risks & Bottlenecks
                </h3>
                <textarea
                  value={editingContent.risksBottlenecks}
                  onChange={(e) => setEditingContent((prev) => ({ ...prev, risksBottlenecks: e.target.value }))}
                  style={{
                    width: "100%",
                    minHeight: "120px",
                    fontSize: "16px",
                    lineHeight: "1.7",
                    color: "#e0e0e0",
                    backgroundColor: "#1a1a1a",
                    border: "2px solid #444",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "32px",
                    outline: "none",
                    resize: "vertical",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#007bff"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#444"
                  }}
                />
              </>
            )}

            {viewingReport.sections?.productStrategy && (
              <>
                <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                  Product & Strategy Snapshot
                </h3>
                <textarea
                  value={editingContent.productStrategy}
                  onChange={(e) => setEditingContent((prev) => ({ ...prev, productStrategy: e.target.value }))}
                  style={{
                    width: "100%",
                    minHeight: "120px",
                    fontSize: "16px",
                    lineHeight: "1.7",
                    color: "#e0e0e0",
                    backgroundColor: "#1a1a1a",
                    border: "2px solid #444",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "32px",
                    outline: "none",
                    resize: "vertical",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#007bff"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#444"
                  }}
                />
              </>
            )}

            {viewingReport.sections?.forecastPriorities && (
              <>
                <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                  Forecast & Priorities
                </h3>
                <textarea
                  value={editingContent.forecastPriorities}
                  onChange={(e) => setEditingContent((prev) => ({ ...prev, forecastPriorities: e.target.value }))}
                  style={{
                    width: "100%",
                    minHeight: "120px",
                    fontSize: "16px",
                    lineHeight: "1.7",
                    color: "#e0e0e0",
                    backgroundColor: "#1a1a1a",
                    border: "2px solid #444",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "32px",
                    outline: "none",
                    resize: "vertical",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#007bff"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#444"
                  }}
                />
              </>
            )}

            <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
              Additional Notes
            </h3>
            <textarea
              value={editingContent.additionalNotes}
              onChange={(e) => setEditingContent((prev) => ({ ...prev, additionalNotes: e.target.value }))}
              style={{
                width: "100%",
                minHeight: "120px",
                fontSize: "16px",
                lineHeight: "1.7",
                color: "#e0e0e0",
                backgroundColor: "#1a1a1a",
                border: "2px solid #444",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "32px",
                outline: "none",
                resize: "vertical",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#007bff"
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#444"
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={saveEditedReport}
              style={{
                padding: "14px 28px",
                fontSize: "16px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                borderRadius: "8px",
                fontWeight: "500",
                letterSpacing: "0.02em",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)"
                e.currentTarget.style.boxShadow = "none"
              }}
            >
              Save Changes
            </button>
            <button
              onClick={cancelEdit}
              style={{
                padding: "14px 28px",
                fontSize: "16px",
                backgroundColor: "#6c757d",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                borderRadius: "8px",
                fontWeight: "500",
                letterSpacing: "0.02em",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)"
                e.currentTarget.style.boxShadow = "none"
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentView === "form") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#1a1a1a", color: "#e0e0e0" }}>
        <HamburgerMenu />

        <div style={{ padding: "100px 20px 40px", maxWidth: "1000px", margin: "0 auto" }}>
          <MainHeader />
          <NavigationTabs />

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ fontSize: "18px", color: "#ccc", marginBottom: "8px" }}>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                style={{
                  fontSize: "16px",
                  color: "#e0e0e0",
                  backgroundColor: "#1a1a1a",
                  border: "2px solid #444",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#007bff"
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#444"
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "18px", color: "#ccc", marginBottom: "8px" }}>Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                style={{
                  fontSize: "16px",
                  color: "#e0e0e0",
                  backgroundColor: "#1a1a1a",
                  border: "2px solid #444",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#007bff"
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#444"
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "18px", color: "#ccc", marginBottom: "8px" }}>End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                style={{
                  fontSize: "16px",
                  color: "#e0e0e0",
                  backgroundColor: "#1a1a1a",
                  border: "2px solid #444",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#007bff"
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#444"
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "18px", color: "#ccc", marginBottom: "8px" }}>Audience</label>
              <input
                type="text"
                value={formData.audience}
                onChange={(e) => setFormData((prev) => ({ ...prev, audience: e.target.value }))}
                style={{
                  fontSize: "16px",
                  color: "#e0e0e0",
                  backgroundColor: "#1a1a1a",
                  border: "2px solid #444",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#007bff"
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#444"
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "18px", color: "#ccc", marginBottom: "8px" }}>Sections</label>
              <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
                {Object.keys(formData.sections).map((section) => (
                  <ToggleSwitch
                    key={section}
                    checked={formData.sections[section]}
                    onChange={() => handleSectionToggle(section as keyof typeof formData.sections)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: "18px", color: "#ccc", marginBottom: "8px" }}>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                style={{
                  width: "100%",
                  minHeight: "120px",
                  fontSize: "16px",
                  lineHeight: "1.7",
                  color: "#e0e0e0",
                  backgroundColor: "#1a1a1a",
                  border: "2px solid #444",
                  borderRadius: "8px",
                  padding: "16px",
                  outline: "none",
                  resize: "vertical",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#007bff"
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#444"
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={generateReport}
                style={{
                  padding: "14px 28px",
                  fontSize: "16px",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "8px",
                  fontWeight: "500",
                  letterSpacing: "0.02em",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                Generate Report
              </button>
              <button
                onClick={backToHistory}
                style={{
                  padding: "14px 28px",
                  fontSize: "16px",
                  backgroundColor: "#6c757d",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "8px",
                  fontWeight: "500",
                  letterSpacing: "0.02em",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                Cancel
              </button>
            </div>

            {validationErrors.length > 0 && (
              <div style={{ textAlign: "center", color: "#dc3545", marginTop: "20px" }}>
                Please fill in the following fields:
                <ul style={{ listStyleType: "none", padding: 0 }}>
                  {validationErrors.map((error) => (
                    <li key={error} style={{ marginBottom: "8px" }}>
                      {error.charAt(0).toUpperCase() + error.slice(1)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (currentView === "history") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#1a1a1a", color: "#e0e0e0" }}>
        <HamburgerMenu />

        <div style={{ padding: "100px 20px 40px", maxWidth: "1000px", margin: "0 auto" }}>
          <MainHeader />
          <NavigationTabs />

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {savedReports.map((report) => (
              <div key={report.id} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "500", color: "#fff" }}>{report.title}</h2>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={() => viewReport(report)}
                    style={{
                      padding: "10px 20px",
                      fontSize: "14px",
                      backgroundColor: "#007bff",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "6px",
                    }}
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => editReport(report)}
                    style={{
                      padding: "10px 20px",
                      fontSize: "14px",
                      backgroundColor: "#28a745",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "6px",
                    }}
                  >
                    <Edit3 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => downloadPDF(report)}
                    style={{
                      padding: "10px 20px",
                      fontSize: "14px",
                      backgroundColor: "#0056b3",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "6px",
                    }}
                  >
                    <Download size={16} />
                    Download
                  </button>
                  <button
                    onClick={() => deleteReport(report)}
                    style={{
                      padding: "10px 20px",
                      fontSize: "14px",
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "6px",
                    }}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={createFirstReport}
              style={{
                padding: "14px 28px",
                fontSize: "16px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                borderRadius: "8px",
                fontWeight: "500",
                letterSpacing: "0.02em",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)"
                e.currentTarget.style.boxShadow = "none"
              }}
            >
              Create First Report
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentView === "generated") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#1a1a1a", color: "#e0e0e0" }}>
        <HamburgerMenu />

        <div style={{ padding: "100px 20px 40px", maxWidth: "1000px", margin: "0 auto" }}>
          <MainHeader />
          <NavigationTabs />

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "500", color: "#fff" }}>Generated Report</h2>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => downloadPDF()}
                style={{
                  padding: "14px 28px",
                  fontSize: "16px",
                  backgroundColor: "#0056b3",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "8px",
                  fontWeight: "500",
                  letterSpacing: "0.02em",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                <Download size={16} />
                Download PDF
              </button>
              <button
                onClick={backToForm}
                style={{
                  padding: "14px 28px",
                  fontSize: "16px",
                  backgroundColor: "#6c757d",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "8px",
                  fontWeight: "500",
                  letterSpacing: "0.02em",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                <ArrowLeft size={16} />
                Back to Form
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentView === "viewing" && viewingReport) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#1a1a1a", color: "#e0e0e0" }}>
        <HamburgerMenu />

        <div style={{ padding: "100px 20px 40px", maxWidth: "1000px", margin: "0 auto" }}>
          <MainHeader />
          <NavigationTabs />

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "500", color: "#fff" }}>{viewingReport.title}</h2>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => downloadPDF(viewingReport)}
                style={{
                  padding: "14px 28px",
                  fontSize: "16px",
                  backgroundColor: "#0056b3",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "8px",
                  fontWeight: "500",
                  letterSpacing: "0.02em",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                <Download size={16} />
                Download PDF
              </button>
              <button
                onClick={() => editReport(viewingReport)}
                style={{
                  padding: "14px 28px",
                  fontSize: "16px",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "8px",
                  fontWeight: "500",
                  letterSpacing: "0.02em",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                <Edit3 size={16} />
                Edit Report
              </button>
              <button
                onClick={backToHistory}
                style={{
                  padding: "14px 28px",
                  fontSize: "16px",
                  backgroundColor: "#6c757d",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "8px",
                  fontWeight: "500",
                  letterSpacing: "0.02em",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                <ArrowLeft size={16} />
                Back to History
              </button>
            </div>

            <div
              style={{
                backgroundColor: "#2a2a2a",
                border: "1px solid #444",
                borderRadius: "16px",
                padding: "40px",
                marginBottom: "30px",
              }}
            >
              {viewingReport.sections?.startupDescription && (
                <>
                  <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                    Startup Description
                  </h3>
                  <p style={{ fontSize: "16px", color: "#e0e0e0" }}>{viewingReport.content.startupDescription}</p>
                </>
              )}

              {viewingReport.sections?.progressOverview && (
                <>
                  <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                    Progress Overview
                  </h3>
                  <p style={{ fontSize: "16px", color: "#e0e0e0" }}>{viewingReport.content.progressOverview}</p>
                </>
              )}

              {viewingReport.sections?.tractionMilestones && (
                <>
                  <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                    Traction & Milestones
                  </h3>
                  <ul style={{ listStyleType: "none", padding: 0 }}>
                    {viewingReport.content.tractionMilestones.map((milestone: string, index: number) => (
                      <li key={index} style={{ marginBottom: "8px", fontSize: "16px", color: "#e0e0e0" }}>
                        {milestone}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {viewingReport.sections?.risksBottlenecks && (
                <>
                  <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                    Risks & Bottlenecks
                  </h3>
                  <p style={{ fontSize: "16px", color: "#e0e0e0" }}>{viewingReport.content.risksBottlenecks}</p>
                </>
              )}

              {viewingReport.sections?.productStrategy && (
                <>
                  <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                    Product & Strategy Snapshot
                  </h3>
                  <p style={{ fontSize: "16px", color: "#e0e0e0" }}>{viewingReport.content.productStrategy}</p>
                </>
              )}

              {viewingReport.sections?.forecastPriorities && (
                <>
                  <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                    Forecast & Priorities
                  </h3>
                  <p style={{ fontSize: "16px", color: "#e0e0e0" }}>{viewingReport.content.forecastPriorities}</p>
                </>
              )}

              {viewingReport.content.additionalNotes && (
                <>
                  <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                    Additional Notes
                  </h3>
                  <p style={{ fontSize: "16px", color: "#e0e0e0" }}>{viewingReport.content.additionalNotes}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
