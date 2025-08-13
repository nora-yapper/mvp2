"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  Users,
  DollarSign,
  Target,
  Lightbulb,
  Zap,
  Calendar,
  User,
  Edit3,
  Trash2,
} from "lucide-react"

interface TeamMember {
  id: string
  name: string
  role: string
  skills: string[]
}

interface Suggestion {
  id: string
  title: string
  description: string
  type: "opportunity" | "risk" | "optimization"
  priority: "high" | "medium" | "low"
  impact: number
  effort: number
  timeline: string
}

interface ActionStep {
  id: string
  task: string
  assignee: string
  deadline: string
}

export default function ForecastPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null)
  const [showImplementation, setShowImplementation] = useState(false)
  const [actionSteps, setActionSteps] = useState<ActionStep[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [editingStep, setEditingStep] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ task: "", assignee: "", deadline: "" })

  // Load team members from localStorage
  useEffect(() => {
    const savedTeam = localStorage.getItem("teamMembers")
    if (savedTeam) {
      try {
        const parsedTeam = JSON.parse(savedTeam)
        setTeamMembers(parsedTeam)
      } catch (error) {
        console.error("Error parsing team members:", error)
      }
    }
  }, [])

  // Generate mock suggestions based on team and current context
  useEffect(() => {
    const mockSuggestions: Suggestion[] = [
      {
        id: "fundraising",
        title: "Prepare for Series A fundraising",
        description:
          "Based on your current growth trajectory and runway, now is an optimal time to start preparing for Series A funding. Market conditions are favorable for your sector.",
        type: "opportunity",
        priority: "high",
        impact: 90,
        effort: 75,
        timeline: "3-4 months",
      },
      {
        id: "techcrunch",
        title: "Apply to TechCrunch Disrupt",
        description:
          "Your product fits perfectly with TechCrunch Disrupt's focus areas. The exposure could significantly boost user acquisition and investor interest.",
        type: "opportunity",
        priority: "medium",
        impact: 70,
        effort: 40,
        timeline: "2-3 weeks",
      },
      {
        id: "team-scaling",
        title: "Address team scaling challenges",
        description:
          "Your team is growing rapidly, but there are signs of communication gaps and role overlap. Implementing better processes now will prevent future issues.",
        type: "risk",
        priority: "high",
        impact: 80,
        effort: 60,
        timeline: "1-2 months",
      },
      {
        id: "automation",
        title: "Automate customer onboarding",
        description:
          "Your customer success team is spending 60% of their time on manual onboarding tasks. Automation could free up resources for higher-value activities.",
        type: "optimization",
        priority: "medium",
        impact: 65,
        effort: 50,
        timeline: "4-6 weeks",
      },
      {
        id: "vision",
        title: "Clarify company vision alignment",
        description:
          "Recent team surveys indicate some confusion about long-term company direction. A vision alignment session could improve team cohesion and productivity.",
        type: "risk",
        priority: "medium",
        impact: 75,
        effort: 30,
        timeline: "1-2 weeks",
      },
    ]

    setSuggestions(mockSuggestions)
  }, [teamMembers])

  const handleImplementSuggestion = async (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion)
    setIsGenerating(true)
    setShowImplementation(true)

    try {
      const response = await fetch("/api/generate-implementation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          suggestion,
          teamMembers,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate implementation")
      }

      const data = await response.json()
      setActionSteps(
        data.steps.map((step: any, index: number) => ({
          ...step,
          id: `step-${index}-${Date.now()}`,
        })),
      )
    } catch (error) {
      console.error("Error generating implementation:", error)
      // Fallback to basic steps
      setActionSteps([
        {
          id: `step-1-${Date.now()}`,
          task: `Research and plan implementation for: ${suggestion.title}`,
          assignee: teamMembers.length > 0 ? teamMembers[0].name : "Founder",
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        },
      ])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEditStep = (step: ActionStep) => {
    setEditingStep(step.id)
    setEditForm({
      task: step.task,
      assignee: step.assignee,
      deadline: step.deadline,
    })
  }

  const handleSaveEdit = () => {
    if (editingStep) {
      setActionSteps((prev) => prev.map((step) => (step.id === editingStep ? { ...step, ...editForm } : step)))
      setEditingStep(null)
      setEditForm({ task: "", assignee: "", deadline: "" })
    }
  }

  const handleRemoveStep = (stepId: string) => {
    setActionSteps((prev) => prev.filter((step) => step.id !== stepId))
  }

  const handleConfirmImplementation = () => {
    // Add tasks to Command Deck
    const existingTasks = JSON.parse(localStorage.getItem("commandDeckTasks") || "[]")

    const newTasks = actionSteps.map((step) => ({
      id: `task-${Date.now()}-${Math.random()}`,
      title: step.task,
      description: `Implementation step for: ${selectedSuggestion?.title}`,
      assignee: step.assignee,
      deadline: step.deadline,
      status: "pending" as const,
      priority: selectedSuggestion?.priority || ("medium" as const),
      category: "implementation",
      createdAt: new Date().toISOString(),
      source: "forecast",
    }))

    const updatedTasks = [...existingTasks, ...newTasks]
    localStorage.setItem("commandDeckTasks", JSON.stringify(updatedTasks))

    // Trigger storage event to notify Command Deck
    window.dispatchEvent(
      new CustomEvent("storage", {
        detail: { key: "commandDeckTasks", newValue: JSON.stringify(updatedTasks) },
      }),
    )

    setShowImplementation(false)
    setSelectedSuggestion(null)
    setActionSteps([])
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <TrendingUp className="h-5 w-5 text-green-600" />
      case "risk":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case "optimization":
        return <Zap className="h-5 w-5 text-blue-600" />
      default:
        return <Lightbulb className="h-5 w-5 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Strategic Forecast</h1>
          <p className="text-muted-foreground mt-2">
            AI-powered insights and recommendations for your startup's next moves
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>{teamMembers.length} team members</span>
          </Badge>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Growth Score</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">78</div>
              <Progress value={78} className="mt-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Runway</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">14mo</div>
              <div className="text-xs text-muted-foreground">Healthy</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Opportunities</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{suggestions.filter((s) => s.type === "opportunity").length}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Risks</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{suggestions.filter((s) => s.type === "risk").length}</div>
              <div className="text-xs text-muted-foreground">To address</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5" />
            <span>Strategic Recommendations</span>
          </CardTitle>
          <CardDescription>
            AI-generated insights based on your startup's current state and market conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getSuggestionIcon(suggestion.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold">{suggestion.title}</h3>
                        <Badge className={getPriorityColor(suggestion.priority)}>{suggestion.priority}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Impact:</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <Progress value={suggestion.impact} className="flex-1" />
                            <span className="text-xs">{suggestion.impact}%</span>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Effort:</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <Progress value={suggestion.effort} className="flex-1" />
                            <span className="text-xs">{suggestion.effort}%</span>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Timeline:</span>
                          <div className="flex items-center space-x-1 mt-1">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs">{suggestion.timeline}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => handleImplementSuggestion(suggestion)} size="sm" className="ml-4">
                    Implement
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Dialog */}
      <Dialog open={showImplementation} onOpenChange={setShowImplementation}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Implementation Plan</DialogTitle>
            <DialogDescription>{selectedSuggestion?.title}</DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4">
              {isGenerating ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center space-y-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-muted-foreground">Generating implementation steps...</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Action Steps</h4>
                    {actionSteps.map((step, index) => (
                      <div key={step.id} className="border rounded-lg p-3 space-y-2">
                        {editingStep === step.id ? (
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="task">Task</Label>
                              <Textarea
                                id="task"
                                value={editForm.task}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, task: e.target.value }))}
                                className="mt-1"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label htmlFor="assignee">Assignee</Label>
                                <Input
                                  id="assignee"
                                  value={editForm.assignee}
                                  onChange={(e) => setEditForm((prev) => ({ ...prev, assignee: e.target.value }))}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor="deadline">Deadline</Label>
                                <Input
                                  id="deadline"
                                  type="date"
                                  value={editForm.deadline}
                                  onChange={(e) => setEditForm((prev) => ({ ...prev, deadline: e.target.value }))}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" onClick={handleSaveEdit}>
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingStep(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{step.task}</p>
                                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                                    <div className="flex items-center space-x-1">
                                      <User className="h-3 w-3" />
                                      <span>{step.assignee}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Calendar className="h-3 w-3" />
                                      <span>{new Date(step.deadline).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditStep(step)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit3 className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleRemoveStep(step.id)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowImplementation(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleConfirmImplementation} disabled={actionSteps.length === 0}>
                      Add to Command Deck
                    </Button>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
