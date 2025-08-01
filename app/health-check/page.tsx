"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Zap,
  Search,
  BarChart3,
  PieChart,
  LineChart,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

interface HealthMetric {
  id: string
  title: string
  score: number
  icon: React.ComponentType<any>
  color: string
  description: string
  details: string[]
}

export default function HealthCheckPage() {
  const [analysisInput, setAnalysisInput] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)

  const healthMetrics: HealthMetric[] = [
    {
      id: "product",
      title: "Product & Innovation",
      score: 85,
      icon: Target,
      color: "bg-blue-500",
      description: "Product development and innovation pipeline",
      details: [
        "Strong product-market fit indicators",
        "Active development pipeline",
        "User feedback integration",
        "Feature adoption rates",
      ],
    },
    {
      id: "marketing",
      title: "Marketing & Brand",
      score: 62,
      icon: TrendingUp,
      color: "bg-green-500",
      description: "Brand awareness and marketing effectiveness",
      details: [
        "Brand recognition growing",
        "Social media engagement",
        "Content marketing strategy",
        "Lead generation pipeline",
      ],
    },
    {
      id: "sales",
      title: "Sales & Revenue",
      score: 95,
      icon: DollarSign,
      color: "bg-emerald-500",
      description: "Revenue generation and sales performance",
      details: [
        "Consistent revenue growth",
        "Strong conversion rates",
        "Expanding customer base",
        "Recurring revenue streams",
      ],
    },
    {
      id: "team",
      title: "Team & Culture",
      score: 73,
      icon: Users,
      color: "bg-purple-500",
      description: "Team performance and company culture",
      details: [
        "High employee satisfaction",
        "Low turnover rate",
        "Strong team collaboration",
        "Clear career progression",
      ],
    },
    {
      id: "operations",
      title: "Operations & Scalability",
      score: 45,
      icon: Zap,
      color: "bg-orange-500",
      description: "Operational efficiency and scalability",
      details: [
        "Process optimization needed",
        "Infrastructure scaling",
        "Automation opportunities",
        "Quality control systems",
      ],
    },
    {
      id: "financial",
      title: "Financial Health",
      score: 88,
      icon: BarChart3,
      color: "bg-indigo-500",
      description: "Financial stability and growth metrics",
      details: ["Strong cash flow", "Healthy profit margins", "Controlled burn rate", "Investment readiness"],
    },
  ]

  const handleAnalysis = async () => {
    if (!analysisInput.trim()) return

    setIsAnalyzing(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const analysisResults = {
      team: "Your team structure shows strong leadership but may benefit from additional technical expertise in scaling operations.",
      product:
        "Product development is on track with good user feedback. Consider expanding feature set based on user requests.",
      growth: "Growth metrics indicate healthy expansion. Focus on customer retention and referral programs.",
      research: "Market research suggests opportunities in adjacent markets. Consider strategic partnerships.",
      default: `Analysis for "${analysisInput}": This area shows potential for improvement. Consider implementing data-driven strategies and regular monitoring to optimize performance.`,
    }

    const key = Object.keys(analysisResults).find((k) => analysisInput.toLowerCase().includes(k)) || "default"

    setAnalysisResult(analysisResults[key as keyof typeof analysisResults])
    setIsAnalyzing(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/homebase"
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Back to Homebase</span>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Startup Health Analysis</h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Monitor and optimize your startup's key performance areas
                  </p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="px-3 py-1">
              Last updated: {new Date().toLocaleDateString()}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Analysis Section */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Targeted Health Analysis</span>
            </CardTitle>
            <CardDescription>
              Analyze specific areas of your startup for detailed insights and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Input
                placeholder="Enter area to analyze (e.g., team, product, growth, research)"
                value={analysisInput}
                onChange={(e) => setAnalysisInput(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === "Enter" && handleAnalysis()}
              />
              <Button onClick={handleAnalysis} disabled={isAnalyzing || !analysisInput.trim()} className="px-6">
                {isAnalyzing ? "Analyzing..." : "Analyze"}
              </Button>
            </div>

            {analysisResult && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Analysis Result</h4>
                <p className="text-blue-800 dark:text-blue-200">{analysisResult}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Metrics Dashboard */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Startup Health Metrics</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {healthMetrics.map((metric) => {
              const IconComponent = metric.icon
              return (
                <Card
                  key={metric.id}
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:scale-105"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-lg ${metric.color} bg-opacity-10`}>
                        <IconComponent className={`h-6 w-6 ${metric.color.replace("bg-", "text-")}`} />
                      </div>
                      <Badge variant={getScoreBadgeVariant(metric.score)}>{metric.score}%</Badge>
                    </div>
                    <CardTitle className="text-lg">{metric.title}</CardTitle>
                    <CardDescription className="text-sm">{metric.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Health Score</span>
                          <span className={`text-sm font-bold ${getScoreColor(metric.score)}`}>{metric.score}%</span>
                        </div>
                        <Progress value={metric.score} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Key Indicators:</h4>
                        <ul className="space-y-1">
                          {metric.details.slice(0, 2).map((detail, index) => (
                            <li key={index} className="text-xs text-slate-600 dark:text-slate-400 flex items-center">
                              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-2" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Overall Health</p>
                  <p className="text-3xl font-bold">
                    {Math.round(healthMetrics.reduce((acc, m) => acc + m.score, 0) / healthMetrics.length)}%
                  </p>
                </div>
                <PieChart className="h-8 w-8 text-green-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Areas Above 80%</p>
                  <p className="text-3xl font-bold">{healthMetrics.filter((m) => m.score >= 80).length}</p>
                </div>
                <LineChart className="h-8 w-8 text-blue-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-r from-purple-500 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Needs Attention</p>
                  <p className="text-3xl font-bold">{healthMetrics.filter((m) => m.score < 60).length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-100" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
