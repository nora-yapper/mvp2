"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { earnTokensForStep, spendTokensForAI, hasEnoughTokens } from "@/lib/token-integration"

export default function ResearchTaskPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState<string>("")
  const [currentTask, setCurrentTask] = useState<string>("")
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  // Overview task states
  const [problemStatement, setProblemStatement] = useState("")
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Questions task states
  const [questions, setQuestions] = useState<Array<{ id: string; question: string; category: string }>>([])
  const [newQuestion, setNewQuestion] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("problem-discovery")
  const [evaluation, setEvaluation] = useState<string | null>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [gameScore, setGameScore] = useState<number | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [gameQuestions] = useState([
    {
      question: "Would you use an app that helps you track your daily habits?",
      feedback:
        "This is asking about future intentions, not past behavior. Try asking about current habit tracking methods instead.",
      isGood: false,
    },
    {
      question: "Tell me about the last time you tried to build a new habit. What was challenging about it?",
      feedback: "Great! This asks about past behavior and real experiences. It will give you concrete insights.",
      isGood: true,
    },
    {
      question: "Don't you think habit tracking apps are useful?",
      feedback:
        "This is a leading question that pushes toward a specific answer. Ask neutral, open-ended questions instead.",
      isGood: false,
    },
    {
      question: "How do you currently remember to do things you want to make into habits?",
      feedback: "Excellent! This explores their current workflow and real behavior patterns.",
      isGood: true,
    },
    {
      question: "Would you pay $10/month for a premium habit tracking app?",
      feedback:
        "Asking about hypothetical future behavior. Instead, ask about what they currently spend money on for self-improvement.",
      isGood: false,
    },
  ])
  const [gameAnswers, setGameAnswers] = useState<boolean[]>([])
  const [showGameResults, setShowGameResults] = useState(false)

  const categories = [
    { id: "problem-discovery", label: "Problem Discovery", color: "bg-blue-100 text-blue-800" },
    { id: "current-solutions", label: "Current Solutions", color: "bg-green-100 text-green-800" },
    { id: "pain-points", label: "Pain Points", color: "bg-red-100 text-red-800" },
    { id: "workflow", label: "Workflow & Process", color: "bg-purple-100 text-purple-800" },
    { id: "decision-making", label: "Decision Making", color: "bg-orange-100 text-orange-800" },
    { id: "validation", label: "Solution Validation", color: "bg-yellow-100 text-yellow-800" },
  ]

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const section = params.get("section") || ""
    const task = params.get("task") || ""
    const options = params.get("options")

    setCurrentSection(section)
    setCurrentTask(task)

    if (options) {
      setSelectedOptions(options.split(","))
    }

    // Load saved data based on section and task
    if (section === "overview" && task === "research-goals") {
      const savedProblem = sessionStorage.getItem("researchProblemStatement")
      const savedAnalysis = sessionStorage.getItem("researchAnalysis")
      if (savedProblem) setProblemStatement(savedProblem)
      if (savedAnalysis) setAnalysis(savedAnalysis)
    } else if (section === "questions") {
      const savedQuestions = sessionStorage.getItem("researchQuestions")
      if (savedQuestions) {
        setQuestions(JSON.parse(savedQuestions))
      }
    }
  }, [])

  const handleAnalyzeProblem = async () => {
    if (!problemStatement.trim()) return

    // Check if user has enough tokens
    if (!hasEnoughTokens("RESEARCH_ANALYSIS")) {
      alert("Not enough tokens! You need 10 tokens for AI research analysis.")
      return
    }

    // Spend tokens for AI analysis
    if (!spendTokensForAI("RESEARCH_ANALYSIS")) {
      alert("Failed to process token payment. Please try again.")
      return
    }

    setIsAnalyzing(true)

    try {
      // Get startup info for context
      const startupInfo = JSON.parse(sessionStorage.getItem("startupInfo") || "{}")

      const response = await fetch("/api/analyze-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemStatement,
          startupInfo,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setAnalysis(data.analysis)

        // Save to session storage
        sessionStorage.setItem("researchProblemStatement", problemStatement)
        sessionStorage.setItem("researchAnalysis", data.analysis)
        sessionStorage.setItem("researchOverview", data.analysis)

        // Award tokens for completing research overview
        earnTokensForStep("RESEARCH_OVERVIEW_COMPLETE")
      } else {
        alert("Failed to analyze problem statement")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred while analyzing the problem")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const addQuestion = () => {
    if (!newQuestion.trim()) return

    const question = {
      id: Date.now().toString(),
      question: newQuestion.trim(),
      category: selectedCategory,
    }

    const updatedQuestions = [...questions, question]
    setQuestions(updatedQuestions)
    setNewQuestion("")

    // Save to session storage
    sessionStorage.setItem("researchQuestions", JSON.stringify(updatedQuestions))

    // Award tokens for saving first question
    if (updatedQuestions.length === 1) {
      earnTokensForStep("INTERVIEW_QUESTIONS_SAVED")
    }
  }

  const removeQuestion = (id: string) => {
    const updatedQuestions = questions.filter((q) => q.id !== id)
    setQuestions(updatedQuestions)
    sessionStorage.setItem("researchQuestions", JSON.stringify(updatedQuestions))
  }

  const evaluateQuestions = async () => {
    if (questions.length === 0) return

    // Check if user has enough tokens
    if (!hasEnoughTokens("QUESTION_EVALUATION")) {
      alert("Not enough tokens! You need 15 tokens for question evaluation.")
      return
    }

    // Spend tokens for evaluation
    if (!spendTokensForAI("QUESTION_EVALUATION")) {
      alert("Failed to process token payment. Please try again.")
      return
    }

    setIsEvaluating(true)

    try {
      const response = await fetch("/api/evaluate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions }),
      })

      if (response.ok) {
        const data = await response.json()
        setEvaluation(data.evaluation)

        // Award tokens for first question evaluation
        const hasEvaluatedBefore = sessionStorage.getItem("hasEvaluatedQuestions")
        if (!hasEvaluatedBefore) {
          earnTokensForStep("FIRST_QUESTION_EVALUATION")
          sessionStorage.setItem("hasEvaluatedQuestions", "true")
        }
      } else {
        alert("Failed to evaluate questions")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred while evaluating questions")
    } finally {
      setIsEvaluating(false)
    }
  }

  const handleGameAnswer = (isGood: boolean) => {
    const newAnswers = [...gameAnswers, isGood]
    setGameAnswers(newAnswers)

    if (newAnswers.length === gameQuestions.length) {
      // Calculate score
      const correctAnswers = newAnswers.reduce((sum, answer, index) => {
        return sum + (answer === gameQuestions[index].isGood ? 1 : 0)
      }, 0)
      const score = Math.round((correctAnswers / gameQuestions.length) * 100)
      setGameScore(score)
      setShowGameResults(true)

      // Award tokens for good score (70% or higher)
      if (score >= 70) {
        earnTokensForStep("MOM_TEST_GOOD_SCORE")
      }
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const resetGame = () => {
    setGameAnswers([])
    setCurrentQuestionIndex(0)
    setGameScore(null)
    setShowGameResults(false)
  }

  const renderOverviewTask = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Button onClick={() => window.history.back()} variant="outline" className="mb-4">
          ← Back to Research Detail
        </Button>
        <h1 className="text-3xl font-bold mb-2">Research Goals & Objectives</h1>
        <p className="text-gray-600">
          Define your problem statement and get AI-powered analysis to guide your research.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Problem Statement</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Describe the problem you're trying to solve. Be specific about who has this problem and why it matters..."
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              className="min-h-[200px] mb-4"
            />
            <Button
              onClick={handleAnalyzeProblem}
              disabled={!problemStatement.trim() || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Problem (10 tokens)"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            {analysis ? (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{analysis}</div>
              </div>
            ) : (
              <div className="text-gray-500 italic">
                Enter your problem statement and click "Analyze Problem" to get AI-powered insights and research
                guidance.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderQuestionsTask = () => {
    if (currentTask === "get-started") {
      return (
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-6">
            <Button onClick={() => window.history.back()} variant="outline" className="mb-4">
              ← Back to Research Detail
            </Button>
            <h1 className="text-3xl font-bold mb-2">Get Started with Better Questions</h1>
            <p className="text-gray-600">Learn the Mom Test methodology and practice with our interactive game.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>The Mom Test Principles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-600">✓ DO: Ask about past behavior</h4>
                    <p className="text-sm text-gray-600">"Tell me about the last time you..."</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-600">✓ DO: Focus on their life and problems</h4>
                    <p className="text-sm text-gray-600">"How do you currently handle..."</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600">✗ DON'T: Ask about future intentions</h4>
                    <p className="text-sm text-gray-600">"Would you use..." or "Would you buy..."</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600">✗ DON'T: Ask leading questions</h4>
                    <p className="text-sm text-gray-600">"Don't you think..." or "Isn't it annoying that..."</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mom Test Mini-Game</CardTitle>
              </CardHeader>
              <CardContent>
                {!showGameResults ? (
                  <div>
                    <p className="mb-4">
                      Test your skills! Identify whether each question follows Mom Test principles.
                    </p>
                    <div className="mb-4">
                      <div className="text-sm text-gray-500 mb-2">
                        Question {currentQuestionIndex + 1} of {gameQuestions.length}
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <p className="font-medium">{gameQuestions[currentQuestionIndex]?.question}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleGameAnswer(true)} variant="outline" className="flex-1">
                          Good Question ✓
                        </Button>
                        <Button onClick={() => handleGameAnswer(false)} variant="outline" className="flex-1">
                          Bad Question ✗
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold mb-2">{gameScore}%</div>
                      <div className={`text-lg ${gameScore >= 70 ? "text-green-600" : "text-orange-600"}`}>
                        {gameScore >= 70 ? "Great job! 🎉" : "Keep practicing! 💪"}
                      </div>
                      {gameScore >= 70 && (
                        <div className="text-sm text-green-600 mt-2">+20 tokens earned for good score!</div>
                      )}
                    </div>

                    <div className="space-y-3 mb-4">
                      {gameQuestions.map((q, index) => (
                        <div key={index} className="text-sm">
                          <div
                            className={`p-2 rounded ${gameAnswers[index] === q.isGood ? "bg-green-50" : "bg-red-50"}`}
                          >
                            <div className="font-medium mb-1">{q.question}</div>
                            <div className="text-gray-600">{q.feedback}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button onClick={resetGame} className="w-full">
                      Play Again
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <Button onClick={() => window.history.back()} variant="outline" className="mb-4">
            ← Back to Research Detail
          </Button>
          <h1 className="text-3xl font-bold mb-2">Interview Questions</h1>
          <p className="text-gray-600">Build and refine your interview questions with AI-powered feedback.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Question</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Question</label>
                    <Textarea
                      placeholder="Enter your interview question..."
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <Button onClick={addQuestion} className="w-full">
                    Add Question
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Questions ({questions.length})</CardTitle>
                {questions.length > 0 && (
                  <Button onClick={evaluateQuestions} disabled={isEvaluating} size="sm">
                    {isEvaluating ? "Evaluating..." : "Evaluate All (15 tokens)"}
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {questions.map((q) => {
                    const category = categories.find((cat) => cat.id === q.category)
                    return (
                      <div key={q.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <Badge className={category?.color}>{category?.label}</Badge>
                          <Button
                            onClick={() => removeQuestion(q.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </Button>
                        </div>
                        <p className="text-sm">{q.question}</p>
                      </div>
                    )
                  })}
                  {questions.length === 0 && (
                    <div className="text-gray-500 italic text-center py-8">
                      No questions added yet. Start by adding your first question above.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI Evaluation</CardTitle>
            </CardHeader>
            <CardContent>
              {evaluation ? (
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{evaluation}</div>
                </div>
              ) : (
                <div className="text-gray-500 italic">
                  Add some questions and click "Evaluate All" to get AI-powered feedback on your interview questions.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const renderTaskContent = () => {
    if (currentSection === "overview") {
      return renderOverviewTask()
    } else if (currentSection === "questions") {
      return renderQuestionsTask()
    }

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Button onClick={() => window.history.back()} variant="outline" className="mb-4">
            ← Back to Research Detail
          </Button>
          <h1 className="text-3xl font-bold mb-2">Task: {currentTask}</h1>
          <p className="text-gray-600">Section: {currentSection}</p>
        </div>

        <Alert>
          <AlertDescription>
            This task is coming soon! We're working on building out all the research tools.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {/* Top Bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "60px",
          backgroundColor: "white",
          borderBottom: "1px solid #ccc",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            marginRight: "15px",
          }}
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: sidebarOpen ? 0 : "-300px",
          width: "300px",
          height: "100vh",
          backgroundColor: "#f0f0f0",
          transition: "left 0.3s ease",
          zIndex: 999,
          padding: "20px",
        }}
      >
        <div style={{ marginTop: "0px", marginBottom: "30px" }}>
          <div style={{ display: "flex", gap: "20px", justifyContent: "right" }}>
            <button
              style={{
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
              }}
            >
              ⚙️
            </button>
            <button
              style={{
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
              }}
            >
              👤
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            onClick={() => (window.location.href = "/main")}
            style={{
              padding: "15px",
              fontSize: "16px",
              cursor: "pointer",
              border: "1px solid #ccc",
              backgroundColor: "white",
              width: "100%",
            }}
          >
            Map
          </button>
          <button
            onClick={() => (window.location.href = "/command-deck")}
            style={{
              padding: "15px",
              fontSize: "16px",
              cursor: "pointer",
              border: "1px solid #ccc",
              backgroundColor: "white",
              width: "100%",
            }}
          >
            Command Deck
          </button>
          <button
            style={{
              padding: "15px",
              fontSize: "16px",
              cursor: "pointer",
              border: "1px solid #ccc",
              backgroundColor: "white",
              width: "100%",
            }}
          >
            Health Analysis
          </button>
          <button
            style={{
              padding: "15px",
              fontSize: "16px",
              cursor: "pointer",
              border: "1px solid #ccc",
              backgroundColor: "white",
              width: "100%",
            }}
          >
            Forecast
          </button>
          <button
            style={{
              padding: "15px",
              fontSize: "16px",
              cursor: "pointer",
              border: "1px solid #ccc",
              backgroundColor: "white",
              width: "100%",
            }}
          >
            Reports
          </button>
          <button
            style={{
              padding: "15px",
              fontSize: "16px",
              cursor: "pointer",
              border: "1px solid #ccc",
              backgroundColor: "white",
              width: "100%",
            }}
          >
            Network
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginTop: "60px" }}>{renderTaskContent()}</div>

      {/* Overlay for sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 998,
          }}
        />
      )}
    </div>
  )
}
