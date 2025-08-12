"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"

interface HealthMetric {
  id: string
  name: string
  value: number
  status: "good" | "warning" | "critical"
  trend: "up" | "down" | "stable"
  description: string
}

export default function HealthCheckPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const healthMetrics: HealthMetric[] = [
    {
      id: "1",
      name: "Cash Runway",
      value: 85,
      status: "good",
      trend: "stable",
      description: "8.5 months remaining at current burn rate",
    },
    {
      id: "2",
      name: "Team Productivity",
      value: 72,
      status: "good",
      trend: "up",
      description: "Team velocity has increased 15% this month",
    },
    {
      id: "3",
      name: "Customer Satisfaction",
      value: 45,
      status: "warning",
      trend: "down",
      description: "NPS score needs improvement",
    },
    {
      id: "4",
      name: "Product-Market Fit",
      value: 30,
      status: "critical",
      trend: "stable",
      description: "Low retention rates indicate PMF issues",
    },
    {
      id: "5",
      name: "Technical Debt",
      value: 65,
      status: "warning",
      trend: "up",
      description: "Code quality metrics declining",
    },
    {
      id: "6",
      name: "Market Position",
      value: 78,
      status: "good",
      trend: "up",
      description: "Strong competitive positioning",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-400"
      case "warning":
        return "text-yellow-400"
      case "critical":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-400" />
      default:
        return <CheckCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-400" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-400" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  const overallHealth = Math.round(healthMetrics.reduce((acc, metric) => acc + metric.value, 0) / healthMetrics.length)

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#1a1a1a", color: "#e0e0e0", position: "relative" }}>
      {/* Hamburger Menu - Top Left */}
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
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#3a3a3a"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#2a2a2a"
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
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#3a3a3a"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#2a2a2a"
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
        {/* Top section - Settings and Profile icons */}
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

        {/* Navigation buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { label: "Map", onClick: () => (window.location.href = "/main"), active: false },
            { label: "Command Deck", onClick: () => (window.location.href = "/command-deck"), active: false },
            { label: "Health Analysis", onClick: () => (window.location.href = "/health-check"), active: true },
            { label: "Forecast", onClick: () => (window.location.href = "/forecast"), active: false },
            { label: "Reports", onClick: () => (window.location.href = "/reports"), active: false },
            { label: "Network", onClick: () => (window.location.href = "/network"), active: false },
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ marginLeft: "0px", paddingTop: "80px" }}>
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b border-gray-700">
          <h1 className="text-3xl font-bold text-gray-100">Health Analysis</h1>
          <Button variant="outline" className="border-gray-600 text-gray-200 hover:bg-gray-700 bg-transparent">
            Generate Report
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Overall Health Score */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  {getStatusIcon(overallHealth >= 70 ? "good" : overallHealth >= 50 ? "warning" : "critical")}
                  Overall Startup Health
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Comprehensive health assessment based on key metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl font-bold text-gray-100">{overallHealth}%</span>
                  <Badge
                    variant="secondary"
                    className={`${overallHealth >= 70 ? "bg-green-600" : overallHealth >= 50 ? "bg-yellow-600" : "bg-red-600"} text-white`}
                  >
                    {overallHealth >= 70 ? "Healthy" : overallHealth >= 50 ? "Needs Attention" : "Critical"}
                  </Badge>
                </div>
                <Progress value={overallHealth} className="h-3" />
              </CardContent>
            </Card>

            {/* Health Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthMetrics.map((metric) => (
                <Card key={metric.id} className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gray-100 text-lg">{metric.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(metric.trend)}
                        {getStatusIcon(metric.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-100">{metric.value}%</span>
                        <Badge variant="outline" className={`border-gray-600 ${getStatusColor(metric.status)}`}>
                          {metric.status}
                        </Badge>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                      <p className="text-sm text-gray-400">{metric.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recommendations */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100">Recommendations</CardTitle>
                <CardDescription className="text-gray-400">
                  Priority actions to improve your startup health
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-400">Critical: Product-Market Fit</h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Focus on customer interviews and product iteration to improve retention rates
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-400">Warning: Customer Satisfaction</h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Implement customer feedback loops and improve support response times
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-400">Warning: Technical Debt</h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Allocate time for code refactoring and implement better testing practices
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
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
    </div>
  )
}
