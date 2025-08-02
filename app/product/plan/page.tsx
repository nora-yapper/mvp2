"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Target,
  Lightbulb,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Share2,
} from "lucide-react"
import Link from "next/link"

export default function ProductPlanPage() {
  const [activePhase, setActivePhase] = useState(0)

  const phases = [
    {
      title: "Discovery & Validation",
      duration: "4-6 weeks",
      status: "current",
      progress: 65,
      tasks: [
        { title: "Market Research", completed: true },
        { title: "User Interviews", completed: true },
        { title: "Competitive Analysis", completed: false },
        { title: "Problem Validation", completed: false },
      ],
    },
    {
      title: "MVP Development",
      duration: "8-12 weeks",
      status: "upcoming",
      progress: 0,
      tasks: [
        { title: "Feature Prioritization", completed: false },
        { title: "Technical Architecture", completed: false },
        { title: "UI/UX Design", completed: false },
        { title: "Core Development", completed: false },
      ],
    },
    {
      title: "Testing & Launch",
      duration: "4-6 weeks",
      status: "upcoming",
      progress: 0,
      tasks: [
        { title: "Beta Testing", completed: false },
        { title: "User Feedback Integration", completed: false },
        { title: "Launch Strategy", completed: false },
        { title: "Go-to-Market Execution", completed: false },
      ],
    },
  ]

  const keyMetrics = [
    { label: "Market Size", value: "$2.5B", trend: "up" },
    { label: "Target Users", value: "50K+", trend: "up" },
    { label: "Competition Level", value: "Medium", trend: "neutral" },
    { label: "Development Time", value: "16-24 weeks", trend: "neutral" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/main"
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Back to Main</span>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Your Product Development Plan</h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Strategic roadmap for your product launch
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Badge variant="outline" className="px-3 py-1">
                Generated Plan
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {keyMetrics.map((metric, index) => (
                <Card key={index} className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{metric.label}</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{metric.value}</p>
                      </div>
                      <TrendingUp
                        className={`h-5 w-5 ${
                          metric.trend === "up"
                            ? "text-green-500"
                            : metric.trend === "down"
                              ? "text-red-500"
                              : "text-slate-400"
                        }`}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Product Summary */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5" />
                  <span>Product Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Problem Statement</h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    Your product addresses a significant market gap by providing an innovative solution that streamlines
                    complex workflows for your target audience.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Unique Value Proposition</h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    Unlike existing solutions, your product combines ease of use with powerful functionality, offering
                    3x faster results at 50% lower cost.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Target Market</h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    Small to medium businesses in the technology sector, specifically targeting teams of 10-100
                    employees who need efficient workflow management.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-8">
            <div className="space-y-6">
              {phases.map((phase, index) => (
                <Card
                  key={index}
                  className={`shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm ${
                    phase.status === "current" ? "ring-2 ring-purple-500" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg ${
                            phase.status === "current"
                              ? "bg-purple-500"
                              : phase.status === "completed"
                                ? "bg-green-500"
                                : "bg-slate-400"
                          }`}
                        >
                          {phase.status === "completed" ? (
                            <CheckCircle className="h-5 w-5 text-white" />
                          ) : phase.status === "current" ? (
                            <Clock className="h-5 w-5 text-white" />
                          ) : (
                            <Calendar className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <span>{phase.title}</span>
                      </CardTitle>
                      <Badge variant={phase.status === "current" ? "default" : "secondary"}>{phase.duration}</Badge>
                    </div>
                    {phase.status === "current" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{phase.progress}%</span>
                        </div>
                        <Progress value={phase.progress} className="h-2" />
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {phase.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="flex items-center space-x-3">
                          {task.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <div className="h-4 w-4 border-2 border-slate-300 rounded-full" />
                          )}
                          <span
                            className={`text-sm ${
                              task.completed ? "text-slate-500 line-through" : "text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="strategy" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Go-to-Market Strategy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Launch Channels</h4>
                    <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <li>• Product Hunt launch</li>
                      <li>• Content marketing & SEO</li>
                      <li>• Industry partnerships</li>
                      <li>• Social media campaigns</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Pricing Strategy</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Freemium model with premium features starting at $29/month per user.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Market Competition</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Medium risk - established competitors exist but with differentiated positioning
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Technical Complexity</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        High risk - requires significant technical expertise and resources
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Market Demand</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Low risk - strong market validation and growing demand
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Immediate Action Items</CardTitle>
                <CardDescription>Priority tasks to move your product forward</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { task: "Complete competitive analysis research", priority: "High", due: "This week" },
                    { task: "Conduct 5 additional user interviews", priority: "High", due: "Next week" },
                    { task: "Finalize MVP feature specifications", priority: "Medium", due: "2 weeks" },
                    { task: "Set up development environment", priority: "Medium", due: "3 weeks" },
                    { task: "Create initial UI mockups", priority: "Low", due: "1 month" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-4 w-4 border-2 border-slate-300 rounded-full" />
                        <span className="font-medium">{item.task}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge
                          variant={
                            item.priority === "High"
                              ? "destructive"
                              : item.priority === "Medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {item.priority}
                        </Badge>
                        <span className="text-sm text-slate-500">{item.due}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 pt-8">
          <Link href="/product/task">
            <Button size="lg" className="px-8">
              <Target className="mr-2 h-5 w-5" />
              Start Working on Tasks
            </Button>
          </Link>
          <Link href="/main">
            <Button variant="outline" size="lg" className="px-8 bg-transparent">
              Back to Main
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
