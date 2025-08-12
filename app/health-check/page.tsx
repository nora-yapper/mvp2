"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react"
import { mockHealthMetrics, type HealthMetric } from "@/lib/team-data"

export default function HealthCheckPage() {
  const [metrics, setMetrics] = useState(mockHealthMetrics)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const refreshMetrics = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update metrics with slight variations
    const updatedMetrics = metrics.map((metric) => ({
      ...metric,
      value: metric.value + (Math.random() - 0.5) * (metric.value * 0.1),
      lastUpdated: new Date().toISOString(),
    }))

    setMetrics(updatedMetrics)
    setLastUpdated(new Date())
    setIsRefreshing(false)
  }

  const getStatusIcon = (status: HealthMetric["status"]) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "critical":
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusColor = (status: HealthMetric["status"]) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-50 border-green-200"
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
    }
  }

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case "stable":
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const healthyCount = metrics.filter((m) => m.status === "healthy").length
  const warningCount = metrics.filter((m) => m.status === "warning").length
  const criticalCount = metrics.filter((m) => m.status === "critical").length
  const overallHealth = (healthyCount / metrics.length) * 100

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Health Check</h1>
          <p className="text-muted-foreground">Monitor your system's performance and health metrics</p>
        </div>
        <Button onClick={refreshMetrics} disabled={isRefreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(overallHealth)}%</div>
            <Progress value={overallHealth} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Last updated: {lastUpdated.toLocaleTimeString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{healthyCount}</div>
            <p className="text-xs text-muted-foreground">Systems operating normally</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
            <p className="text-xs text-muted-foreground">Systems need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">Systems require immediate action</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric) => (
              <Card key={metric.id} className={`border-2 ${getStatusColor(metric.status)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{metric.name}</CardTitle>
                    {getStatusIcon(metric.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        {typeof metric.value === "number"
                          ? metric.value.toFixed(metric.unit === "%" ? 1 : 0)
                          : metric.value}
                        {metric.unit}
                      </span>
                      {getTrendIcon(metric.trend)}
                    </div>

                    <Badge variant={metric.status === "healthy" ? "default" : "destructive"}>
                      {metric.status.toUpperCase()}
                    </Badge>

                    <p className="text-xs text-muted-foreground">
                      Updated: {new Date(metric.lastUpdated).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="mr-2 h-5 w-5" />
                  CPU Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Current Usage</span>
                    <span className="font-bold">78%</span>
                  </div>
                  <Progress value={78} />
                  <div className="text-sm text-muted-foreground">Average over last 24 hours: 65%</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HardDrive className="mr-2 h-5 w-5" />
                  Storage Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Disk Usage</span>
                    <span className="font-bold">45%</span>
                  </div>
                  <Progress value={45} />
                  <div className="text-sm text-muted-foreground">2.1 TB used of 4.7 TB available</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="mr-2 h-5 w-5" />
                  Servers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Web Server 1</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between">
                    <span>Web Server 2</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between">
                    <span>API Server</span>
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  Databases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Primary DB</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between">
                    <span>Replica DB</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between">
                    <span>Cache DB</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wifi className="mr-2 h-5 w-5" />
                  Network
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>CDN</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between">
                    <span>Load Balancer</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between">
                    <span>Firewall</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>System alerts and notifications from the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium">High CPU Usage Detected</h4>
                    <p className="text-sm text-muted-foreground">CPU usage exceeded 80% threshold on API server</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium">Database Backup Completed</h4>
                    <p className="text-sm text-muted-foreground">Scheduled backup completed successfully</p>
                    <p className="text-xs text-muted-foreground mt-1">6 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium">Service Outage Resolved</h4>
                    <p className="text-sm text-muted-foreground">Payment service outage has been resolved</p>
                    <p className="text-xs text-muted-foreground mt-1">12 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
