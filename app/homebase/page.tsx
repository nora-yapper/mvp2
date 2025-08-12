"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Plus,
  Settings,
  User,
  BarChart3,
  Users,
  Target,
  MessageSquare,
  FileText,
  Zap,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

interface HomebaseComponent {
  id: string
  title: string
  content: string
}

export default function HomebasePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [components, setComponents] = useState<HomebaseComponent[]>([])
  const [tasks, setTasks] = useState([])

  // Load components from session storage on mount
  useEffect(() => {
    const storedComponents = sessionStorage.getItem("homebaseComponents")
    if (storedComponents) {
      setComponents(JSON.parse(storedComponents))
    } else {
      // Initialize with comprehensive "About Your Startup" component
      const defaultComponent: HomebaseComponent = {
        id: "about-startup",
        title: "About Your Startup",
        content: JSON.stringify({
          basicInfo: {
            startupName: "",
            shortDescription: "",
            industrySector: "",
            stage: "Idea",
            teamMembers: "",
          },
          motivation: "",
          assets: {
            website: "",
            pitchDeck: "",
            otherWorkspaces: "",
          },
        }),
      }
      setComponents([defaultComponent])
      sessionStorage.setItem("homebaseComponents", JSON.stringify([defaultComponent]))
    }
  }, [])

  // Save components to session storage whenever components change
  useEffect(() => {
    if (components.length > 0) {
      sessionStorage.setItem("homebaseComponents", JSON.stringify(components))
    }
  }, [components])

  useEffect(() => {
    const loadTasks = () => {
      const savedTasks = localStorage.getItem("commandDeckTasks")
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks))
      }
    }

    loadTasks()

    // Listen for storage changes to update tasks in real-time
    const handleStorageChange = () => {
      loadTasks()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const addNewComponent = () => {
    const newComponent: HomebaseComponent = {
      id: `component-${Date.now()}`,
      title: "New Component",
      content: "Enter your content here.",
    }
    setComponents([...components, newComponent])
  }

  const updateComponentTitle = (id: string, newTitle: string) => {
    setComponents(components.map((comp) => (comp.id === id ? { ...comp, title: newTitle } : comp)))
  }

  const handleComponentClick = (component: HomebaseComponent) => {
    window.location.href = `/homebase/task?component=${component.id}`
  }

  const handleBackToMain = () => {
    window.location.href = "/main"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link href="/main">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-white">Homebase Workspace</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`${sidebarOpen ? "w-64" : "w-16"} transition-all duration-300 bg-black/30 backdrop-blur-sm border-r border-white/10 min-h-screen`}
        >
          <div className="p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full justify-start text-white hover:bg-white/10"
            >
              <BarChart3 className="h-4 w-4" />
              {sidebarOpen && <span className="ml-2">Dashboard</span>}
            </Button>
          </div>

          <nav className="px-4 space-y-2">
            <Link href="/team">
              <Button variant="ghost" size="sm" className="w-full justify-start text-white hover:bg-white/10">
                <Users className="h-4 w-4" />
                {sidebarOpen && <span className="ml-2">Team</span>}
              </Button>
            </Link>
            <Link href="/homebase/tasks">
              <Button variant="ghost" size="sm" className="w-full justify-start text-white hover:bg-white/10">
                <Target className="h-4 w-4" />
                {sidebarOpen && <span className="ml-2">Tasks</span>}
              </Button>
            </Link>
            <Link href="/command-deck">
              <Button variant="ghost" size="sm" className="w-full justify-start text-white hover:bg-white/10">
                <Zap className="h-4 w-4" />
                {sidebarOpen && <span className="ml-2">Command Deck</span>}
              </Button>
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto max-h-screen">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">HOMEBASE</h1>
              <p className="text-white/70">Your startup command center</p>
            </div>

            {/* Component Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* About Your Startup */}
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    About Your Startup
                  </CardTitle>
                  <CardDescription className="text-white/70">Core information and metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {components.map((component) => (
                    <div key={component.id}>
                      {component.id === "about-startup" && (
                        <div>
                          <div>
                            <strong>Name:</strong>{" "}
                            {JSON.parse(component.content).basicInfo?.startupName || "Not specified"}
                          </div>
                          <div>
                            <strong>Description:</strong>{" "}
                            {JSON.parse(component.content).basicInfo?.shortDescription || "Not specified"}
                          </div>
                          <div>
                            <strong>Industry:</strong>{" "}
                            {JSON.parse(component.content).basicInfo?.industrySector || "Not specified"}
                          </div>
                          <div>
                            <strong>Stage:</strong> {JSON.parse(component.content).basicInfo?.stage || "Idea"}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Mission</h4>
                    <p className="text-sm text-white/70">Building the future of AI-powered productivity tools</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Stage</h4>
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                      MVP Development
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Progress</h4>
                    <Progress value={65} className="h-2" />
                    <p className="text-xs text-white/50 mt-1">65% complete</p>
                  </div>
                </CardContent>
              </Card>

              {/* Command Deck Tasks */}
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Command Deck Tasks
                  </CardTitle>
                  <CardDescription className="text-white/70">Active mission objectives</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tasks.length > 0 ? (
                    <div>
                      <div>
                        <strong>Active Tasks:</strong> {tasks.filter((t) => t.status === "pending").length}
                      </div>
                      <div>
                        <strong>Total Tasks:</strong> {tasks.length}
                      </div>
                      <div style={{ marginTop: "10px", fontSize: "12px", color: "#888" }}>
                        Recent:{" "}
                        {tasks
                          .slice(-2)
                          .map((t) => t.title.substring(0, 30) + "...")
                          .join(", ")}
                      </div>
                    </div>
                  ) : (
                    "No tasks yet. Implement suggestions from Forecast to add tasks here."
                  )}
                  <Link href="/command-deck">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3 border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      View All Tasks
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Team Overview */}
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Team Overview
                  </CardTitle>
                  <CardDescription className="text-white/70">Your startup crew</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-white">John Doe</p>
                      <p className="text-xs text-white/50">CEO & Founder</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-white">Jane Smith</p>
                      <p className="text-xs text-white/50">CTO</p>
                    </div>
                  </div>
                  <Link href="/team">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3 border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      View Team
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-white/70">Latest updates and notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-white/70">
                    <p className="font-medium text-white">Task completed</p>
                    <p className="text-xs">Market research analysis finished</p>
                    <p className="text-xs text-white/50">2 hours ago</p>
                  </div>
                  <div className="text-sm text-white/70">
                    <p className="font-medium text-white">New team member</p>
                    <p className="text-xs">Sarah joined as Product Designer</p>
                    <p className="text-xs text-white/50">1 day ago</p>
                  </div>
                  <div className="text-sm text-white/70">
                    <p className="font-medium text-white">Milestone reached</p>
                    <p className="text-xs">MVP development 65% complete</p>
                    <p className="text-xs text-white/50">3 days ago</p>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription className="text-white/70">Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-white">User Acquisition</span>
                      <span className="text-sm text-white">+12%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-white">Revenue Growth</span>
                      <span className="text-sm text-white">+8%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-white">Product Development</span>
                      <span className="text-sm text-white">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Add New Component */}
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm border-dashed">
                <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px]">
                  <Button
                    variant="ghost"
                    onClick={addNewComponent}
                    className="text-white hover:bg-white/10 flex flex-col items-center gap-2"
                  >
                    <Plus className="h-8 w-8" />
                    <span>Add New Component</span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
