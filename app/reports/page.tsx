"use client"

import { useState, useEffect } from "react"
import { FileText, ArrowLeft, Plus, Eye, Download, Send, Edit3, Save, X } from "lucide-react"

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
    return errors
  }

  const generateReport = () => {
    const errors = validateForm()
    if (errors.length > 0) {
      setValidationErrors(errors)
      const errorMessages = []
      if (errors.includes("title")) errorMessages.push("Report Title is required")
      if (errors.includes("startDate")) errorMessages.push("Start Date is required")
      if (errors.includes("endDate")) errorMessages.push("End Date is required")
      if (errors.includes("audience")) errorMessages.push("Audience is required")
      alert("Please fill in all required fields:\n" + errorMessages.join("\n"))
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

          <button
            onClick={() => (window.location.href = "/main")}
            style={{
              background: "#2a2a2a",
              border: "1px solid #444",
              fontSize: "20px",
              cursor: "pointer",
              color: "#e0e0e0",
              width: "50px",
              height: "50px",
              clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#3a3a3a"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#2a2a2a"
            }}
            title="Back to Main"
          >
            ←
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
      period: formData.period,
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
    alert("Report saved successfully!")
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
    try {
      // Import jsPDF dynamically
      import("jspdf")
        .then((jsPDF) => {
          const { jsPDF: PDF } = jsPDF
          const doc = new PDF()

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
        })
        .catch((error) => {
          console.error("Error loading jsPDF:", error)
          // Fallback: create a text file
          const blob = new Blob([pdfContent], { type: "text/plain" })
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `${reportToDownload.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_report.txt`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        })
    } catch (error) {
      console.error("Error generating PDF:", error)
      // Fallback: create a text file
      const blob = new Blob([pdfContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${reportToDownload.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_report.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  // Main Header Component
  const MainHeader = () => (
    <div style={{ textAlign: "center", marginBottom: "40px" }}>
      <h1
        style={{
          fontSize: "42px",
          fontWeight: "300",
          marginBottom: "12px",
          letterSpacing: "0.02em",
          color: "#ffffff",
        }}
      >
        Stakeholder Reports
      </h1>
      <p style={{ fontSize: "18px", color: "#999", lineHeight: "1.5" }}>
        Generate comprehensive reports for your investors, mentors, and stakeholders
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
          <div style={{ marginBottom: "40px" }}>
            <button
              onClick={cancelEdit}
              style={{
                padding: "12px 20px",
                fontSize: "15px",
                backgroundColor: "#2a2a2a",
                color: "#e0e0e0",
                border: "1px solid #444",
                cursor: "pointer",
                borderRadius: "8px",
                fontWeight: "500",
                letterSpacing: "0.02em",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "30px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#3a3a3a"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#2a2a2a"
              }}
            >
              <X size={16} />
              Cancel Edit
            </button>

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
                {viewingReport.period && (
                  <span style={{ fontSize: "16px", color: "#999" }}>
                    {new Date(viewingReport.period).toLocaleDateString()}
                  </span>
                )}
                {viewingReport.audience && (
                  <span style={{ fontSize: "16px", color: "#999" }}>
                    {viewingReport.audience.charAt(0).toUpperCase() + viewingReport.audience.slice(1)}
                  </span>
                )}
              </div>
              <p style={{ fontSize: "14px", color: "#666" }}>Generated on {viewingReport.date}</p>
            </div>
          </div>

          {/* Editable Report Content */}
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
              <div style={{ marginBottom: "40px" }}>
                <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                  Startup Description
                </h3>
                <textarea
                  value={editingContent.startupDescription}
                  onChange={(e) => setEditingContent((prev) => ({ ...prev, startupDescription: e.target.value }))}
                  style={{
                    width: "100%",
                    minHeight: "120px",
                    padding: "16px",
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #444",
                    borderRadius: "8px",
                    color: "#e0e0e0",
                    fontSize: "16px",
                    lineHeight: "1.7",
                    fontFamily: "inherit",
                    resize: "vertical",
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
            )}

            {viewingReport.sections?.progressOverview && (
              <div style={{ marginBottom: "40px" }}>
                <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                  Progress Overview
                </h3>
                <textarea
                  value={editingContent.progressOverview}
                  onChange={(e) => setEditingContent((prev) => ({ ...prev, progressOverview: e.target.value }))}
                  style={{
                    width: "100%",
                    minHeight: "120px",
                    padding: "16px",
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #444",
                    borderRadius: "8px",
                    color: "#e0e0e0",
                    fontSize: "16px",
                    lineHeight: "1.7",
                    fontFamily: "inherit",
                    resize: "vertical",
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
            )}

            {viewingReport.sections?.tractionMilestones && (
              <div style={{ marginBottom: "40px" }}>
                <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                  Traction & Milestones
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {editingContent.tractionMilestones?.map((milestone: string, index: number) => (
                    <div key={index} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <span style={{ color: "#999", fontSize: "14px", minWidth: "20px" }}>•</span>
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
                          padding: "12px 16px",
                          backgroundColor: "#1a1a1a",
                          border: "1px solid #444",
                          borderRadius: "6px",
                          color: "#e0e0e0",
                          fontSize: "16px",
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
                  ))}
                </div>
              </div>
            )}

            {viewingReport.sections?.risksBottlenecks && (
              <div style={{ marginBottom: "40px" }}>
                <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                  Risks & Bottlenecks
                </h3>
                <textarea
                  value={editingContent.risksBottlenecks}
                  onChange={(e) => setEditingContent((prev) => ({ ...prev, risksBottlenecks: e.target.value }))}
                  style={{
                    width: "100%",
                    minHeight: "120px",
                    padding: "16px",
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #444",
                    borderRadius: "8px",
                    color: "#e0e0e0",
                    fontSize: "16px",
                    lineHeight: "1.7",
                    fontFamily: "inherit",
                    resize: "vertical",
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
            )}

            {viewingReport.sections?.productStrategy && (
              <div style={{ marginBottom: "40px" }}>
                <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                  Product & Strategy Snapshot
                </h3>
                <textarea
                  value={editingContent.productStrategy}
                  onChange={(e) => setEditingContent((prev) => ({ ...prev, productStrategy: e.target.value }))}
                  style={{
                    width: "100%",
                    minHeight: "120px",
                    padding: "16px",
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #444",
                    borderRadius: "8px",
                    color: "#e0e0e0",
                    fontSize: "16px",
                    lineHeight: "1.7",
                    fontFamily: "inherit",
                    resize: "vertical",
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
            )}

            {viewingReport.sections?.forecastPriorities && (
              <div style={{ marginBottom: "40px" }}>
                <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                  Forecast & Priorities
                </h3>
                <textarea
                  value={editingContent.forecastPriorities}
                  onChange={(e) => setEditingContent((prev) => ({ ...prev, forecastPriorities: e.target.value }))}
                  style={{
                    width: "100%",
                    minHeight: "120px",
                    padding: "16px",
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #444",
                    borderRadius: "8px",
                    color: "#e0e0e0",
                    fontSize: "16px",
                    lineHeight: "1.7",
                    fontFamily: "inherit",
                    resize: "vertical",
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
            )}

            {(viewingReport.notes || editingContent.additionalNotes) && (
              <div style={{ marginBottom: "40px" }}>
                <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                  Additional Notes
                </h3>
                <textarea
                  value={editingContent.additionalNotes}
                  onChange={(e) => setEditingContent((prev) => ({ ...prev, additionalNotes: e.target.value }))}
                  style={{
                    width: "100%",
                    minHeight: "120px",
                    padding: "16px",
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #444",
                    borderRadius: "8px",
                    color: "#e0e0e0",
                    fontSize: "16px",
                    lineHeight: "1.7",
                    fontFamily: "inherit",
                    resize: "vertical",
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
            )}
          </div>

          {/* Action Buttons */}
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
                padding: "16px 32px",
                fontSize: "16px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                borderRadius: "8px",
                fontWeight: "500",
                letterSpacing: "0.02em",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1e7e34"
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(40,167,69,0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#28a745"
                e.currentTarget.style.transform = "translateY(0px)"
                e.currentTarget.style.boxShadow = "none"
              }}
            >
              <Save size={16} />
              Save Changes
            </button>

            <button
              onClick={cancelEdit}
              style={{
                padding: "16px 32px",
                fontSize: "16px",
                backgroundColor: "#6c757d",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                borderRadius: "8px",
                fontWeight: "500",
                letterSpacing: "0.02em",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#545b62"
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#6c757d"
                e.currentTarget.style.transform = "translateY(0px)"
                e.currentTarget.style.boxShadow = "none"
              }}
            >
              <X size={16} />
              Cancel
            </button>
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
          <div style={{ marginBottom: "40px" }}>
            <button
              onClick={backToHistory}
              style={{
                padding: "12px 20px",
                fontSize: "15px",
                backgroundColor: "#2a2a2a",
                color: "#e0e0e0",
                border: "1px solid #444",
                cursor: "pointer",
                borderRadius: "8px",
                fontWeight: "500",
                letterSpacing: "0.02em",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "30px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#3a3a3a"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#2a2a2a"
              }}
            >
              <ArrowLeft size={16} />
              Back to History
            </button>

            <div style={{ textAlign: "center" }}>
              <h1
                style={{
                  fontSize: "36px",
                  fontWeight: "400",
                  marginBottom: "16px",
                  letterSpacing: "0.02em",
                  color: "#ffffff",
                }}
              >
                {viewingReport.title}
              </h1>
              <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "12px" }}>
                {viewingReport.period && (
                  <span style={{ fontSize: "16px", color: "#999" }}>
                    {new Date(viewingReport.period).toLocaleDateString()}
                  </span>
                )}
                {viewingReport.audience && (
                  <span style={{ fontSize: "16px", color: "#999" }}>
                    {viewingReport.audience.charAt(0).toUpperCase() + viewingReport.audience.slice(1)}
                  </span>
                )}
              </div>
              <p style={{ fontSize: "14px", color: "#666" }}>Generated on {viewingReport.date}</p>
            </div>
          </div>

          {/* Report Content */}
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
                <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#e0e0e0", marginBottom: "32px" }}>
                  {viewingReport.content?.startupDescription ||
                    "Our startup is focused on delivering innovative solutions that address key market challenges. We have built a strong foundation with a clear value proposition and growing market traction."}
                </p>
              </>
            )}

            {viewingReport.sections?.progressOverview && (
              <>
                <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                  Progress Overview
                </h3>
                <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#e0e0e0", marginBottom: "32px" }}>
                  {viewingReport.content?.progressOverview ||
                    "This quarter we have successfully delivered 87% of our planned objectives while maintaining high quality standards and team satisfaction. Our development velocity has increased by 40% compared to the previous quarter."}
                </p>
              </>
            )}

            {viewingReport.sections?.tractionMilestones && (
              <>
                <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                  Traction & Milestones
                </h3>
                <ul
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.8",
                    color: "#e0e0e0",
                    marginBottom: "32px",
                    paddingLeft: "20px",
                  }}
                >
                  {(
                    viewingReport.content?.tractionMilestones || [
                      "Completed major platform upgrade affecting 50,000+ users",
                      "Reduced system downtime by 65% through infrastructure improvements",
                      "Onboarded 3 new team members with full integration success",
                      "Achieved 94% customer satisfaction score in latest survey",
                    ]
                  ).map((milestone: string, index: number) => (
                    <li key={index} style={{ marginBottom: "8px" }}>
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
                <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#e0e0e0", marginBottom: "32px" }}>
                  {viewingReport.content?.risksBottlenecks ||
                    "While progress has been strong, we face ongoing challenges in scaling our operations and maintaining quality as we grow. Resource allocation and team coordination remain key focus areas that require immediate attention."}
                </p>
              </>
            )}

            {viewingReport.sections?.productStrategy && (
              <>
                <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                  Product & Strategy Snapshot
                </h3>
                <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#e0e0e0", marginBottom: "32px" }}>
                  {viewingReport.content?.productStrategy ||
                    "Our product roadmap is aligned with market demands and user feedback. We've prioritized features that drive user engagement and retention, with a focus on scalability and performance optimization."}
                </p>
              </>
            )}

            {viewingReport.sections?.forecastPriorities && (
              <>
                <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                  Forecast & Priorities
                </h3>
                <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#e0e0e0", marginBottom: "32px" }}>
                  {viewingReport.content?.forecastPriorities ||
                    "Looking ahead, we're prioritizing system optimization, team expansion, and strategic partnerships. Our AI-powered recommendations suggest focusing on automation and process refinement to achieve our next growth phase."}
                </p>
              </>
            )}

            {(viewingReport.content?.additionalNotes || viewingReport.notes) && (
              <>
                <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                  Additional Notes
                </h3>
                <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#e0e0e0", marginBottom: "32px" }}>
                  {viewingReport.content?.additionalNotes || viewingReport.notes}
                </p>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {[
              {
                label: "Send Report",
                icon: <Send size={16} />,
                action: () => alert("Send functionality would be implemented here"),
                color: "#28a745",
              },
              {
                label: "Download PDF",
                icon: <Download size={16} />,
                action: () => downloadPDF(viewingReport),
                color: "#007bff",
              },
              {
                label: "Edit Report",
                icon: <Edit3 size={16} />,
                action: () => editReport(viewingReport),
                color: "#ffc107",
              },
            ].map((button, index) => (
              <button
                key={index}
                onClick={button.action}
                style={{
                  padding: "14px 24px",
                  fontSize: "15px",
                  backgroundColor: button.color,
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "8px",
                  fontWeight: "500",
                  letterSpacing: "0.02em",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
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
                {button.icon}
                {button.label}
              </button>
            ))}
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

          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            {savedReports.length === 0 ? (
              <div
                style={{
                  backgroundColor: "#2a2a2a",
                  border: "1px solid #444",
                  borderRadius: "16px",
                  padding: "60px 40px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#3a3a3a",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px auto",
                  }}
                >
                  <FileText size={36} style={{ color: "#666" }} />
                </div>
                <h2 style={{ fontSize: "28px", fontWeight: "400", marginBottom: "16px", color: "#fff" }}>
                  No Reports Generated Yet
                </h2>
                <p style={{ fontSize: "16px", color: "#999", marginBottom: "32px", lineHeight: "1.6" }}>
                  Once you generate your first stakeholder report, it will appear here for easy access and reference.
                </p>
                <button
                  onClick={createFirstReport}
                  style={{
                    padding: "16px 32px",
                    fontSize: "16px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "8px",
                    fontWeight: "500",
                    letterSpacing: "0.02em",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    margin: "0 auto",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)"
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,123,255,0.3)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0px)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                >
                  <Plus size={18} />
                  Create Your First Report
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {savedReports.map((report) => (
                  <div
                    key={report.id}
                    style={{
                      backgroundColor: "#2a2a2a",
                      border: "1px solid #444",
                      borderRadius: "12px",
                      padding: "24px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#333"
                      e.currentTarget.style.borderColor = "#555"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#2a2a2a"
                      e.currentTarget.style.borderColor = "#444"
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "8px", color: "#fff" }}>
                        {report.title}
                      </h3>
                      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                        <span style={{ fontSize: "14px", color: "#999" }}>Generated on {report.date}</span>
                        {report.audience && (
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#007bff",
                              backgroundColor: "#1a3a5c",
                              padding: "4px 8px",
                              borderRadius: "4px",
                            }}
                          >
                            {report.audience.charAt(0).toUpperCase() + report.audience.slice(1)}
                          </span>
                        )}
                      </div>
                    </div>
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
                        fontWeight: "500",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#0056b3"
                        e.currentTarget.style.transform = "translateY(-1px)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#007bff"
                        e.currentTarget.style.transform = "translateY(0px)"
                      }}
                    >
                      <Eye size={14} />
                      View Report
                    </button>
                  </div>
                ))}

                <button
                  onClick={createFirstReport}
                  style={{
                    padding: "16px 32px",
                    fontSize: "16px",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "8px",
                    fontWeight: "500",
                    letterSpacing: "0.02em",
                    transition: "all 0.2s ease",
                    marginTop: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    justifyContent: "center",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#1e7e34"
                    e.currentTarget.style.transform = "translateY(-2px)"
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(40,167,69,0.3)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#28a745"
                    e.currentTarget.style.transform = "translateY(0px)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                >
                  <Plus size={18} />
                  Create New Report
                </button>
              </div>
            )}
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

          <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Report Overview Section */}
            <div
              style={{
                backgroundColor: "#2a2a2a",
                border: "1px solid #444",
                borderRadius: "16px",
                padding: "32px",
              }}
            >
              <h2 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "24px", color: "#fff" }}>
                Report Overview
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ marginBottom: "24px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#e5e7eb",
                    }}
                  >
                    Report Title <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter report title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      fontSize: "14px",
                      backgroundColor: "#374151",
                      border: `1px solid ${validationErrors.includes("title") ? "#ef4444" : "#4b5563"}`,
                      borderRadius: "8px",
                      color: "#f9fafb",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#e5e7eb",
                    }}
                  >
                    Reporting Period <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "4px",
                          fontSize: "12px",
                          color: "#9ca3af",
                        }}
                      >
                        From
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          fontSize: "14px",
                          backgroundColor: "#374151",
                          border: `1px solid ${validationErrors.includes("startDate") ? "#ef4444" : "#4b5563"}`,
                          borderRadius: "8px",
                          color: "#f9fafb",
                          outline: "none",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "4px",
                          fontSize: "12px",
                          color: "#9ca3af",
                        }}
                      >
                        To
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          fontSize: "14px",
                          backgroundColor: "#374151",
                          border: `1px solid ${validationErrors.includes("endDate") ? "#ef4444" : "#4b5563"}`,
                          borderRadius: "8px",
                          color: "#f9fafb",
                          outline: "none",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#e5e7eb",
                    }}
                  >
                    Audience <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    value={formData.audience}
                    onChange={(e) => setFormData((prev) => ({ ...prev, audience: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      fontSize: "14px",
                      backgroundColor: "#374151",
                      border: `1px solid ${validationErrors.includes("audience") ? "#ef4444" : "#4b5563"}`,
                      borderRadius: "8px",
                      color: "#f9fafb",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="">Select audience</option>
                    <option value="investors">Investors</option>
                    <option value="board">Board Members</option>
                    <option value="team">Team</option>
                    <option value="advisors">Advisors</option>
                    <option value="stakeholders">Stakeholders</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Content Selection Section */}
            <div
              style={{
                backgroundColor: "#2a2a2a",
                border: "1px solid #444",
                borderRadius: "16px",
                padding: "32px",
              }}
            >
              <h2 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "24px", color: "#fff" }}>
                Content Selection
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  { key: "startupDescription", label: "Startup Description" },
                  { key: "progressOverview", label: "Progress Overview" },
                  { key: "tractionMilestones", label: "Traction & Milestones" },
                  { key: "risksBottlenecks", label: "Risks & Bottlenecks" },
                  { key: "productStrategy", label: "Product & Strategy Snapshot" },
                  { key: "forecastPriorities", label: "Forecast & Priorities" },
                ].map(({ key, label }) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 0",
                    }}
                  >
                    <span style={{ fontSize: "15px", color: "#e0e0e0", fontWeight: "400" }}>{label}</span>
                    <ToggleSwitch
                      checked={formData.sections[key as keyof typeof formData.sections]}
                      onChange={() => handleSectionToggle(key as keyof typeof formData.sections)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Optional Notes Section */}
            <div
              style={{
                backgroundColor: "#2a2a2a",
                border: "1px solid #444",
                borderRadius: "16px",
                padding: "32px",
              }}
            >
              <h2 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "24px", color: "#fff" }}>
                Optional Notes
              </h2>

              <div>
                <label style={{ display: "block", fontSize: "15px", marginBottom: "8px", color: "#e0e0e0" }}>
                  Additional Comments or Context (optional)
                </label>
                <textarea
                  placeholder="Add any additional context or specific instructions for the report..."
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={5}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #444",
                    borderRadius: "8px",
                    color: "#e0e0e0",
                    fontSize: "15px",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "inherit",
                    lineHeight: "1.5",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#007bff"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#444"
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                marginTop: "16px",
              }}
            >
              <button
                onClick={generateReport}
                style={{
                  padding: "16px 32px",
                  fontSize: "16px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "8px",
                  fontWeight: "500",
                  letterSpacing: "0.02em",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#0056b3"
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,123,255,0.3)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#007bff"
                  e.currentTarget.style.transform = "translateY(0px)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                <Plus size={18} />
                Generate Report
              </button>

              <button
                onClick={showReportHistory}
                style={{
                  padding: "16px 32px",
                  fontSize: "16px",
                  backgroundColor: "#444",
                  color: "#e0e0e0",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "8px",
                  fontWeight: "500",
                  letterSpacing: "0.02em",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#555"
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#444"
                  e.currentTarget.style.transform = "translateY(0px)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                <FileText size={18} />
                View History
              </button>
            </div>
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
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h1
              style={{
                fontSize: "36px",
                fontWeight: "400",
                marginBottom: "16px",
                letterSpacing: "0.02em",
                color: "#ffffff",
              }}
            >
              {formData.title || "Generated Report"}
            </h1>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "12px" }}>
              {formData.startDate && formData.endDate && (
                <span style={{ fontSize: "16px", color: "#999" }}>
                  {new Date(formData.startDate).toLocaleDateString()} -{" "}
                  {new Date(formData.endDate).toLocaleDateString()}
                </span>
              )}
              {formData.audience && (
                <span style={{ fontSize: "16px", color: "#999" }}>
                  {formData.audience.charAt(0).toUpperCase() + formData.audience.slice(1)}
                </span>
              )}
            </div>
          </div>

          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            {/* Report Content */}
            <div
              style={{
                backgroundColor: "#2a2a2a",
                border: "1px solid #444",
                borderRadius: "16px",
                padding: "40px",
                marginBottom: "30px",
              }}
            >
              {formData.sections.startupDescription && (
                <>
                  <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                    Startup Description
                  </h3>
                  <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#e0e0e0", marginBottom: "32px" }}>
                    Our startup is focused on delivering innovative solutions that address key market challenges. We
                    have built a strong foundation with a clear value proposition and growing market traction.
                  </p>
                </>
              )}

              {formData.sections.progressOverview && (
                <>
                  <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                    Progress Overview
                  </h3>
                  <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#e0e0e0", marginBottom: "32px" }}>
                    This quarter we have successfully delivered 87% of our planned objectives while maintaining high
                    quality standards and team satisfaction. Our development velocity has increased by 40% compared to
                    the previous quarter.
                  </p>
                </>
              )}

              {formData.sections.tractionMilestones && (
                <>
                  <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                    Traction & Milestones
                  </h3>
                  <ul
                    style={{
                      fontSize: "16px",
                      lineHeight: "1.8",
                      color: "#e0e0e0",
                      marginBottom: "32px",
                      paddingLeft: "20px",
                    }}
                  >
                    <li style={{ marginBottom: "8px" }}>Completed major platform upgrade affecting 50,000+ users</li>
                    <li style={{ marginBottom: "8px" }}>
                      Reduced system downtime by 65% through infrastructure improvements
                    </li>
                    <li style={{ marginBottom: "8px" }}>Onboarded 3 new team members with full integration success</li>
                    <li style={{ marginBottom: "8px" }}>Achieved 94% customer satisfaction score in latest survey</li>
                  </ul>
                </>
              )}

              {formData.sections.risksBottlenecks && (
                <>
                  <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                    Risks & Bottlenecks
                  </h3>
                  <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#e0e0e0", marginBottom: "32px" }}>
                    While progress has been strong, we face ongoing challenges in scaling our operations and maintaining
                    quality as we grow. Resource allocation and team coordination remain key focus areas that require
                    immediate attention.
                  </p>
                </>
              )}

              {formData.sections.productStrategy && (
                <>
                  <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                    Product & Strategy Snapshot
                  </h3>
                  <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#e0e0e0", marginBottom: "32px" }}>
                    Our product roadmap is aligned with market demands and user feedback. We've prioritized features
                    that drive user engagement and retention, with a focus on scalability and performance optimization.
                  </p>
                </>
              )}

              {formData.sections.forecastPriorities && (
                <>
                  <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                    Forecast & Priorities
                  </h3>
                  <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#e0e0e0", marginBottom: "32px" }}>
                    Looking ahead, we're prioritizing system optimization, team expansion, and strategic partnerships.
                    Our AI-powered recommendations suggest focusing on automation and process refinement to achieve our
                    next growth phase.
                  </p>
                </>
              )}

              {formData.notes && (
                <>
                  <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                    Additional Notes
                  </h3>
                  <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#e0e0e0", marginBottom: "32px" }}>
                    {formData.notes}
                  </p>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "Save Report", action: saveReport, color: "#28a745", icon: <FileText size={16} /> },
                {
                  label: "Send Report",
                  action: () => alert("Send functionality would be implemented here"),
                  color: "#17a2b8",
                  icon: <Send size={16} />,
                },
                { label: "Download PDF", action: () => downloadPDF(), color: "#007bff", icon: <Download size={16} /> },
                { label: "Back to Form", action: backToForm, color: "#6c757d", icon: <ArrowLeft size={16} /> },
              ].map((button, index) => (
                <button
                  key={index}
                  onClick={button.action}
                  style={{
                    padding: "14px 24px",
                    fontSize: "15px",
                    backgroundColor: button.color,
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "8px",
                    fontWeight: "500",
                    letterSpacing: "0.02em",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
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
                  {button.icon}
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
