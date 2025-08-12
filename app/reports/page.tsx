"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Download,
  Search,
  Plus,
  Calendar,
  User,
  BarChart3,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import { mockReports, type Report } from "@/lib/team-data"

export default function ReportsPage() {
  const [reports] = useState(mockReports)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || report.type === typeFilter
    const matchesStatus = statusFilter === "all" || report.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusColor = (status: Report["status"]) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "approved":
        return "bg-blue-100 text-blue-800"
      case "review":
        return "bg-yellow-100 text-yellow-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: Report["type"]) => {
    switch (type) {
      case "financial":
        return <DollarSign className="h-4 w-4" />
      case "performance":
        return <TrendingUp className="h-4 w-4" />
      case "analytics":
        return <BarChart3 className="h-4 w-4" />
      case "compliance":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const reportsByType = {
    financial: reports.filter((r) => r.type === "financial").length,
    performance: reports.filter((r) => r.type === "performance").length,
    analytics: reports.filter((r) => r.type === "analytics").length,
    compliance: reports.filter((r) => r.type === "compliance").length,
  }

  const reportsByStatus = {
    published: reports.filter((r) => r.status === "published").length,
    approved: reports.filter((r) => r.status === "approved").length,
    review: reports.filter((r) => r.status === "review").length,
    draft: reports.filter((r) => r.status === "draft").length,
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate, manage, and share business reports</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">+3 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsByStatus.published}</div>
            <p className="text-xs text-muted-foreground">Available to stakeholders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsByStatus.review}</div>
            <p className="text-xs text-muted-foreground">Pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsByStatus.draft}</div>
            <p className="text-xs text-muted-foreground">Work in progress</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all-reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all-reports">All Reports</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="all-reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Library</CardTitle>
              <CardDescription>Browse and manage all your reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="review">In Review</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <Card key={report.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="p-2 bg-gray-100 rounded-lg">{getTypeIcon(report.type)}</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg mb-1">{report.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                              <div className="flex items-center space-x-1">
                                <User className="h-3 w-3" />
                                <span>{report.createdBy}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(report.createdDate).toLocaleDateString()}</span>
                              </div>
                              <span>{report.size}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(report.status)}>
                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                              </Badge>
                              <Badge variant="outline">
                                {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredReports.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No reports found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-base">Financial Report</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Comprehensive financial analysis with revenue, expenses, and profitability metrics.
                </p>
                <Button size="sm" className="w-full">
                  Use Template
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-base">Performance Report</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Team and project performance analysis with KPIs and growth metrics.
                </p>
                <Button size="sm" className="w-full">
                  Use Template
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-base">Analytics Report</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Data-driven insights with user behavior, conversion rates, and trends.
                </p>
                <Button size="sm" className="w-full">
                  Use Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Automatically generated reports on a schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">Monthly Financial Summary</h4>
                      <p className="text-sm text-muted-foreground">Every 1st of the month at 9:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default">Active</Badge>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Weekly Performance Report</h4>
                      <p className="text-sm text-muted-foreground">Every Monday at 8:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default">Active</Badge>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Report Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Financial Reports</span>
                    <span className="font-bold">{reportsByType.financial}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Performance Reports</span>
                    <span className="font-bold">{reportsByType.performance}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Analytics Reports</span>
                    <span className="font-bold">{reportsByType.analytics}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Compliance Reports</span>
                    <span className="font-bold">{reportsByType.compliance}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Report Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Published</span>
                    <Badge className="bg-green-100 text-green-800">{reportsByStatus.published}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Approved</span>
                    <Badge className="bg-blue-100 text-blue-800">{reportsByStatus.approved}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>In Review</span>
                    <Badge className="bg-yellow-100 text-yellow-800">{reportsByStatus.review}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Draft</span>
                    <Badge className="bg-gray-100 text-gray-800">{reportsByStatus.draft}</Badge>
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
