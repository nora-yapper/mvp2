"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Building,
  Calendar,
  MessageCircle,
  UserPlus,
  TrendingUp,
  Heart,
  Briefcase,
} from "lucide-react"
import { mockNetworkContacts, type NetworkContact } from "@/lib/team-data"

export default function NetworkPage() {
  const [contacts] = useState(mockNetworkContacts)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [relationshipFilter, setRelationshipFilter] = useState("all")

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || contact.category === categoryFilter
    const matchesRelationship = relationshipFilter === "all" || contact.relationship === relationshipFilter

    return matchesSearch && matchesCategory && matchesRelationship
  })

  const getCategoryColor = (category: NetworkContact["category"]) => {
    switch (category) {
      case "investor":
        return "bg-green-100 text-green-800"
      case "mentor":
        return "bg-blue-100 text-blue-800"
      case "partner":
        return "bg-purple-100 text-purple-800"
      case "customer":
        return "bg-orange-100 text-orange-800"
      case "vendor":
        return "bg-gray-100 text-gray-800"
      case "advisor":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRelationshipIcon = (relationship: NetworkContact["relationship"]) => {
    switch (relationship) {
      case "strong":
        return <Heart className="h-4 w-4 text-red-500" />
      case "medium":
        return <TrendingUp className="h-4 w-4 text-yellow-500" />
      case "weak":
        return <Users className="h-4 w-4 text-gray-500" />
    }
  }

  const getCategoryIcon = (category: NetworkContact["category"]) => {
    switch (category) {
      case "investor":
        return <TrendingUp className="h-4 w-4" />
      case "mentor":
        return <Users className="h-4 w-4" />
      case "partner":
        return <Briefcase className="h-4 w-4" />
      case "customer":
        return <Heart className="h-4 w-4" />
      case "vendor":
        return <Building className="h-4 w-4" />
      case "advisor":
        return <UserPlus className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const contactsByCategory = {
    investor: contacts.filter((c) => c.category === "investor").length,
    mentor: contacts.filter((c) => c.category === "mentor").length,
    partner: contacts.filter((c) => c.category === "partner").length,
    customer: contacts.filter((c) => c.category === "customer").length,
    vendor: contacts.filter((c) => c.category === "vendor").length,
    advisor: contacts.filter((c) => c.category === "advisor").length,
  }

  const contactsByRelationship = {
    strong: contacts.filter((c) => c.relationship === "strong").length,
    medium: contacts.filter((c) => c.relationship === "medium").length,
    weak: contacts.filter((c) => c.relationship === "weak").length,
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Professional Network</h1>
          <p className="text-muted-foreground">Manage your professional contacts and relationships</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
            <p className="text-xs text-muted-foreground">+5 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Strong Relationships</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contactsByRelationship.strong}</div>
            <p className="text-xs text-muted-foreground">Key connections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investors</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contactsByCategory.investor}</div>
            <p className="text-xs text-muted-foreground">Funding opportunities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Interactions this week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="contacts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contacts">All Contacts</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Directory</CardTitle>
              <CardDescription>Browse and manage your professional network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="investor">Investor</SelectItem>
                    <SelectItem value="mentor">Mentor</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="advisor">Advisor</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={relationshipFilter} onValueChange={setRelationshipFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Relationships</SelectItem>
                    <SelectItem value="strong">Strong</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="weak">Weak</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredContacts.map((contact) => (
                  <Card key={contact.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src="/placeholder-user.jpg" alt={contact.name} />
                          <AvatarFallback>
                            {contact.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{contact.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">{contact.position}</p>
                          <p className="text-sm text-muted-foreground truncate">{contact.company}</p>
                        </div>
                        {getRelationshipIcon(contact.relationship)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getCategoryColor(contact.category)}>
                          {contact.category.charAt(0).toUpperCase() + contact.category.slice(1)}
                        </Badge>
                        <Badge variant="outline">
                          {contact.relationship.charAt(0).toUpperCase() + contact.relationship.slice(1)}
                        </Badge>
                      </div>

                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{contact.email}</span>
                        </div>
                        {contact.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-3 w-3" />
                            <span>{contact.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-3 w-3" />
                          <span>Last contact: {new Date(contact.lastContact).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {contact.notes && (
                        <div className="text-sm bg-gray-50 p-2 rounded">
                          <p className="text-muted-foreground line-clamp-2">{contact.notes}</p>
                        </div>
                      )}

                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          <Mail className="h-3 w-3 mr-1" />
                          Email
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredContacts.length === 0 && (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No contacts found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(contactsByCategory).map(([category, count]) => (
              <Card key={category} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(category as NetworkContact["category"])}
                    <CardTitle className="text-base capitalize">{category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{count}</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {category === "investor" && "Funding and investment opportunities"}
                    {category === "mentor" && "Guidance and strategic advice"}
                    {category === "partner" && "Business partnerships and collaborations"}
                    {category === "customer" && "Client relationships and feedback"}
                    {category === "vendor" && "Service providers and suppliers"}
                    {category === "advisor" && "Expert advice and consultation"}
                  </p>
                  <Button size="sm" variant="outline" className="w-full bg-transparent">
                    View {category}s
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest interactions and network updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium">Email sent to David Kim</h4>
                    <p className="text-sm text-muted-foreground">Follow-up on Series A funding discussion</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Calendar className="h-5 w-5 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium">Meeting scheduled with Lisa Wang</h4>
                    <p className="text-sm text-muted-foreground">Monthly mentorship session</p>
                    <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <UserPlus className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium">New contact added</h4>
                    <p className="text-sm text-muted-foreground">Connected with Sarah Johnson from TechCorp</p>
                    <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Network Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Strong Relationships</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(contactsByRelationship.strong / contacts.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{contactsByRelationship.strong}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Medium Relationships</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${(contactsByRelationship.medium / contacts.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{contactsByRelationship.medium}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Weak Relationships</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gray-500 h-2 rounded-full"
                          style={{ width: `${(contactsByRelationship.weak / contacts.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{contactsByRelationship.weak}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Networking Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800">Connect with 5 new investors</h4>
                    <p className="text-sm text-blue-600">Progress: 2/5 completed</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800">Schedule monthly mentor meetings</h4>
                    <p className="text-sm text-green-600">On track for this month</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-800">Strengthen weak relationships</h4>
                    <p className="text-sm text-yellow-600">3 contacts need follow-up</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
