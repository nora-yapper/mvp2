"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Lightbulb, Users, Target, Zap, CheckCircle, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function ProductPage() {
  const [formData, setFormData] = useState({
    productName: "",
    problemStatement: "",
    targetAudience: "",
    uniqueValue: "",
    keyFeatures: "",
    businessModel: "",
    competitiveAdvantage: "",
    successMetrics: "",
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
    sessionStorage.setItem("productPlanGenerated", "true")
    window.location.href = "/product/plan"
  }

  const isFormValid = Object.values(formData).every((value) => value.trim() !== "")

  const sections = [
    {
      title: "Product Overview",
      icon: Lightbulb,
      fields: [
        { key: "productName", label: "Product Name", placeholder: "What's your product called?" },
        {
          key: "problemStatement",
          label: "Problem Statement",
          placeholder: "What problem does your product solve?",
          multiline: true,
        },
      ],
    },
    {
      title: "Market & Audience",
      icon: Users,
      fields: [
        {
          key: "targetAudience",
          label: "Target Audience",
          placeholder: "Who are your ideal customers?",
          multiline: true,
        },
        {
          key: "uniqueValue",
          label: "Unique Value Proposition",
          placeholder: "What makes your product unique?",
          multiline: true,
        },
      ],
    },
    {
      title: "Product Strategy",
      icon: Target,
      fields: [
        {
          key: "keyFeatures",
          label: "Key Features",
          placeholder: "What are the core features of your product?",
          multiline: true,
        },
        { key: "businessModel", label: "Business Model", placeholder: "How will you make money?", multiline: true },
      ],
    },
    {
      title: "Competitive Edge",
      icon: Zap,
      fields: [
        {
          key: "competitiveAdvantage",
          label: "Competitive Advantage",
          placeholder: "What's your competitive advantage?",
          multiline: true,
        },
        {
          key: "successMetrics",
          label: "Success Metrics",
          placeholder: "How will you measure success?",
          multiline: true,
        },
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
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Product Development Plan</h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Define your product strategy and roadmap</p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="px-3 py-1">
              Step 2 of 4
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {isGenerating ? (
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full w-16 h-16 flex items-center justify-center">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Generating Your Product Plan</CardTitle>
                <CardDescription>
                  Creating a comprehensive product development strategy based on your inputs...
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
                    <span className="text-sm">Defining product requirements</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {progress >= 60 ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500 animate-spin" />
                    )}
                    <span className="text-sm">Creating development roadmap</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {progress >= 80 ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-slate-400" />
                    )}
                    <span className="text-sm">Generating strategic recommendations</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Let's Build Your Product Strategy
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Answer these questions to create a comprehensive product development plan tailored to your startup.
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
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
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
                          {field.multiline ? (
                            <Textarea
                              placeholder={field.placeholder}
                              value={formData[field.key as keyof typeof formData]}
                              onChange={(e) => handleInputChange(field.key, e.target.value)}
                              className="min-h-[100px] resize-none"
                            />
                          ) : (
                            <Input
                              placeholder={field.placeholder}
                              value={formData[field.key as keyof typeof formData]}
                              onChange={(e) => handleInputChange(field.key, e.target.value)}
                            />
                          )}
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
                    <Target className="mr-2 h-5 w-5" />
                    Generate Product Plan
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
