"use client"

import Link from "next/link"
import { LayoutDashboard, Activity, Settings, Users, Bell, TrendingUp, Target, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomebasePage() {
  const navigationItems = [
    {
      title: "Dashboard",
      url: "/homebase",
      icon: LayoutDashboard,
      description: "Overview of all activities",
      isActive: true,
    },
    {
      title: "Health Analysis",
      url: "/health-check",
      icon: Activity,
      description: "Monitor startup health metrics",
      badge: "New",
    },
    {
      title: "Reports",
      url: "/reports",
      icon: BarChart3,
      description: "Detailed analytics and reports",
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      description: "System configuration",
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
      description: "User management",
    },
    {
      title: "Notifications",
      url: "/notifications",
      icon: Bell,
      description: "System alerts and updates",
    },
  ]

  const quickStats = [
    {
      title: "Overall Health",
      value: "74%",
      change: "+5%",
      icon: Activity,
      color: "text-green-600",
    },
    {
      title: "Active Projects",
      value: "12",
      change: "+2",
      icon: Target,
      color: "text-blue-600",
    },
    {
      title: "Growth Rate",
      value: "23%",
      change: "+8%",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Homebase Dashboard</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Welcome back! Here's what's happening with your startup.
              </p>
            </div>
            <Badge variant="outline" className="px-3 py-1">
              {new Date().toLocaleDateString()}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{stat.title}</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                      <p className={`text-sm ${stat.color}`}>{stat.change} from last month</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-slate-100 dark:bg-slate-700`}>
                      <IconComponent className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Navigation Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Quick Access</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {navigationItems.map((item, index) => {
              const IconComponent = item.icon
              return (
                <Link key={index} href={item.url}>
                  <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:scale-105">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div
                          className={`p-3 rounded-lg ${item.isActive ? "bg-blue-500" : "bg-slate-100 dark:bg-slate-700"}`}
                        >
                          <IconComponent
                            className={`h-6 w-6 ${item.isActive ? "text-white" : "text-slate-600 dark:text-slate-400"}`}
                          />
                        </div>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="text-sm">{item.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across your startup</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Activity className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Health Analysis completed</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Overall score improved to 74%</p>
                </div>
                <span className="text-xs text-slate-500">2 hours ago</span>
              </div>

              <div className="flex items-center space-x-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Target className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New project milestone reached</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Product development phase completed</p>
                </div>
                <span className="text-xs text-slate-500">1 day ago</span>
              </div>

              <div className="flex items-center space-x-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Growth metrics updated</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Monthly growth rate increased by 8%</p>
                </div>
                <span className="text-xs text-slate-500">3 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
