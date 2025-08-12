"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface Contact {
  id: string
  name: string
  role: string
  type: string
  organization: string
  status: "Connected" | "Pending Follow-Up" | "Priority" | "Waiting Reply" | "Reached Out"
  lastInteraction: string
  nextAction: string
  notes: string
  notesList: Array<{ text: string; date: string }>
}

const contacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Senior Partner",
    type: "Investor",
    organization: "Accel Partners",
    status: "Connected",
    lastInteraction: "8/15/2025",
    nextAction: "Schedule Q2 check-in",
    notes: "Interested in our AI platform. Mentioned potential Series A discussion.",
    notesList: [{ text: "Interested in our AI platform. Mentioned potential Series A discussion.", date: "8/15/2025" }],
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    role: "Founder & CEO",
    type: "Peer",
    organization: "TechFlow Inc",
    status: "Pending Follow-Up",
    lastInteraction: "8/12/2025",
    nextAction: "Send partnership proposal",
    notes: "Met at TechCrunch. Potential integration opportunity.",
    notesList: [{ text: "Met at TechCrunch. Potential integration opportunity.", date: "8/12/2025" }],
  },
  {
    id: "3",
    name: "Dr. Emily Watson",
    role: "Research Director",
    type: "Mentor",
    organization: "Stanford AI Lab",
    status: "Priority",
    lastInteraction: "8/18/2025",
    nextAction: "Present latest research findings",
    notes: "Mentor from accelerator program. Expert in machine learning.",
    notesList: [{ text: "Mentor from accelerator program. Expert in machine learning.", date: "8/18/2025" }],
  },
  {
    id: "4",
    name: "James Park",
    role: "Program Director",
    type: "Program Manager",
    organization: "Y Combinator",
    status: "Waiting Reply",
    lastInteraction: "8/10/2025",
    nextAction: "Follow up on application status",
    notes: "Applied for W24 batch. Awaiting interview confirmation.",
    notesList: [{ text: "Applied for W24 batch. Awaiting interview confirmation.", date: "8/10/2025" }],
  },
  {
    id: "5",
    name: "Lisa Kim",
    role: "VP of Engineering",
    type: "Potential Lead",
    organization: "Stripe",
    status: "Reached Out",
    lastInteraction: "8/8/2025",
    nextAction: "Schedule technical deep dive",
    notes: "Potential customer for payment infrastructure solution.",
    notesList: [{ text: "Potential customer for payment infrastructure solution.", date: "8/8/2025" }],
  },
]

export default function NetworkPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Connected":
        return "#22c55e"
      case "Pending Follow-Up":
        return "#f59e0b"
      case "Priority":
        return "#ef4444"
      case "Waiting Reply":
        return "#f59e0b"
      case "Reached Out":
        return "#3b82f6"
      default:
        return "#6b7280"
    }
  }

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact)
  }

  const closeSidebar = () => {
    setSelectedContact(null)
  }

  const handleScheduleFollowUp = () => {
    alert("You will be able to schedule a follow up soon")
  }

  const filteredContacts = contacts.filter((contact) => {
    // Placeholder for future search and filter logic
    return true
  })

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#1a1a1a", color: "#e0e0e0", position: "relative" }}>
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

      {/* Back Arrow */}
      <Link href="/main">
        <button
          style={{
            position: "fixed",
            top: "20px",
            left: "80px",
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
          ←
        </button>
      </Link>

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
            { label: "Network", onClick: () => {}, active: true },
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ marginLeft: "0px", paddingTop: "80px" }}>
        <header className="flex items-center justify-between p-6 border-b border-gray-700">
          <h1 className="text-3xl font-bold text-gray-100">Network</h1>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100">Coming Soon</CardTitle>
                <CardDescription className="text-gray-400">Network functionality is under development</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  This page will contain your professional network, investor connections, and partnership opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Contact Detail Sidebar */}
      {selectedContact && (
        <>
          {/* Overlay */}
          <div
            onClick={closeSidebar}
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

          {/* Sidebar */}
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              width: "500px",
              height: "100vh",
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              zIndex: 999,
              padding: "40px",
              overflowY: "auto",
              animation: "slideIn 0.3s ease-out",
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeSidebar}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "transparent",
                border: "none",
                color: "#999",
                cursor: "pointer",
                padding: "8px",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#fff"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#999"
              }}
            >
              <X size={24} />
            </button>

            {/* Contact Name */}
            <h2 style={{ fontSize: "32px", fontWeight: "500", margin: "0 0 40px 0", color: "#e0e0e0" }}>
              {selectedContact.name}
            </h2>

            {/* Contact Information */}
            <div style={{ marginBottom: "40px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "500", margin: "0 0 20px 0", color: "#e0e0e0" }}>
                Contact Information
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#999" }}>Role:</span>
                  <span style={{ color: "#e0e0e0", fontWeight: "500" }}>{selectedContact.role}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#999" }}>Type:</span>
                  <span style={{ color: "#e0e0e0", fontWeight: "500" }}>{selectedContact.type}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#999" }}>Organization:</span>
                  <span style={{ color: "#e0e0e0", fontWeight: "500" }}>{selectedContact.organization}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#999" }}>Status:</span>
                  <span
                    style={{
                      padding: "4px 12px",
                      backgroundColor: getStatusColor(selectedContact.status),
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "500",
                      clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                    }}
                  >
                    {selectedContact.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Interaction History */}
            <div style={{ marginBottom: "40px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "500", margin: "0 0 20px 0", color: "#e0e0e0" }}>
                Interaction History
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#999" }}>Last Interaction:</span>
                  <span style={{ color: "#e0e0e0" }}>{selectedContact.lastInteraction}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#999" }}>Next Action:</span>
                  <span style={{ color: "#e0e0e0" }}>{selectedContact.nextAction}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: "40px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "500", margin: "0 0 20px 0", color: "#e0e0e0" }}>Notes</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {selectedContact.notesList.map((note, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "12px",
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #444",
                      clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                    }}
                  >
                    <p style={{ color: "#e0e0e0", lineHeight: "1.6", margin: "0 0 8px 0" }}>{note.text}</p>
                    <p style={{ color: "#999", fontSize: "12px", margin: "0" }}>Added on {note.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Button onClick={handleScheduleFollowUp} className="bg-blue-500 hover:bg-blue-600 text-white">
                Schedule Follow-up
              </Button>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
