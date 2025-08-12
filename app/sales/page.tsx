"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Target, Users, TrendingUp, DollarSign } from "lucide-react"
import Link from "next/link"

export default function SalesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const salesAreas = [
    {
      title: "Sales Planning",
      description: "Plan sales strategy and goals",
      icon: Target,
      href: "/sales/plan",
    },
    {
      title: "Lead Management",
      description: "Track and manage leads",
      icon: Users,
      href: "/sales/detail",
    },
    {
      title: "Sales Tasks",
      description: "Manage sales activities",
      icon: TrendingUp,
      href: "/sales/task",
    },
    {
      title: "Revenue Analytics",
      description: "Monitor sales performance",
      icon: DollarSign,
      href: "/sales/detail",
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
          <h1 className="text-3xl font-bold text-gray-100">Sales</h1>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            New Lead
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* Sales Areas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {salesAreas.map((area, index) => (
                <Link key={index} href={area.href}>
                  <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <area.icon className="h-8 w-8 text-green-400" />
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

            {/* Sales Overview */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100">Sales Overview</CardTitle>
                <CardDescription className="text-gray-400">
                  Current sales performance and pipeline status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">$45K</div>
                    <div className="text-sm text-gray-400">Monthly Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">23</div>
                    <div className="text-sm text-gray-400">Active Leads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">12%</div>
                    <div className="text-sm text-gray-400">Conversion Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">$120K</div>
                    <div className="text-sm text-gray-400">Pipeline Value</div>
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
