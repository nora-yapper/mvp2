"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"

interface SystemStatus {
  id: string
  name: string
  status: "healthy" | "warning" | "critical" | "unknown"
  lastCheck: string
  responseTime: number
  uptime: number
  details: string
}

interface Metric {
  id: string
  name: string
  value: number
  unit: string
  threshold: number
  status: "good" | "warning" | "critical"
  trend: "up" | "down" | "stable"
}

export default function HealthCheckPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "metrics" | "logs">("overview")
  const [systemStatuses, setSystemStatuses] = useState<SystemStatus[]>([])
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [logs, setLogs] = useState<string[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    // Initialize with mock data
    setSystemStatuses([
      {
        id: uuidv4(),
        name: "Web Application",
        status: "healthy",
        lastCheck: new Date().toISOString(),
        responseTime: 245,
        uptime: 99.9,
        details: "All services running normally",
      },
      {
        id: uuidv4(),
        name: "Database",
        status: "healthy",
        lastCheck: new Date().toISOString(),
        responseTime: 12,
        uptime: 99.8,
        details: "Connection pool healthy, queries executing normally",
      },
      {
        id: uuidv4(),
        name: "API Gateway",
        status: "warning",
        lastCheck: new Date().toISOString(),
        responseTime: 890,
        uptime: 98.5,
        details: "Response times elevated, monitoring closely",
      },
      {
        id: uuidv4(),
        name: "Cache Layer",
        status: "healthy",
        lastCheck: new Date().toISOString(),
        responseTime: 5,
        uptime: 99.9,
        details: "Cache hit ratio optimal",
      },
      {
        id: uuidv4(),
        name: "File Storage",
        status: "critical",
        lastCheck: new Date().toISOString(),
        responseTime: 2100,
        uptime: 95.2,
        details: "Storage capacity at 85%, performance degraded",
      },
    ])

    setMetrics([
      {
        id: uuidv4(),
        name: "CPU Usage",
        value: 45,
        unit: "%",
        threshold: 80,
        status: "good",
        trend: "stable",
      },
      {
        id: uuidv4(),
        name: "Memory Usage",
        value: 72,
        unit: "%",
        threshold: 85,
        status: "warning",
        trend: "up",
      },
      {
        id: uuidv4(),
        name: "Disk Usage",
        value: 85,
        unit: "%",
        threshold: 90,
        status: "critical",
        trend: "up",
      },
      {
        id: uuidv4(),
        name: "Network I/O",
        value: 234,
        unit: "MB/s",
        threshold: 500,
        status: "good",
        trend: "stable",
      },
      {
        id: uuidv4(),
        name: "Active Users",
        value: 1247,
        unit: "users",
        threshold: 2000,
        status: "good",
        trend: "up",
      },
      {
        id: uuidv4(),
        name: "Error Rate",
        value: 0.8,
        unit: "%",
        threshold: 2,
        status: "good",
        trend: "down",
      },
    ])

    setLogs([
      `${new Date().toISOString()} - INFO: Health check completed successfully`,
      `${new Date(Date.now() - 60000).toISOString()} - WARN: API Gateway response time elevated`,
      `${new Date(Date.now() - 120000).toISOString()} - ERROR: File Storage capacity warning`,
      `${new Date(Date.now() - 180000).toISOString()} - INFO: Database connection pool optimized`,
      `${new Date(Date.now() - 240000).toISOString()} - INFO: Cache layer performance improved`,
      `${new Date(Date.now() - 300000).toISOString()} - WARN: Memory usage approaching threshold`,
    ])
  }, [])

  const refreshHealthCheck = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update timestamps and simulate some changes
    setSystemStatuses((prev) =>
      prev.map((status) => ({
        ...status,
        lastCheck: new Date().toISOString(),
        responseTime: Math.max(1, status.responseTime + (Math.random() - 0.5) * 100),
      })),
    )

    setIsRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "good":
        return "#10b981"
      case "warning":
        return "#f59e0b"
      case "critical":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "↗️"
      case "down":
        return "↘️"
      default:
        return "→"
    }
  }

  const overallHealth = systemStatuses.every((s) => s.status === "healthy")
    ? "healthy"
    : systemStatuses.some((s) => s.status === "critical")
      ? "critical"
      : "warning"

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", padding: "20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#1f2937", marginBottom: "8px" }}>
              System Health Check
            </h1>
            <p style={{ color: "#6b7280", fontSize: "16px" }}>Monitor system status, performance metrics, and logs</p>
          </div>
          <button
            onClick={refreshHealthCheck}
            disabled={isRefreshing}
            style={{
              padding: "12px 24px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: isRefreshing ? "not-allowed" : "pointer",
              opacity: isRefreshing ? 0.6 : 1,
            }}
          >
            {isRefreshing ? "Refreshing..." : "Refresh Status"}
          </button>
        </div>

        {/* Overall Status */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "30px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            border: `2px solid ${getStatusColor(overallHealth)}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: getStatusColor(overallHealth),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
              }}
            >
              {overallHealth === "healthy" ? "✅" : overallHealth === "warning" ? "⚠️" : "❌"}
            </div>
            <div>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#1f2937",
                  margin: 0,
                  textTransform: "capitalize",
                }}
              >
                System Status: {overallHealth}
              </h2>
              <p style={{ color: "#6b7280", fontSize: "16px", margin: 0 }}>
                Last updated: {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: "30px" }}>
          <div
            style={{
              display: "flex",
              gap: "4px",
              backgroundColor: "#f1f5f9",
              padding: "4px",
              borderRadius: "8px",
              width: "fit-content",
            }}
          >
            {(["overview", "metrics", "logs"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: activeTab === tab ? "white" : "transparent",
                  color: activeTab === tab ? "#1f2937" : "#6b7280",
                  fontWeight: activeTab === tab ? "600" : "400",
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gap: "16px" }}>
            {systemStatuses.map((status) => (
              <div
                key={status.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  border: `1px solid ${getStatusColor(status.status)}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "16px",
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", margin: "0 0 8px 0" }}>
                      {status.name}
                    </h3>
                    <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>{status.details}</p>
                  </div>
                  <span
                    style={{
                      backgroundColor: getStatusColor(status.status),
                      color: "white",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "500",
                      textTransform: "capitalize",
                    }}
                  >
                    {status.status}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", textAlign: "center" }}>
                  <div>
                    <div style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937" }}>
                      {status.responseTime}ms
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>Response Time</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937" }}>{status.uptime}%</div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>Uptime</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "bold", color: "#1f2937" }}>
                      {new Date(status.lastCheck).toLocaleTimeString()}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>Last Check</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "metrics" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            {metrics.map((metric) => (
              <div
                key={metric.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937", margin: 0 }}>{metric.name}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "16px" }}>{getTrendIcon(metric.trend)}</span>
                    <span
                      style={{
                        backgroundColor: getStatusColor(metric.status),
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "8px",
                        fontSize: "10px",
                        fontWeight: "500",
                        textTransform: "uppercase",
                      }}
                    >
                      {metric.status}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "32px", fontWeight: "bold", color: "#1f2937", marginBottom: "4px" }}>
                    {metric.value.toLocaleString()} {metric.unit}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    Threshold: {metric.threshold.toLocaleString()} {metric.unit}
                  </div>
                </div>

                <div style={{ width: "100%", height: "8px", backgroundColor: "#f3f4f6", borderRadius: "4px" }}>
                  <div
                    style={{
                      width: `${Math.min(100, (metric.value / metric.threshold) * 100)}%`,
                      height: "100%",
                      backgroundColor: getStatusColor(metric.status),
                      borderRadius: "4px",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "logs" && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", marginBottom: "16px" }}>System Logs</h3>
            <div
              style={{
                backgroundColor: "#1f2937",
                color: "#e5e7eb",
                padding: "16px",
                borderRadius: "8px",
                fontFamily: "monospace",
                fontSize: "14px",
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {logs.map((log, index) => (
                <div key={index} style={{ marginBottom: "8px", lineHeight: "1.4" }}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
