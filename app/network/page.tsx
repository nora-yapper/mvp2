"use client"

import { useState } from "react"
import { ChevronDown, Plus, X } from "lucide-react"

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
  },
]

export default function NetworkPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("All Types")
  const [statusFilter, setStatusFilter] = useState("All Statuses")
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

  // Add filtered contacts logic after the contacts array definition
  const filteredContacts = contacts.filter((contact) => {
    // Search filter - check name, role, and organization
    const searchMatch =
      searchTerm === "" ||
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.organization.toLowerCase().includes(searchTerm.toLowerCase())

    // Type filter
    const typeMatch = typeFilter === "All Types" || contact.type === typeFilter

    // Status filter
    const statusMatch = statusFilter === "All Statuses" || contact.status === statusFilter

    return searchMatch && typeMatch && statusMatch
  })

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#1a1a1a", color: "#e0e0e0", position: "relative" }}>
      {/* Header */}
      <div style={{ padding: "40px 60px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "400", margin: "0 0 16px 0", color: "#e0e0e0" }}>Network</h1>
        <p style={{ fontSize: "18px", color: "#999", margin: "0 0 60px 0" }}>
          Manage your startup relationships and connections
        </p>
      </div>

      {/* Search and Filters */}
      <div style={{ padding: "0 60px 40px", display: "flex", gap: "20px", alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="Search by name, role, or organization"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "16px 20px",
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              color: "#e0e0e0",
              fontSize: "16px",
              clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
              outline: "none",
            }}
          />
        </div>

        <div style={{ position: "relative" }}>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: "16px 40px 16px 20px",
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              color: "#e0e0e0",
              fontSize: "16px",
              clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
              outline: "none",
              appearance: "none",
              cursor: "pointer",
              minWidth: "150px",
            }}
          >
            <option value="All Types">All Types</option>
            <option value="Investor">Investor</option>
            <option value="Peer">Peer</option>
            <option value="Mentor">Mentor</option>
            <option value="Program Manager">Program Manager</option>
            <option value="Potential Lead">Potential Lead</option>
          </select>
          <ChevronDown
            size={16}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#999",
            }}
          />
        </div>

        <div style={{ position: "relative" }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "16px 40px 16px 20px",
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              color: "#e0e0e0",
              fontSize: "16px",
              clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
              outline: "none",
              appearance: "none",
              cursor: "pointer",
              minWidth: "150px",
            }}
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Connected">Connected</option>
            <option value="Pending Follow-Up">Pending Follow-Up</option>
            <option value="Priority">Priority</option>
            <option value="Waiting Reply">Waiting Reply</option>
            <option value="Reached Out">Reached Out</option>
          </select>
          <ChevronDown
            size={16}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#999",
            }}
          />
        </div>
      </div>

      {/* Contacts Section */}
      <div style={{ padding: "0 60px" }}>
        <div
          style={{
            backgroundColor: "#2a2a2a",
            border: "1px solid #444",
            clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "30px",
              borderBottom: "1px solid #444",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ fontSize: "24px", fontWeight: "500", margin: "0", color: "#e0e0e0" }}>
              Contacts ({filteredContacts.length})
            </h2>
            <button
              style={{
                padding: "12px 24px",
                backgroundColor: "#007bff",
                border: "1px solid #0056b3",
                color: "white",
                fontSize: "16px",
                cursor: "pointer",
                clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: "500",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#0056b3"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#007bff"
              }}
            >
              <Plus size={16} />
              Add Contact
            </button>
          </div>

          {/* Table Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "200px 180px 160px 140px 120px 200px 1fr",
              gap: "20px",
              padding: "20px 30px",
              borderBottom: "1px solid #444",
              fontSize: "14px",
              fontWeight: "500",
              color: "#999",
            }}
          >
            <div>Name</div>
            <div>Role / Type</div>
            <div>Organization</div>
            <div>Status</div>
            <div>Last Interaction</div>
            <div>Next Action</div>
            <div>Notes</div>
          </div>

          {/* Table Rows */}
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => handleContactClick(contact)}
              style={{
                display: "grid",
                gridTemplateColumns: "200px 180px 160px 140px 120px 200px 1fr",
                gap: "20px",
                padding: "25px 30px",
                borderBottom: "1px solid #333",
                fontSize: "14px",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#333"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              <div style={{ fontWeight: "500", color: "#e0e0e0" }}>{contact.name}</div>
              <div>
                <div style={{ color: "#e0e0e0", marginBottom: "4px" }}>{contact.role}</div>
                <div style={{ color: "#999", fontSize: "12px" }}>{contact.type}</div>
              </div>
              <div style={{ color: "#e0e0e0" }}>{contact.organization}</div>
              <div>
                <span
                  style={{
                    padding: "4px 12px",
                    backgroundColor: getStatusColor(contact.status),
                    color: "white",
                    fontSize: "12px",
                    fontWeight: "500",
                    clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                    display: "inline-block",
                  }}
                >
                  {contact.status}
                </span>
              </div>
              <div style={{ color: "#999" }}>{contact.lastInteraction}</div>
              <div style={{ color: "#e0e0e0" }}>{contact.nextAction}</div>
              <div style={{ color: "#999", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {contact.notes}
              </div>
            </div>
          ))}
        </div>

        {/* Discover New People Section */}
        <div
          style={{
            marginTop: "40px",
            backgroundColor: "#2a2a2a",
            border: "1px solid #444",
            clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
            padding: "60px",
            textAlign: "center",
          }}
        >
          <h3 style={{ fontSize: "24px", fontWeight: "500", margin: "0 0 16px 0", color: "#e0e0e0" }}>
            Discover New People
          </h3>
          <p style={{ fontSize: "16px", color: "#999", margin: "0" }}>
            Future feature: Suggested connections and networking opportunities will appear here.
          </p>
        </div>
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
              <p style={{ color: "#999", lineHeight: "1.6", margin: "0" }}>{selectedContact.notes}</p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <button
                style={{
                  padding: "16px 24px",
                  backgroundColor: "#007bff",
                  border: "1px solid #0056b3",
                  color: "white",
                  fontSize: "16px",
                  cursor: "pointer",
                  clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                  fontWeight: "500",
                  transition: "background-color 0.3s ease",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#0056b3"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#007bff"
                }}
              >
                Schedule Follow-up
              </button>

              <button
                style={{
                  padding: "16px 24px",
                  backgroundColor: "#2a2a2a",
                  border: "1px solid #444",
                  color: "#e0e0e0",
                  fontSize: "16px",
                  cursor: "pointer",
                  clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                  fontWeight: "500",
                  transition: "background-color 0.3s ease",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#3a3a3a"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#2a2a2a"
                }}
              >
                Add Note
              </button>

              <button
                style={{
                  padding: "16px 24px",
                  backgroundColor: "#2a2a2a",
                  border: "1px solid #444",
                  color: "#e0e0e0",
                  fontSize: "16px",
                  cursor: "pointer",
                  clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                  fontWeight: "500",
                  transition: "background-color 0.3s ease",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#3a3a3a"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#2a2a2a"
                }}
              >
                Set Reminder
              </button>
            </div>
          </div>
        </>
      )}

      {/* Back Button */}
      <button
        onClick={() => (window.location.href = "/main")}
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          background: "#2a2a2a",
          border: "1px solid #444",
          color: "#e0e0e0",
          fontSize: "16px",
          cursor: "pointer",
          padding: "12px 20px",
          clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
          fontWeight: "500",
          transition: "all 0.3s ease",
          zIndex: 100,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#3a3a3a"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#2a2a2a"
        }}
      >
        ← Step Back
      </button>

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
