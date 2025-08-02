"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Search, Users, Target, TrendingUp, CheckCircle, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function ResearchPage() {
  const [formData, setFormData] = useState({
    businessIdea: "",
    targetMarket: "",
    problemStatement: "",
    competitorAnalysis: "",
    uniqueValue: "",
    marketSize: "",
    customerSegments: "",
    researchGoals: "",
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleGeneratePlan = async () => {
    setIsGenerating(true)
    setProgress(0)

    // Simulate progress
    const progressSteps = [20, 40, 60, 80, 100]
    for (let i = 0; i < progressSteps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setProgress(progressSteps[i])
    }

    // Mark as generated and redirect
    sessionStorage.setItem("researchPlanGenerated", "true")
    window.location.href = "/research/plan"
  }

  const isFormValid = Object.values(formData).every((value) => value.trim() !== "")

  const sections = [
    {
      title: "Business Concept",
      icon: Target,
      fields: [
        { key: "businessIdea", label: "Business Idea", placeholder: "Describe your business idea in detail..." },
        { key: "problemStatement", label: "Problem Statement", placeholder: "What problem are you solving?" },
      ],
    },
    {
      title: "Market Analysis",
      icon: TrendingUp,
      fields: [
        { key: "targetMarket", label: "Target Market", placeholder: "Who is your target market?" },
        { key: "marketSize", label: "Market Size", placeholder: "What's the size of your target market?" },
      ],
    },
    {
      title: "Competitive Landscape",
      icon: Search,
      fields: [
        { key: "competitorAnalysis", label: "Competitor Analysis", placeholder: "Who are your main competitors?" },
        { key: "uniqueValue", label: "Unique Value Proposition", placeholder: "What makes you different?" },
      ],
    },
    {
      title: "Customer Research",
      icon: Users,
      fields: [
        { key: "customerSegments", label: "Customer Segments", placeholder: "Describe your customer segments..." },
        { key: "researchGoals", label: "Research Goals", placeholder: "What do you want to learn from research?" },
      ],
    },
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
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Market Research Plan</h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Validate your business idea with structured research
                  </p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="px-3 py-1">
              Step 1 of 4
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {isGenerating ? (
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full w-16 h-16 flex items-center justify-center">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Generating Your Research Plan</CardTitle>
                <CardDescription>
                  Creating a comprehensive market research strategy based on your inputs...
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Analyzing market opportunity</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Identifying research methodologies</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {progress >= 60 ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500 animate-spin" />
                    )}
                    <span className="text-sm">Creating interview guides</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {progress >= 80 ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-slate-400" />
                    )}
                    <span className="text-sm">Generating action plan</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Let's Research Your Market</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Answer these questions to create a comprehensive research plan that will validate your business idea and
                identify opportunities.
              </p>
            </div>

            <div className="grid gap-8">
              {sections.map((section, sectionIndex) => {
                const IconComponent = section.icon
                return (
                  <Card
                    key={sectionIndex}
                    className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <span>{section.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {section.fields.map((field) => (
                        <div key={field.key} className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {field.label}
                          </label>
                          <Textarea
                            placeholder={field.placeholder}
                            value={formData[field.key as keyof typeof formData]}
                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                            className="min-h-[100px] resize-none"
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="flex justify-center pt-8">
              <Button onClick={handleGeneratePlan} disabled={!isFormValid} size="lg" className="px-12 py-3 text-lg">
                {!isFormValid ? (
                  <>
                    <AlertCircle className="mr-2 h-5 w-5" />
                    Complete All Fields
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Generate Research Plan
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
