"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, FileText, Users, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"

export default function ResearchPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const researchAreas = [
    {
      title: "Market Analysis",
      description: "Analyze market size, trends, and opportunities",
      icon: TrendingUp,
      href: "/research/detail?type=market",
    },
    {
      title: "Competitor Research",
      description: "Study competitors and competitive landscape",
      icon: Search,
      href: "/research/detail?type=competitor",
    },
    {
      title: "Customer Insights",
      description: "Understand customer needs and behavior",
      icon: Users,
      href: "/research/detail?type=customer",
    },
    {
      title: "Industry Reports",
      description: "Access industry reports and analysis",
      icon: FileText,
      href: "/research/detail?type=industry",
    },
  ]

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
          <h1 className="text-3xl font-bold text-gray-100">Research</h1>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            New Research
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* Research Areas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {researchAreas.map((area, index) => (
                <Link key={index} href={area.href}>
                  <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <area.icon className="h-8 w-8 text-blue-400" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-gray-100 text-lg mb-2">{area.title}</CardTitle>
                      <CardDescription className="text-gray-400">{area.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Recent Research */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100">Recent Research</CardTitle>
                <CardDescription className="text-gray-400">
                  Your latest research activities and findings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-100">SaaS Market Analysis 2024</h4>
                      <p className="text-sm text-gray-400">Market size: $195B, Growth rate: 18% YoY</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-200 bg-transparent">
                      View
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-100">Competitor Analysis: Top 5 Players</h4>
                      <p className="text-sm text-gray-400">Detailed analysis of market leaders</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-200 bg-transparent">
                      View
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-100">Customer Survey Results</h4>
                      <p className="text-sm text-gray-400">Insights from 150 potential customers</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-200 bg-transparent">
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
