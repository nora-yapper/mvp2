"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Clock, BarChart3, Calendar, Table, Menu, X, Map, Home, Activity, TrendingUp, FileText, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"

export default function CommandDeckPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mission, setMission] = useState("")
  const [activeView, setActiveView] = useState("Timeline")

  const teamMembers = [
    { name: "Sarah Chen", workload: 45, status: "Underloaded" },
    { name: "Alex Johnson", workload: 75, status: "Balanced" },
    { name: "Mike Rodriguez", workload: 92, status: "Overloaded" },
    { name: "Emily Davis", workload: 68, status: "Balanced" },
    { name: "James Wilson", workload: 34, status: "Underloaded" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Overloaded": return "text-red-400"
      case "Balanced": return "text-green-400"
      case "Underloaded": return "text-yellow-400"
      default: return "text-gray-400"
    }
  }

  const getProgressColor = (workload: number) => {
    if (workload >= 90) return "bg-red-500"
    if (workload >= 70) return "bg-green-500"
    return "bg-yellow-500"
  }

  const navigationItems = [
    { name: "Map", icon: Map, path: "/main" },
    { name: "Command Deck", icon: Home, path: "/homebase", active: true },
    { name: "Health Analysis", icon: Activity, path: "/health-check" },
    { name: "Forecast", icon: TrendingUp, path: "/forecast" },
    { name: "Reports", icon: FileText, path: "/reports" },
    { name: "Network", icon: Users, path: "/network" },
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700">
        <div className="flex items-center gap-4">
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

      {/* Sidebar */}
      <div
        className="fixed inset-y-0 left-0 z-50 w-80 bg-slate-800 border-r border-slate-700 transform transition-transform duration-300 ease-in-out"
        style={{ left: sidebarOpen ? 0 : "-320px" }}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Navigation</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="text-white hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon
              return (
                <li key={item.name}>
                  <button
                    onClick={() => {
                      router.push(item.path)
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      item.active
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    {item.name}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="p-6 space-y-8">
        {/* Set Your Mission */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Set Your Mission</h2>
          <div className="space-y-4">
            <Textarea
              placeholder="Describe your big goal..."
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              className="min-h-[120px] bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 resize-none"
            />
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Generate Plan
            </Button>
          </div>
        </div>

        {/* Your Current Plan */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Your Current Plan</h2>
          
          {/* Plan Views Header */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium">Plan Views</h3>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="border-slate-600 text-white hover:bg-slate-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
                <Button variant="outline" size="sm" className="border-slate-600 text-white hover:bg-slate-700">
                  <Clock className="h-4 w-4 mr-2" />
                  Task History
                </Button>
                <div className="flex items-center gap-1">
                  <Button
                    variant={activeView === "Timeline" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveView("Timeline")}
                    className={activeView === "Timeline" ? "bg-blue-600 hover:bg-blue-700" : "border-slate-600 text-white hover:bg-slate-700"}
                  >
                    Timeline
                  </Button>
                  <Button
                    variant={activeView === "Kanban" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveView("Kanban")}
                    className={activeView === "Kanban" ? "bg-blue-600 hover:bg-blue-700" : "border-slate-600 text-white hover:bg-slate-700"}
                  >
                    Kanban
                  </Button>
                  <Button
                    variant={activeView === "Table" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveView("Table")}
                    className={activeView === "Table" ? "bg-blue-600 hover:bg-blue-700" : "border-slate-600 text-white hover:bg-slate-700"}
                  >
                    Table
                  </Button>
                </div>
              </div>
            </div>

            {/* Timeline View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tasks Column */}
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
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
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                <div className="mb-4 text-center">
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
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                <div className="mb-4 text-center">
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
          </div>
        </div>

        {/* Team Workload */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Team Workload</h2>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="space-y-6">
              {teamMembers.map((member, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{member.name}</h4>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                      <span className="text-sm text-slate-400">{member.workload}%</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(member.workload)}`}
                        style={{ width: `${member.workload}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
