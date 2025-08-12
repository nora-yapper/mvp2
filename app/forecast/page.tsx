"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function ForecastPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ marginLeft: "0px", paddingTop: "80px" }}>
        <header className="flex items-center justify-between p-6 border-b border-gray-700">
          <h1 className="text-3xl font-bold text-gray-100">Forecast</h1>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100">Coming Soon</CardTitle>
                <CardDescription className="text-gray-400">Forecast functionality is under development</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  This page will contain financial forecasting, growth projections, and predictive analytics for your
                  startup.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
