"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Rocket, Settings, Users, BarChart } from "lucide-react"
import Link from "next/link"

export default function ProductPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const productAreas = [
    {
      title: "Product Planning",
      description: "Plan features and roadmap",
      icon: Rocket,
      href: "/product/plan",
    },
    {
      title: "Feature Development",
      description: "Track development progress",
      icon: Settings,
      href: "/product/detail",
    },
    {
      title: "User Feedback",
      description: "Collect and analyze feedback",
      icon: Users,
      href: "/product/task",
    },
    {
      title: "Product Analytics",
      description: "Monitor product metrics",
      icon: BarChart,
      href: "/product/detail",
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
          <h1 className="text-3xl font-bold text-gray-100">Product</h1>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            New Feature
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* Product Areas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {productAreas.map((area, index) => (
                <Link key={index} href={area.href}>
                  <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <area.icon className="h-8 w-8 text-purple-400" />
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

            {/* Product Overview */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100">Product Overview</CardTitle>
                <CardDescription className="text-gray-400">Current product status and key metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">12</div>
                    <div className="text-sm text-gray-400">Active Features</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">8</div>
                    <div className="text-sm text-gray-400">In Development</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">24</div>
                    <div className="text-sm text-gray-400">Planned Features</div>
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
