"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Users, TrendingUp, Activity, Plus, X, RefreshCw } from "lucide-react"

interface DashboardWidget {
  id: string
  type: "metric" | "chart" | "activity" | "team"
  title: string
  value?: string | number
  change?: string
  status?: "up" | "down" | "stable"
  createdAt: Date
}

export default function HomebasePage() {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load widgets from session storage on mount
  useEffect(() => {
    const savedWidgets = sessionStorage.getItem("homebase-widgets")
    if (savedWidgets) {
      try {
        const parsed = JSON.parse(savedWidgets)
        setWidgets(
          parsed.map((w: any) => ({
            ...w,
            createdAt: new Date(w.createdAt),
          })),
        )
      } catch (error) {
        console.error("Failed to load widgets:", error)
        initializeDefaultWidgets()
      }
    } else {
      initializeDefaultWidgets()
    }
  }, [])

  // Save widgets to session storage whenever widgets change
  useEffect(() => {
    if (widgets.length > 0) {
      sessionStorage.setItem("homebase-widgets", JSON.stringify(widgets))
    }
  }, [widgets])

  const initializeDefaultWidgets = () => {
    const defaultWidgets: DashboardWidget[] = [
      {
        id: uuidv4(),
        type: "metric",
        title: "Total Revenue",
        value: "$125,430",
        change: "+12.5%",
        status: "up",
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        type: "metric",
        title: "Active Users",
        value: "15,234",
        change: "+8.2%",
        status: "up",
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        type: "metric",
        title: "Conversion Rate",
        value: "3.4%",
        change: "-0.3%",
        status: "down",
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        type: "activity",
        title: "Recent Activity",
        value: "23 new events",
        createdAt: new Date(),
      },
    ]
    setWidgets(defaultWidgets)
  }

  const addWidget = (type: DashboardWidget["type"]) => {
    const newWidget: DashboardWidget = {
      id: uuidv4(),
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      value: type === "metric" ? Math.floor(Math.random() * 10000) : "Sample data",
      change: type === "metric" ? `+${(Math.random() * 20).toFixed(1)}%` : undefined,
      status: type === "metric" ? (Math.random() > 0.5 ? "up" : "down") : undefined,
      createdAt: new Date(),
    }
    setWidgets([...widgets, newWidget])
  }

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter((widget) => widget.id !== id))
  }

  const refreshData = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update widgets with new random data
    const updatedWidgets = widgets.map((widget) => ({
      ...widget,
      value: widget.type === "metric" ? `$${Math.floor(Math.random() * 200000).toLocaleString()}` : widget.value,
      change:
        widget.type === "metric"
          ? `${Math.random() > 0.5 ? "+" : "-"}${(Math.random() * 20).toFixed(1)}%`
          : widget.change,
      status: widget.type === "metric" ? ((Math.random() > 0.5 ? "up" : "down") as "up" | "down") : widget.status,
    }))

    setWidgets(updatedWidgets)
    setIsLoading(false)
  }

  const getWidgetIcon = (type: DashboardWidget["type"]) => {
    switch (type) {
      case "metric":
        return <BarChart3 className="h-4 w-4" />
      case "chart":
        return <TrendingUp className="h-4 w-4" />
      case "activity":
        return <Activity className="h-4 w-4" />
      case "team":
        return <Users className="h-4 w-4" />
      default:
        return <BarChart3 className="h-4 w-4" />
    }
  }

  const getStatusColor = (status?: "up" | "down" | "stable") => {
    switch (status) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      case "stable":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Homebase Dashboard</h1>
          <p className="text-muted-foreground">Your central command center with UUID-managed components</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={refreshData} disabled={isLoading} variant="outline">
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Button size="sm" onClick={() => addWidget("metric")}>
          <Plus className="mr-1 h-3 w-3" />
          Add Metric
        </Button>
        <Button size="sm" onClick={() => addWidget("chart")}>
          <Plus className="mr-1 h-3 w-3" />
          Add Chart
        </Button>
        <Button size="sm" onClick={() => addWidget("activity")}>
          <Plus className="mr-1 h-3 w-3" />
          Add Activity
        </Button>
        <Button size="sm" onClick={() => addWidget("team")}>
          <Plus className="mr-1 h-3 w-3" />
          Add Team Widget
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {widgets.map((widget) => (
              <Card key={widget.id} className="relative hover:shadow-md transition-shadow">
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                  onClick={() => removeWidget(widget.id)}
                >
                  <X className="h-3 w-3" />
                </Button>

                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    {getWidgetIcon(widget.type)}
                    <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">{widget.value}</div>

                    {widget.change && <div className={`text-sm ${getStatusColor(widget.status)}`}>{widget.change}</div>}

                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {widget.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">ID: {widget.id.slice(0, 8)}...</span>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Created: {widget.createdAt.toLocaleTimeString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {widgets.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No widgets yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Add some widgets to get started with your dashboard
                </p>
                <Button onClick={() => addWidget("metric")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Widget
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Widget Analytics</CardTitle>
                <CardDescription>Statistics about your dashboard widgets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Widgets</span>
                    <Badge>{widgets.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Metric Widgets</span>
                    <Badge variant="outline">{widgets.filter((w) => w.type === "metric").length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Chart Widgets</span>
                    <Badge variant="outline">{widgets.filter((w) => w.type === "chart").length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Activity Widgets</span>
                    <Badge variant="outline">{widgets.filter((w) => w.type === "activity").length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>UUID Management</CardTitle>
                <CardDescription>Unique identifier information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Each widget has a unique UUID for identification and state management.
                  </p>
                  <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                    Latest UUID: {widgets.length > 0 ? widgets[widgets.length - 1].id : "None"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    UUIDs ensure no conflicts when adding, removing, or updating widgets.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Settings</CardTitle>
              <CardDescription>Configure your dashboard preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Auto-refresh</h4>
                  <p className="text-sm text-muted-foreground">Automatically refresh widget data</p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Reset Dashboard</h4>
                  <p className="text-sm text-muted-foreground">Clear all widgets and start fresh</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setWidgets([])
                    sessionStorage.removeItem("homebase-widgets")
                  }}
                >
                  Reset
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Export Data</h4>
                  <p className="text-sm text-muted-foreground">Download dashboard configuration</p>
                </div>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
