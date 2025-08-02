"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Search,
  Users,
  Target,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Download,
  Share2,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"

export default function ResearchPlanPage() {
  const [activePhase, setActivePhase] = useState(0)

  const researchPhases = [
    {
      title: "Market Analysis",
      duration: "2-3 weeks",
      status: "current",
      progress: 45,
      tasks: [
        { title: "Industry research", completed: true },
        { title: "Market size analysis", completed: true },
        { title: "Trend identification", completed: false },
        { title: "Opportunity mapping", completed: false },
      ],
    },
    {
      title: "Customer Discovery",
      duration: "3-4 weeks",
      status: "upcoming",
      progress: 0,
      tasks: [
        { title: "Customer interviews", completed: false },
        { title: "Survey deployment", completed: false },
        { title: "User persona development", completed: false },
        { title: "Pain point analysis", completed: false },
      ],
    },
    {
      title: "Competitive Analysis",
      duration: "2-3 weeks",
      status: "upcoming",
      progress: 0,
      tasks: [
        { title: "Competitor identification", completed: false },
        { title: "Feature comparison", completed: false },
        { title: "Pricing analysis", completed: false },
        { title: "Gap analysis", completed: false },
      ],
    },
    {
      title: "Validation & Insights",
      duration: "1-2 weeks",
      status: "upcoming",
      progress: 0,
      tasks: [
        { title: "Data synthesis", completed: false },
        { title: "Insight generation", completed: false },
        { title: "Recommendation development", completed: false },
        { title: "Final report", completed: false },
      ],
    },
  ]

  const keyFindings = [
    { label: "Market Size", value: "$1.2B", insight: "Growing at 15% annually" },
    { label: "Target Customers", value: "2.5M", insight: "Underserved segment identified" },
    { label: "Competition", value: "12 players", insight: "Fragmented market" },
    { label: "Price Sensitivity", value: "Medium", insight: "Value-focused buyers" },
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
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Your Research Plan</h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Comprehensive market research strategy</p>
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
            <TabsTrigger value="methodology">Methodology</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Key Findings */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {keyFindings.map((finding, index) => (
                <Card key={index} className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{finding.label}</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{finding.value}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{finding.insight}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Research Objectives */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Research Objectives</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Primary Goals</h4>
                    <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <li>• Validate market demand for your solution</li>
                      <li>• Identify target customer segments</li>
                      <li>• Understand customer pain points</li>
                      <li>• Assess competitive landscape</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Success Metrics</h4>
                    <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <li>• 50+ customer interviews completed</li>
                      <li>• 3 validated customer personas</li>
                      <li>• Market size quantified</li>
                      <li>• Competitive positioning defined</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="methodology" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Qualitative Research</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Customer Interviews</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      In-depth interviews with potential customers to understand their needs, pain points, and
                      behaviors.
                    </p>
                    <ul className="text-xs text-slate-500 space-y-1">
                      <li>• 30-45 minute sessions</li>
                      <li>• 20-30 interviews total</li>
                      <li>• Mix of phone and video calls</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Focus Groups</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Group discussions to explore attitudes and reactions to your concept.
                    </p>
                    <ul className="text-xs text-slate-500 space-y-1">
                      <li>• 6-8 participants per group</li>
                      <li>• 2-3 focus groups</li>
                      <li>• 90-minute sessions</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Quantitative Research</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Market Surveys</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Large-scale surveys to quantify market demand and preferences.
                    </p>
                    <ul className="text-xs text-slate-500 space-y-1">
                      <li>• 500+ responses target</li>
                      <li>• Online survey platform</li>
                      <li>• 10-15 minutes completion time</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Market Analysis</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Secondary research using industry reports and data sources.
                    </p>
                    <ul className="text-xs text-slate-500 space-y-1">
                      <li>• Industry reports analysis</li>
                      <li>• Government data review</li>
                      <li>• Competitor financial analysis</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-8">
            <div className="space-y-6">
              {researchPhases.map((phase, index) => (
                <Card
                  key={index}
                  className={`shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm ${
                    phase.status === "current" ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg ${
                            phase.status === "current"
                              ? "bg-blue-500"
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

          <TabsContent value="resources" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Research Templates</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      "Customer Interview Guide",
                      "Survey Question Templates",
                      "Competitor Analysis Framework",
                      "Market Sizing Worksheet",
                      "Persona Development Template",
                    ].map((template, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                      >
                        <span className="text-sm font-medium">{template}</span>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Recommended Tools</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { name: "Calendly", purpose: "Interview scheduling" },
                      { name: "Typeform", purpose: "Survey creation" },
                      { name: "Zoom", purpose: "Video interviews" },
                      { name: "Notion", purpose: "Research documentation" },
                      { name: "Miro", purpose: "Data visualization" },
                    ].map((tool, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                      >
                        <div>
                          <span className="text-sm font-medium">{tool.name}</span>
                          <p className="text-xs text-slate-500">{tool.purpose}</p>
                        </div>
                        <Badge variant="outline">Recommended</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 pt-8">
          <Link href="/research/task">
            <Button size="lg" className="px-8">
              <Search className="mr-2 h-5 w-5" />
              Start Research Tasks
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
