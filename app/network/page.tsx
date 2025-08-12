"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { UserPlus, Mail, Phone, MapPin, Search } from "lucide-react"

interface Contact {
  id: string
  name: string
  title: string
  company: string
  email: string
  phone: string
  category: "investor" | "mentor" | "partner" | "customer" | "vendor" | "other"
  status: "active" | "inactive" | "pending"
  lastContact: string
  notes: string
  tags: string[]
  linkedinUrl?: string
}

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState<"all" | "investor" | "mentor" | "partner">("all")
  const [contacts, setContacts] = useState<Contact[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [newContact, setNewContact] = useState<Partial<Contact>>({})

  useEffect(() => {
    // Initialize with mock contacts
    setContacts([
      {
        id: uuidv4(),
        name: "Alex Thompson",
        title: "Senior Partner",
        company: "Venture Capital Partners",
        email: "alex@vcpartners.com",
        phone: "+1 (555) 123-4567",
        category: "investor",
        status: "active",
        lastContact: "2024-01-28",
        notes: "Interested in Series A funding. Follow up on term sheet discussion.",
        tags: ["Series A", "SaaS", "Enterprise"],
        linkedinUrl: "https://linkedin.com/in/alexthompson",
      },
      {
        id: uuidv4(),
        name: "Maria Rodriguez",
        title: "Former CEO",
        company: "TechStart Inc",
        email: "maria@techstart.com",
        phone: "+1 (555) 234-5678",
        category: "mentor",
        status: "active",
        lastContact: "2024-01-25",
        notes: "Providing guidance on scaling operations and team building.",
        tags: ["Operations", "Leadership", "Scaling"],
        linkedinUrl: "https://linkedin.com/in/mariarodriguez",
      },
      {
        id: uuidv4(),
        name: "David Chen",
        title: "CTO",
        company: "Integration Solutions",
        email: "david@intsolutions.com",
        phone: "+1 (555) 345-6789",
        category: "partner",
        status: "active",
        lastContact: "2024-01-22",
        notes: "Discussing API integration partnership for Q2 launch.",
        tags: ["API", "Integration", "Partnership"],
        linkedinUrl: "https://linkedin.com/in/davidchen",
      },
      {
        id: uuidv4(),
        name: "Sarah Kim",
        title: "VP of Sales",
        company: "Enterprise Corp",
        email: "sarah@enterprise.com",
        phone: "+1 (555) 456-7890",
        category: "customer",
        status: "pending",
        lastContact: "2024-01-20",
        notes: "Evaluating our platform for enterprise deployment.",
        tags: ["Enterprise", "Sales", "Evaluation"],
      },
      {
        id: uuidv4(),
        name: "Michael Brown",
        title: "Founder",
        company: "Cloud Services Ltd",
        email: "michael@cloudservices.com",
        phone: "+1 (555) 567-8901",
        category: "vendor",
        status: "active",
        lastContact: "2024-01-18",
        notes: "Providing cloud infrastructure services. Negotiating new contract.",
        tags: ["Cloud", "Infrastructure", "Contract"],
      },
      {
        id: uuidv4(),
        name: "Jennifer Wilson",
        title: "Product Manager",
        company: "Innovation Labs",
        email: "jennifer@innovationlabs.com",
        phone: "+1 (555) 678-9012",
        category: "other",
        status: "inactive",
        lastContact: "2023-12-15",
        notes: "Former colleague. Potential collaboration opportunities.",
        tags: ["Product", "Collaboration", "Former Colleague"],
      },
    ])
  }, [])

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "all" || contact.category === activeTab
    return matchesSearch && matchesTab
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "investor":
        return "#dc2626"
      case "mentor":
        return "#7c3aed"
      case "partner":
        return "#059669"
      case "customer":
        return "#ea580c"
      case "vendor":
        return "#0891b2"
      default:
        return "#6b7280"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#10b981"
      case "pending":
        return "#f59e0b"
      case "inactive":
        return "#6b7280"
      default:
        return "#6b7280"
    }
  }

  const addNewContact = () => {
    if (newContact.name && newContact.email) {
      const contact: Contact = {
        id: uuidv4(),
        name: newContact.name || "",
        title: newContact.title || "",
        company: newContact.company || "",
        email: newContact.email || "",
        phone: newContact.phone || "",
        category: newContact.category || "other",
        status: "active",
        lastContact: new Date().toISOString().split("T")[0],
        notes: newContact.notes || "",
        tags: [],
        linkedinUrl: newContact.linkedinUrl,
      }

      setContacts((prev) => [contact, ...prev])
      setNewContact({})
      setShowAddModal(false)
    }
  }

  const deleteContact = (contactId: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== contactId))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Professional Network</h1>
              <p className="text-gray-600 mt-2">Manage your professional contacts and relationships</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-500 text-white rounded px-4 py-2"
            >
              <UserPlus className="h-4 w-4" />
              Add Contact
            </button>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{contacts.length}</div>
                  <p className="text-sm text-gray-600">Total Contacts</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {contacts.filter((c) => c.status === "active").length}
                  </div>
                  <p className="text-sm text-gray-600">Active</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-4 bg-gray-100 p-2 rounded">
            {(["all", "investor", "mentor", "partner"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded ${activeTab === tab ? "bg-white text-gray-900 font-semibold" : "bg-gray-100 text-gray-600"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <Card key={contact.id} className="hover:shadow-lg transition-shadow relative">
              <button onClick={() => deleteContact(contact.id)} className="absolute top-4 right-4 text-red-500">
                ×
              </button>

              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                    <AvatarFallback>
                      {contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{contact.name}</h3>
                    <p className="text-sm text-gray-600">
                      {contact.title} at {contact.company}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`bg-${getCategoryColor(contact.category).replace("#", "")} text-white`}>
                        {contact.category}
                      </Badge>
                      {contact.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} className="bg-gray-100 text-gray-800 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {contact.email}
                  </div>
                  {contact.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {contact.phone}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {contact.lastContact}
                  </div>
                </div>
                {contact.notes && (
                  <div className="mt-4">
                    <p className="text-sm italic text-gray-600">{contact.notes}</p>
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                  {contact.linkedinUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-blue-500 text-white"
                      onClick={() => window.open(contact.linkedinUrl, "_blank")}
                    >
                      LinkedIn
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center mt-6">
            <p className="text-lg text-gray-600 mb-4">No contacts found matching your criteria</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setActiveTab("all")
              }}
              className="bg-gray-100 text-gray-800 rounded px-4 py-2"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Add Contact Modal */}
        {showAddModal && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={() => setShowAddModal(false)}
          >
            <div
              className="bg-white p-8 rounded max-w-md w-full max-h-screen overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Add New Contact</h3>

              <div className="space-y-4">
                <Input
                  placeholder="Full Name *"
                  value={newContact.name || ""}
                  onChange={(e) => setNewContact((prev) => ({ ...prev, name: e.target.value }))}
                  className="border border-gray-300 rounded px-4 py-2"
                />
                <Input
                  placeholder="Job Title"
                  value={newContact.title || ""}
                  onChange={(e) => setNewContact((prev) => ({ ...prev, title: e.target.value }))}
                  className="border border-gray-300 rounded px-4 py-2"
                />
                <Input
                  placeholder="Company"
                  value={newContact.company || ""}
                  onChange={(e) => setNewContact((prev) => ({ ...prev, company: e.target.value }))}
                  className="border border-gray-300 rounded px-4 py-2"
                />
                <Input
                  type="email"
                  placeholder="Email Address *"
                  value={newContact.email || ""}
                  onChange={(e) => setNewContact((prev) => ({ ...prev, email: e.target.value }))}
                  className="border border-gray-300 rounded px-4 py-2"
                />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={newContact.phone || ""}
                  onChange={(e) => setNewContact((prev) => ({ ...prev, phone: e.target.value }))}
                  className="border border-gray-300 rounded px-4 py-2"
                />
                <select
                  value={newContact.category || "other"}
                  onChange={(e) =>
                    setNewContact((prev) => ({ ...prev, category: e.target.value as Contact["category"] }))
                  }
                  className="border border-gray-300 rounded px-4 py-2"
                >
                  <option value="investor">Investor</option>
                  <option value="mentor">Mentor</option>
                  <option value="partner">Partner</option>
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                  <option value="other">Other</option>
                </select>
                <textarea
                  placeholder="Notes"
                  value={newContact.notes || ""}
                  onChange={(e) => setNewContact((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="border border-gray-300 rounded px-4 py-2 resize-y"
                />
              </div>

              <div className="flex gap-4 mt-8 justify-end">
                <Button onClick={() => setShowAddModal(false)} className="bg-gray-100 text-gray-800 rounded px-4 py-2">
                  Cancel
                </Button>
                <Button onClick={addNewContact} className="bg-blue-500 text-white rounded px-4 py-2">
                  Add Contact
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
