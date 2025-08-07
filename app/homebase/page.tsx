"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, History, Menu, X } from 'lucide-react'
import { useRouter } from "next/navigation"

export default function CommandDeckPage() {
  const [mission, setMission] = useState("")
  const [activeView, setActiveView] = useState("Timeline")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const teamMembers = [
    { name: "Sarah Chen", workload: 45, status: "Underloaded" },
    { name: "Alex Johnson", workload: 75, status: "Balanced" },
    { name: "Mike Rodriguez", workload: 92, status: "Overloaded" },
    { name: "Emily Davis", workload: 68, status: "Balanced" },
    { name: "James Wilson", workload: 34, status: "Underloaded" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Overloaded":
        return "text-red-400"
      case "Balanced":
        return "text-green-400"
      case "Underloaded":
        return "text-yellow-400"
      default:
        return "text-gray-400"
    }
  }

  const getProgressColor = (workload: number) => {
    if (workload >= 90) return "bg-red-500"
    if (workload >= 70) return "bg-green-500"
    return "bg-yellow-500"
  }

  const navigationItems = [
    { name: "Map", path: "/main" },
    { name: "Command Deck", path: "/homebase", active: true },
    { name: "Health Analysis", path: "/health-check" },
    { name: "Forecast", path: "/forecast" },
    { name: "Reports", path: "/reports" },
    { name: "Network", path: "/network" },
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-slate-800 border-r border-slate-700 transform transition-transform duration-300 ease-in-out z-50`}
        style={{ left: sidebarOpen ? 0 : "-300px" }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Navigation</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:bg-slate-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  router.push(item.path)
                  setSidebarOpen(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  item.active
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="text-white hover:bg-slate-800"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">Command Deck</h1>
            </div>
            <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
              Recalibrate
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Set Your Mission */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Set Your Mission</h2>
          <Textarea
            placeholder="Describe your big goal..."
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            className="min-h-[120px] bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 resize-none"
          />
          <Button className="bg-blue-600 hover:bg-blue-700">
            Generate Plan
          </Button>
        </div>

        {/* Your Current Plan */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Your Current Plan</h2>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              {/* Plan Views Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Plan Views</h3>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm" className="border-slate-600 text-white hover:bg-slate-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-600 text-white hover:bg-slate-700">
                    <History className="h-4 w-4 mr-2" />
                    Task History
                  </Button>
                  <div className="flex space-x-1">
                    {["Timeline", "Kanban", "Table"].map((view) => (
                      <Button
                        key={view}
                        variant={activeView === view ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveView(view)}
                        className={
                          activeView === view
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "border-slate-600 text-white hover:bg-slate-700"
                        }
                      >
                        {view}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Timeline View */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tasks Column */}
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="mb-4">
                    <h4 className="font-medium">Tasks</h4>
                    <p className="text-sm text-slate-400">0 records</p>
                  </div>
                  <div className="text-center py-8">
                    <p className="text-slate-400 text-sm leading-relaxed">
                      No tasks currently. Generate and implement a plan to see tasks here.
                    </p>
                  </div>
                </div>

                {/* August Column */}
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="text-center mb-4">
                    <h4 className="font-medium">August</h4>
                    <p className="text-sm text-slate-400">2025</p>
                  </div>
                  <div className="text-center py-8">
                    <p className="text-slate-400 text-sm">
                      Timeline will appear when tasks are added
                    </p>
                  </div>
                </div>

                {/* September Column */}
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="text-center mb-4">
                    <h4 className="font-medium">September</h4>
                    <p className="text-sm text-slate-400">2025</p>
                  </div>
                  <div className="text-center py-8">
                    <p className="text-slate-400 text-sm">
                      Timeline will appear when tasks are added
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Workload */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Team Workload</h2>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="space-y-6">
                {teamMembers.map((member, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{member.name}</h4>
                      <div className="flex items-center space-x-3">
                        <span className={`text-sm ${getStatusColor(member.status)}`}>
                          {member.status}
                        </span>
                        <span className="text-sm text-slate-400">{member.workload}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(member.workload)}`}
                        style={{ width: `${member.workload}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
