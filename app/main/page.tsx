"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Rocket,
  Users,
  Target,
  BarChart3,
  Settings,
  Bell,
  Search,
  Zap,
  TrendingUp,
  MessageSquare,
  FileText,
  Globe,
} from "lucide-react"
import Link from "next/link"

export default function MainDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigationItems = [
    { name: "HOMEBASE", href: "/homebase", icon: BarChart3, description: "Your startup command center" },
    { name: "COMMAND DECK", href: "/command-deck", icon: Zap, description: "Mission control operations" },
    { name: "TEAM", href: "/team", icon: Users, description: "Manage your crew" },
    { name: "RESEARCH", href: "/research", icon: Search, description: "Market intelligence" },
    { name: "PRODUCT", href: "/product", icon: Rocket, description: "Build and iterate" },
    { name: "SALES", href: "/sales", icon: Target, description: "Revenue generation" },
    { name: "NETWORK", href: "/network", icon: Globe, description: "Professional connections" },
    { name: "REPORTS", href: "/reports", icon: FileText, description: "Analytics and insights" },
    { name: "FORECAST", href: "/forecast", icon: TrendingUp, description: "Future projections" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Top Navigation Bar */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Rocket className="h-8 w-8 text-purple-400" />
                <span className="ml-2 text-xl font-bold text-white">StartupOS</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Settings className="h-4 w-4" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Mission Control</h1>
          <p className="text-xl text-white/70">Your startup's command center</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Target className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/70">Active Goals</p>
                  <p className="text-2xl font-bold text-white">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Users className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/70">Team Members</p>
                  <p className="text-2xl font-bold text-white">8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/70">Growth Rate</p>
                  <p className="text-2xl font-bold text-white">+23%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Rocket className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/70">MVP Progress</p>
                  <p className="text-2xl font-bold text-white">78%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {navigationItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm hover:bg-black/50 transition-all duration-200 hover:scale-105 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                      <item.icon className="h-8 w-8 text-purple-400" />
                    </div>
                    <Badge variant="secondary" className="bg-white/10 text-white/70">
                      Active
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.name}</h3>
                  <p className="text-sm text-white/70">{item.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-white/70">Latest updates from your team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm text-white">
                    <span className="font-medium">Jane Smith</span> completed user research analysis
                  </p>
                  <p className="text-xs text-white/50">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>MJ</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm text-white">
                    <span className="font-medium">Mike Johnson</span> pushed new features to staging
                  </p>
                  <p className="text-xs text-white/50">4 hours ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>SW</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm text-white">
                    <span className="font-medium">Sarah Wilson</span> updated product roadmap
                  </p>
                  <p className="text-xs text-white/50">1 day ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription className="text-white/70">Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/command-deck">
                <Button
                  variant="outline"
                  className="w-full justify-start border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Create New Task
                </Button>
              </Link>

              <Link href="/team">
                <Button
                  variant="outline"
                  className="w-full justify-start border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Invite Team Member
                </Button>
              </Link>

              <Link href="/research">
                <Button
                  variant="outline"
                  className="w-full justify-start border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Start Research
                </Button>
              </Link>

              <Link href="/reports">
                <Button
                  variant="outline"
                  className="w-full justify-start border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
