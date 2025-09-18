"use client"

import { useState, useEffect } from "react"
import { earnTokensForStep } from "@/lib/token-integration"
import { BookOpen } from "lucide-react"

export default function ResearchTaskPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [currentSection, setCurrentSection] = useState<string>("")
  const [currentTask, setCurrentTask] = useState<string>("")
  const [savedAnalysis, setSavedAnalysis] = useState<string>("")
  const [showHistory, setShowHistory] = useState(false)
  const [analysisHistory, setAnalysisHistory] = useState<Array<{ timestamp: string; content: string }>>([])
  const [showEducationModal, setShowEducationModal] = useState(false)
  const [currentEducationPart, setCurrentEducationPart] = useState(1)

  const [showMomTestGame, setShowMomTestGame] = useState(false)
  const [gameQuestions, setGameQuestions] = useState<
    Array<{ question: string; correctAnswer: string; explanation: string; userAnswer?: string }>
  >([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameScore, setGameScore] = useState(0)
  const [gameScores, setGameScores] = useState<Array<{ date: string; score: number }>>([])
  const [showGameHistory, setShowGameHistory] = useState(false)

  // Add these state variables for the chatbot and questions functionality
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: "Hi! I can help you brainstorm and refine interview questions. Ask me anything!",
      sender: "assistant",
      timestamp: new Date().toLocaleTimeString(),
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [interviewQuestions, setInterviewQuestions] = useState([
    "What problem are you currently facing in [topic]?",
    "How have you tried to solve this problem?",
    "What would an ideal solution look like for you?",
  ])

  // State variables specific to the question-bank task
  const [questionBankChatMessages, setQuestionBankChatMessages] = useState([
    {
      id: 1,
      text: "Hi! I can help you brainstorm and refine interview questions. Ask me anything!",
      sender: "assistant",
      timestamp: new Date().toLocaleTimeString(),
    },
  ])
  const [questionBankChatInput, setQuestionBankChatInput] = useState("")
  const [questionBankIsTyping, setQuestionBankIsTyping] = useState(false)
  const [questionBankInterviewQuestions, setQuestionBankInterviewQuestions] = useState([
    "What problem are you currently facing in [topic]?",
    "How have you tried to solve this problem?",
    "What would an ideal solution look like for you?",
  ])

  // Add this state variable at the top with other useState declarations
  const [isMobile, setIsMobile] = useState(false)

  // Add evaluation state variables
  const [evaluationResults, setEvaluationResults] = useState<
    Array<{
      question: string
      isStrong: boolean
      reasoning: string
      responseType: string
      isGoodForEarlyStage: boolean
      improvement?: string
    }>
  >([])
  const [showEvaluation, setShowEvaluation] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)

  useEffect(() => {
    // Load saved analysis from session storage
    const saved = sessionStorage.getItem("researchOverview")
    if (saved) {
      setSavedAnalysis(saved)
    }

    // Load analysis history
    const history = sessionStorage.getItem("researchOverviewHistory")
    if (history) {
      setAnalysisHistory(JSON.parse(history))
    }
  }, [])

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
  }, [])

  // Add this useEffect after the existing useEffect hooks
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const momTestQuestions = [
    {
      question: "Would you use an app that tracks your spending habits?",
      correctAnswer: "❌ Bad Question",
      explanation: "Hypothetical + leading",
    },
    {
      question: "Tell me about the last time you tracked your spending.",
      correctAnswer: "✅ Good Question",
      explanation: "Behavioral, specific",
    },
    {
      question: "Do you think this is a good idea?",
      correctAnswer: "❌ Bad Question",
      explanation: "Opinion-based, invites politeness",
    },
    {
      question: "How do you usually handle budgeting each month?",
      correctAnswer: "✅ Good Question",
      explanation: "Real behavior, open-ended",
    },
    {
      question: "Would you pay $10 a month for this?",
      correctAnswer: "❌ Bad Question",
      explanation: "Hypothetical, price-focused too early",
    },
    {
      question: "What tools do you use for budgeting right now?",
      correctAnswer: "✅ Good Question",
      explanation: "Current solutions, real context",
    },
    {
      question: "My app makes budgeting easier — do you agree that's helpful?",
      correctAnswer: "❌ Bad Question",
      explanation: "Pitching + confirmation-seeking",
    },
    {
      question: "What's the hardest part about managing your money?",
      correctAnswer: "✅ Good Question",
      explanation: "Problem-focused, invites depth",
    },
    {
      question: "Do you think this would save you time?",
      correctAnswer: "❌ Bad Question",
      explanation: "Hypothetical, vague",
    },
    {
      question: "Have you tried anything in the past that didn't work?",
      correctAnswer: "✅ Good Question",
      explanation: "Past behavior + frustration signal",
    },
  ]

  const startMomTestGame = () => {
    // Shuffle questions randomly
    const shuffled = [...momTestQuestions].sort(() => Math.random() - 0.5)
    setGameQuestions(shuffled.map((q) => ({ ...q, userAnswer: undefined })))
    setCurrentQuestionIndex(0)
    setGameCompleted(false)
    setGameScore(0)
    setShowMomTestGame(true)
  }

  const answerQuestion = (answer: string) => {
    const updatedQuestions = [...gameQuestions]
    updatedQuestions[currentQuestionIndex].userAnswer = answer
    setGameQuestions(updatedQuestions)

    if (currentQuestionIndex < gameQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Calculate score and complete game
      const score = updatedQuestions.reduce((acc, q) => {
        return acc + (q.userAnswer === q.correctAnswer ? 1 : 0)
      }, 0)
      setGameScore(score)
      setGameCompleted(true)

      // Save score to session storage
      const currentScores = JSON.parse(sessionStorage.getItem("momTestScores") || "[]")
      const newScore = {
        date: new Date().toLocaleString(),
        score: score,
      }
      const updatedScores = [newScore, ...currentScores]
      sessionStorage.setItem("momTestScores", JSON.stringify(updatedScores))
      setGameScores(updatedScores)

      // Award tokens for good Mom Test score
      if (score >= 7) {
        earnTokensForStep("MOM_TEST_GOOD_SCORE")
      }
    }
  }

  useEffect(() => {
    // Load game scores from session storage
    const scores = sessionStorage.getItem("momTestScores")
    if (scores) {
      setGameScores(JSON.parse(scores))
    }
  }, [])

  const getTaskTitle = () => {
    if (currentSection === "overview" && currentTask === "research-goals") {
      return "Overview"
    }
    if (currentSection === "questions" && currentTask === "get-started") {
      return "Get Started with Interview Questions"
    }
    if (currentSection === "questions" && currentTask === "question-bank") {
      return "Question Bank & Templates"
    }
    return "Task Details"
  }

  const getTaskContent = () => {
    if (currentSection === "overview" && currentTask === "research-goals") {
      return (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {/* Show saved analysis if it exists */}
          {savedAnalysis && (
            <div
              style={{
                backgroundColor: "#2a2a2a",
                color: "#e0e0e0",
                padding: "40px",
                borderRadius: "8px",
                marginBottom: "30px",
              }}
            >
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}
              >
                <h3 style={{ fontSize: "24px", color: "#fff" }}>Current Research Overview</h3>
                <button
                  onClick={() => setShowHistory(true)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  History
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                {/* Parse and display saved sections as editable textareas */}
                {(() => {
                  const sections = [
                    { title: "Problem Statement", key: "Problem Statement:", id: "current-problem-statement" },
                    { title: "Target Audience", key: "Target Audience:", id: "current-target-audience" },
                    { title: "Context & Trigger", key: "Context & Trigger:", id: "current-context-trigger" },
                    { title: "Impact or Pain", key: "Impact or Pain:", id: "current-impact-pain" },
                    {
                      title: "Assumptions to Validate",
                      key: "Assumptions to Validate:",
                      id: "current-assumptions-validate",
                    },
                  ]

                  return sections
                    .map((section, index) => {
                      const startIndex = savedAnalysis.indexOf(section.key)
                      if (startIndex === -1) return null

                      const nextSectionIndex = sections
                        .slice(index + 1)
                        .find((nextSection) => savedAnalysis.indexOf(nextSection.key) > startIndex)
                      const endIndex = nextSectionIndex
                        ? savedAnalysis.indexOf(nextSectionIndex.key)
                        : savedAnalysis.length
                      const content = savedAnalysis.substring(startIndex + section.key.length, endIndex).trim()

                      return (
                        <div
                          key={section.title}
                          style={{
                            backgroundColor: "#1a1a1a",
                            padding: "20px",
                            borderRadius: "8px",
                            border: "1px solid #444",
                          }}
                        >
                          <h5
                            style={{
                              fontSize: "16px",
                              fontWeight: "bold",
                              color: "#fff",
                              marginBottom: "10px",
                              borderBottom: "1px solid #444",
                              paddingBottom: "8px",
                            }}
                          >
                            {section.title}
                          </h5>
                          <textarea
                            id={section.id}
                            defaultValue={content}
                            style={{
                              width: "100%",
                              minHeight: "80px",
                              padding: "12px",
                              backgroundColor: "#0a0a0a",
                              color: "#e0e0e0",
                              border: "1px solid #333",
                              borderRadius: "4px",
                              fontSize: "14px",
                              resize: "vertical",
                              lineHeight: "1.6",
                            }}
                          />
                        </div>
                      )
                    })
                    .filter(Boolean)
                })()}
              </div>

              <button
                onClick={() => {
                  // Collect edited content from current sections
                  const problemStatement =
                    (document.getElementById("current-problem-statement") as HTMLTextAreaElement)?.value || ""
                  const targetAudience =
                    (document.getElementById("current-target-audience") as HTMLTextAreaElement)?.value || ""
                  const contextTrigger =
                    (document.getElementById("current-context-trigger") as HTMLTextAreaElement)?.value || ""
                  const impactPain =
                    (document.getElementById("current-impact-pain") as HTMLTextAreaElement)?.value || ""
                  const assumptionsValidate =
                    (document.getElementById("current-assumptions-validate") as HTMLTextAreaElement)?.value || ""

                  // Combine all sections into final content
                  const finalContent = `Problem Statement: ${problemStatement}\n\nTarget Audience: ${targetAudience}\n\nContext & Trigger: ${contextTrigger}\n\nImpact or Pain: ${impactPain}\n\nAssumptions to Validate: ${assumptionsValidate}`

                  // Save to session storage
                  sessionStorage.setItem("researchOverview", finalContent)
                  setSavedAnalysis(finalContent)

                  // Mark overview as completed and unlock questions
                  const currentUnlocked = sessionStorage.getItem("researchUnlockedSteps") || "overview,questions"
                  const unlockedSteps = currentUnlocked.split(",")
                  if (!unlockedSteps.includes("questions")) {
                    unlockedSteps.push("questions")
                  }
                  sessionStorage.setItem("researchUnlockedSteps", unlockedSteps.join(","))

                  // Navigate back to detail view
                  const optionsParam = selectedOptions.join(",")
                  window.location.href = `/research/detail?step=overview&options=${optionsParam}`
                }}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "16px",
                  cursor: "pointer",
                  marginTop: "20px",
                }}
              >
                Save Changes
              </button>
            </div>
          )}

          {/* Regenerate section */}
          <div
            style={{
              backgroundColor: "#2a2a2a",
              color: "#e0e0e0",
              padding: "40px",
              borderRadius: "8px",
              marginBottom: "30px",
            }}
          >
            <h3 style={{ fontSize: "24px", marginBottom: "20px", color: "#fff" }}>
              {savedAnalysis ? "Regenerate Analysis" : "What problem is your idea solving?"}
            </h3>
            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
                Describe who has this problem, when and where it happens, and why it's important.
              </label>
              <textarea
                id="problem-input"
                style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "15px",
                  backgroundColor: "#1a1a1a",
                  color: "#e0e0e0",
                  border: "1px solid #444",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
                placeholder="Describe the problem you believe exists..."
              />
            </div>

            <button
              onClick={async () => {
                const input = document.getElementById("problem-input") as HTMLTextAreaElement
                const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement
                const responseArea = document.getElementById("response-area") as HTMLDivElement

                if (!input.value.trim()) return

                submitBtn.disabled = true
                submitBtn.textContent = "Analyzing..."

                try {
                  const response = await fetch("/api/analyze-problem", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ problemDescription: input.value }),
                  })

                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                  }

                  const data = await response.json()
                  responseArea.style.display = "block"

                  // The AI response should be a structured analysis with sections
                  const analysis = data.analysis || "Error generating analysis"

                  // Function to extract content between headings
                  const extractSection = (text: string, heading: string) => {
                    const regex = new RegExp(
                      `\\*\\*${heading}[^:]*:\\*\\*\\s*([\\s\\S]*?)(?=\\*\\*[^:]*:\\*\\*|$)`,
                      "i",
                    )
                    const match = text.match(regex)
                    return match ? match[1].trim() : ""
                  }

                  // Populate each section with AI-generated content
                  const problemStatement = document.getElementById("problem-statement") as HTMLTextAreaElement
                  const targetAudience = document.getElementById("target-audience") as HTMLTextAreaElement
                  const contextTrigger = document.getElementById("context-trigger") as HTMLTextAreaElement
                  const impactPain = document.getElementById("impact-pain") as HTMLTextAreaElement
                  const assumptionsValidate = document.getElementById("assumptions-validate") as HTMLTextAreaElement

                  problemStatement.value = extractSection(analysis, "Problem Statement")
                  targetAudience.value = extractSection(analysis, "Target Audience")
                  contextTrigger.value = extractSection(analysis, "Context & Trigger")
                  impactPain.value = extractSection(analysis, "Impact or Pain")
                  assumptionsValidate.value = extractSection(analysis, "Assumptions to Validate")
                } catch (error) {
                  console.error("Error:", error)
                  responseArea.style.display = "block"

                  // Show error message in the response area
                  const errorDiv = document.createElement("div")
                  errorDiv.style.cssText =
                    "color: #dc3545; padding: 20px; text-align: center; background-color: #1a1a1a; border-radius: 4px;"
                  errorDiv.textContent = "Failed to analyze problem. Please try again."
                  responseArea.innerHTML = ""
                  responseArea.appendChild(errorDiv)
                } finally {
                  submitBtn.disabled = false
                  submitBtn.textContent = savedAnalysis ? "Regenerate" : "Submit"
                }
              }}
              id="submit-btn"
              style={{
                padding: "12px 24px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              {savedAnalysis ? "Regenerate" : "Submit"}
            </button>

            <div id="response-area" style={{ display: "none", marginTop: "30px" }}>
              <h4 style={{ fontSize: "18px", marginBottom: "20px", color: "#ccc" }}>AI Analysis & Suggestions</h4>

              <div id="structured-response" style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                {/* Problem Statement Section */}
                <div
                  style={{
                    backgroundColor: "#1a1a1a",
                    padding: "20px",
                    borderRadius: "8px",
                    border: "1px solid #444",
                  }}
                >
                  <h5
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#fff",
                      marginBottom: "10px",
                      borderBottom: "1px solid #444",
                      paddingBottom: "8px",
                    }}
                  >
                    Problem Statement
                  </h5>
                  <textarea
                    id="problem-statement"
                    style={{
                      width: "100%",
                      minHeight: "60px",
                      padding: "12px",
                      backgroundColor: "#0a0a0a",
                      color: "#e0e0e0",
                      border: "1px solid #333",
                      borderRadius: "4px",
                      fontSize: "14px",
                      resize: "vertical",
                    }}
                    placeholder="Problem statement will appear here..."
                  />
                </div>

                {/* Target Audience Section */}
                <div
                  style={{
                    backgroundColor: "#1a1a1a",
                    padding: "20px",
                    borderRadius: "8px",
                    border: "1px solid #444",
                  }}
                >
                  <h5
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#fff",
                      marginBottom: "10px",
                      borderBottom: "1px solid #444",
                      paddingBottom: "8px",
                    }}
                  >
                    Target Audience
                  </h5>
                  <textarea
                    id="target-audience"
                    style={{
                      width: "100%",
                      minHeight: "80px",
                      padding: "12px",
                      backgroundColor: "#0a0a0a",
                      color: "#e0e0e0",
                      border: "1px solid #333",
                      borderRadius: "4px",
                      fontSize: "14px",
                      resize: "vertical",
                    }}
                    placeholder="Target audience details will appear here..."
                  />
                </div>

                {/* Context & Trigger Section */}
                <div
                  style={{
                    backgroundColor: "#1a1a1a",
                    padding: "20px",
                    borderRadius: "8px",
                    border: "1px solid #444",
                  }}
                >
                  <h5
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#fff",
                      marginBottom: "10px",
                      borderBottom: "1px solid #444",
                      paddingBottom: "8px",
                    }}
                  >
                    Context & Trigger
                  </h5>
                  <textarea
                    id="context-trigger"
                    style={{
                      width: "100%",
                      minHeight: "80px",
                      padding: "12px",
                      backgroundColor: "#0a0a0a",
                      color: "#e0e0e0",
                      border: "1px solid #333",
                      borderRadius: "4px",
                      fontSize: "14px",
                      resize: "vertical",
                    }}
                    placeholder="Context and trigger information will appear here..."
                  />
                </div>

                {/* Impact or Pain Section */}
                <div
                  style={{
                    backgroundColor: "#1a1a1a",
                    padding: "20px",
                    borderRadius: "8px",
                    border: "1px solid #444",
                  }}
                >
                  <h5
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#fff",
                      marginBottom: "10px",
                      borderBottom: "1px solid #444",
                      paddingBottom: "8px",
                    }}
                  >
                    Impact or Pain
                  </h5>
                  <textarea
                    id="impact-pain"
                    style={{
                      width: "100%",
                      minHeight: "100px",
                      padding: "12px",
                      backgroundColor: "#0a0a0a",
                      color: "#e0e0e0",
                      border: "1px solid #333",
                      borderRadius: "4px",
                      fontSize: "14px",
                      resize: "vertical",
                    }}
                    placeholder="Impact and pain points will appear here..."
                  />
                </div>

                {/* Assumptions to Validate Section */}
                <div
                  style={{
                    backgroundColor: "#1a1a1a",
                    padding: "20px",
                    borderRadius: "8px",
                    border: "1px solid #444",
                  }}
                >
                  <h5
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#fff",
                      marginBottom: "10px",
                      borderBottom: "1px solid #444",
                      paddingBottom: "8px",
                    }}
                  >
                    Assumptions to Validate
                  </h5>
                  <textarea
                    id="assumptions-validate"
                    style={{
                      width: "100%",
                      minHeight: "120px",
                      padding: "12px",
                      backgroundColor: "#0a0a0a",
                      color: "#e0e0e0",
                      border: "1px solid #333",
                      borderRadius: "4px",
                      fontSize: "14px",
                      resize: "vertical",
                    }}
                    placeholder="Key assumptions to validate will appear here..."
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  // Collect all section content
                  const problemStatement = (document.getElementById("problem-statement") as HTMLTextAreaElement).value
                  const targetAudience = (document.getElementById("target-audience") as HTMLTextAreaElement).value
                  const contextTrigger = (document.getElementById("context-trigger") as HTMLTextAreaElement).value
                  const impactPain = (document.getElementById("impact-pain") as HTMLTextAreaElement).value
                  const assumptionsValidate = (document.getElementById("assumptions-validate") as HTMLTextAreaElement)
                    .value

                  // Combine all sections into final content
                  const finalContent = `Problem Statement: ${problemStatement}\n\nTarget Audience: ${targetAudience}\n\nContext & Trigger: ${contextTrigger}\n\nImpact or Pain: ${impactPain}\n\nAssumptions to Validate: ${assumptionsValidate}`

                  // Save current version to history if it exists
                  if (savedAnalysis) {
                    const currentHistory = JSON.parse(sessionStorage.getItem("researchOverviewHistory") || "[]")
                    const newHistoryEntry = {
                      timestamp: new Date().toLocaleString(),
                      content: savedAnalysis,
                    }
                    const updatedHistory = [newHistoryEntry, ...currentHistory]
                    sessionStorage.setItem("researchOverviewHistory", JSON.stringify(updatedHistory))
                    setAnalysisHistory(updatedHistory)
                  }

                  // Save to session storage
                  sessionStorage.setItem("researchOverview", finalContent)
                  setSavedAnalysis(finalContent)

                  // Mark overview as completed and unlock questions
                  const currentUnlocked = sessionStorage.getItem("researchUnlockedSteps") || "overview,questions"
                  const unlockedSteps = currentUnlocked.split(",")
                  if (!unlockedSteps.includes("questions")) {
                    unlockedSteps.push("questions")
                  }
                  sessionStorage.setItem("researchUnlockedSteps", unlockedSteps.join(","))

                  // Navigate back to detail view
                  const optionsParam = selectedOptions.join(",")
                  window.location.href = `/research/detail?step=overview&options=${optionsParam}`

                  // Award tokens for completing research overview
                  earnTokensForStep("RESEARCH_OVERVIEW_COMPLETE")
                }}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "16px",
                  cursor: "pointer",
                  marginTop: "20px",
                }}
              >
                Save Overview
              </button>
            </div>
          </div>
        </div>
      )
    }

    if (currentSection === "questions" && currentTask === "get-started") {
      return (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div
            style={{
              backgroundColor: "#2a2a2a",
              color: "#e0e0e0",
              padding: "40px",
              borderRadius: "8px",
              marginBottom: "30px",
            }}
          >
            <h3 style={{ fontSize: "24px", marginBottom: "20px", color: "#fff" }}>
              How to Write Great Interview Questions
            </h3>
            <p style={{ marginBottom: "30px", lineHeight: "1.6" }}>
              Want honest insights? It starts with asking the right questions - here’s how.
            </p>

            <div style={{ display: "flex", gap: "15px", marginBottom: "40px" }}>
              <button
                onClick={() => setShowEducationModal(true)}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <BookOpen size={18} />
                How to Write Great Questions
              </button>
            </div>

            {/* MomTest Game Section */}
            <div
              style={{
                backgroundColor: "#1a1a1a",
                padding: "30px",
                borderRadius: "8px",
                border: "1px solid #444",
              }}
            >
              <h4 style={{ fontSize: "20px", marginBottom: "15px", color: "#fff" }}>Put Your Skills to the Test</h4>
              <p style={{ marginBottom: "25px", lineHeight: "1.6", color: "#ccc" }}>
                Play the MomTest Game to practice identifying good and bad interview questions. The game is based on Rob
                Fitzpatrick's book "Mom Test", and it currently uses default questions.
              </p>

              <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                <button
                  onClick={startMomTestGame}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  Start MomTest Game
                </button>

                {gameScores.length > 0 && (
                  <button
                    onClick={() => setShowGameHistory(true)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    View Past Scores
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (currentSection === "questions" && currentTask === "question-bank") {
      const sendMessage = async () => {
        if (!questionBankChatInput.trim()) return

        const userMessage = {
          id: questionBankChatMessages.length + 1,
          text: questionBankChatInput,
          sender: "user",
          timestamp: new Date().toLocaleTimeString(),
        }

        setQuestionBankChatMessages((prev) => [...prev, userMessage])
        setQuestionBankChatInput("")
        setQuestionBankIsTyping(true)

        try {
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: [
                {
                  role: "system",
                  content:
                    "You are an AI assistant specialized in helping create effective customer interview questions. Focus on behavioral questions, avoid hypotheticals, and help users create questions that reveal real user problems and behaviors. Keep responses concise and actionable.",
                },
                ...questionBankChatMessages.map((msg) => ({
                  role: msg.sender === "user" ? "user" : "assistant",
                  content: msg.text,
                })),
                {
                  role: "user",
                  content: questionBankChatInput,
                },
              ],
            }),
          })

          if (!response.ok) {
            throw new Error("Failed to get AI response")
          }

          const data = await response.json()

          const assistantMessage = {
            id: questionBankChatMessages.length + 2,
            text: data.message || "I'm here to help you create better interview questions!",
            sender: "assistant",
            timestamp: new Date().toLocaleTimeString(),
          }

          setQuestionBankChatMessages((prev) => [...prev, assistantMessage])
        } catch (error) {
          console.error("Error getting AI response:", error)
          const errorMessage = {
            id: questionBankChatMessages.length + 2,
            text: "Sorry, I'm having trouble connecting right now. Please try again!",
            sender: "assistant",
            timestamp: new Date().toLocaleTimeString(),
          }
          setQuestionBankChatMessages((prev) => [...prev, errorMessage])
        } finally {
          setQuestionBankIsTyping(false)
        }
      }

      const addNewQuestion = () => {
        setQuestionBankInterviewQuestions((prev) => [...prev, ""])
      }

      const updateQuestion = (index: number, value: string) => {
        setQuestionBankInterviewQuestions((prev) => prev.map((q, i) => (i === index ? value : q)))
      }

      const deleteQuestion = (index: number) => {
        setQuestionBankInterviewQuestions((prev) => prev.filter((_, i) => i !== index))
      }

      const evaluateQuestions = async () => {
        const questions = questionBankInterviewQuestions.filter((q) => q.trim() !== "")
        if (questions.length === 0) {
          alert("No questions to evaluate. Please add some questions first.")
          return
        }

        setIsEvaluating(true)

        try {
          const response = await fetch("/api/evaluate-questions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questions }),
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()
          setEvaluationResults(data.evaluations || [])
          setShowEvaluation(true)

          // Award tokens for first question evaluation (only once)
          earnTokensForStep("FIRST_QUESTION_EVALUATION")
        } catch (error) {
          console.error("Error evaluating questions:", error)
          alert("Error evaluating questions. Please try again.")
        } finally {
          setIsEvaluating(false)
        }
      }

      return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Two-column layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "30px",
            }}
          >
            {/* Left Column - AI-stronaut Assistant */}
            <div style={{ minWidth: "300px" }}>
              <div
                style={{
                  backgroundColor: "#2a2a2a",
                  borderRadius: "8px",
                  overflow: "hidden",
                  height: "600px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Chat Header */}
                <div
                  style={{
                    padding: "20px",
                    borderBottom: "1px solid #444",
                    backgroundColor: "#1a1a1a",
                  }}
                >
                  <h3 style={{ fontSize: "18px", color: "#fff", margin: 0 }}>AI-stronaut Assistant</h3>
                </div>

                {/* Messages Area */}
                <div
                  style={{
                    flex: 1,
                    padding: "20px",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                  }}
                >
                  {questionBankChatMessages.map((message) => (
                    <div
                      key={message.id}
                      style={{
                        alignSelf: message.sender === "user" ? "flex-end" : "flex-start",
                        maxWidth: "80%",
                      }}
                    >
                      <div
                        style={{
                          padding: "12px 16px",
                          borderRadius: "12px",
                          backgroundColor: message.sender === "user" ? "#007bff" : "#1a1a1a",
                          color: "#fff",
                          fontSize: "14px",
                          lineHeight: "1.4",
                        }}
                      >
                        {message.text}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#888",
                          marginTop: "4px",
                          textAlign: message.sender === "user" ? "right" : "left",
                        }}
                      >
                        {message.timestamp}
                      </div>
                    </div>
                  ))}

                  {questionBankIsTyping && (
                    <div style={{ alignSelf: "flex-start", maxWidth: "80%" }}>
                      <div
                        style={{
                          padding: "12px 16px",
                          borderRadius: "12px",
                          backgroundColor: "#1a1a1a",
                          color: "#888",
                          fontSize: "14px",
                        }}
                      >
                        AI-stronaut is typing...
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div
                  style={{
                    padding: "20px",
                    borderTop: "1px solid #444",
                    backgroundColor: "#1a1a1a",
                  }}
                >
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="text"
                      value={questionBankChatInput}
                      onChange={(e) => setQuestionBankChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Ask for interview question suggestions..."
                      style={{
                        flex: 1,
                        padding: "12px",
                        backgroundColor: "#2a2a2a",
                        border: "1px solid #444",
                        borderRadius: "6px",
                        color: "#fff",
                        fontSize: "14px",
                      }}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!questionBankChatInput.trim()}
                      style={{
                        padding: "12px 16px",
                        backgroundColor: questionBankChatInput.trim() ? "#007bff" : "#444",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: questionBankChatInput.trim() ? "pointer" : "not-allowed",
                        fontSize: "14px",
                      }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Interview Questions Canvas */}
            <div style={{ minWidth: "300px" }}>
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  overflow: "hidden",
                  minHeight: "600px",
                  border: "1px solid #ddd",
                }}
              >
                {/* Canvas Header */}
                <div
                  style={{
                    padding: "20px",
                    borderBottom: "1px solid #ddd",
                    backgroundColor: "#f8f9fa",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h3 style={{ fontSize: "18px", color: "#333", margin: 0 }}>Interview Questions Canvas</h3>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => {
                        // Create PDF content with interview questions
                        const questions = questionBankInterviewQuestions.filter((q) => q.trim() !== "")
                        if (questions.length === 0) {
                          alert("No questions to export. Please add some questions first.")
                          return
                        }

                        // Create a simple text content for PDF
                        const pdfContent = `Interview Questions Canvas\n\nGenerated on: ${new Date().toLocaleDateString()}\n\n${questions.map((q, i) => `${i + 1}. ${q}`).join("\n\n")}`

                        // Create a blob and download
                        const blob = new Blob([pdfContent], { type: "text/plain" })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href = url
                        a.download = `interview-questions-${new Date().toISOString().split("T")[0]}.txt`
                        document.body.appendChild(a)
                        a.click()
                        document.body.removeChild(a)
                        URL.revokeObjectURL(url)
                      }}
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "#6c757d",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      Download PDF
                    </button>
                  </div>
                </div>

                {/* Canvas Content */}
                <div style={{ padding: "30px" }}>
                  <h2 style={{ fontSize: "24px", color: "#333", marginBottom: "30px" }}>Interview Questions</h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {questionBankInterviewQuestions.map((question, index) => (
                      <div key={index} style={{ display: "flex", alignItems: "flex-start", gap: "15px" }}>
                        <span style={{ color: "#333", fontSize: "16px", marginTop: "12px" }}>•</span>
                        <div style={{ flex: 1 }}>
                          <textarea
                            value={question}
                            onChange={(e) => updateQuestion(index, e.target.value)}
                            style={{
                              width: "100%",
                              minHeight: "50px",
                              padding: "12px",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              fontSize: "14px",
                              color: "#333",
                              resize: "vertical",
                              fontFamily: "inherit",
                            }}
                            placeholder="Enter your interview question..."
                          />
                        </div>
                        <button
                          onClick={() => deleteQuestion(index)}
                          style={{
                            padding: "8px",
                            backgroundColor: "#dc3545",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                            marginTop: "8px",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={addNewQuestion}
                    style={{
                      marginTop: "20px",
                      padding: "12px 20px",
                      backgroundColor: "#28a745",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    + Add Question
                  </button>
                </div>

                {/* Canvas Footer */}
                <div
                  style={{
                    padding: "20px",
                    borderTop: "1px solid #ddd",
                    backgroundColor: "#f8f9fa",
                    display: "flex",
                    gap: "15px",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={evaluateQuestions}
                    disabled={isEvaluating}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: isEvaluating ? "#444" : "#6c757d",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "14px",
                      cursor: isEvaluating ? "not-allowed" : "pointer",
                    }}
                  >
                    {isEvaluating ? "Evaluating..." : "Evaluate"}
                  </button>
                </div>

                {/* Evaluation Results Section */}
                {showEvaluation && evaluationResults.length > 0 && (
                  <div
                    style={{
                      padding: "20px",
                      backgroundColor: "#f8f9fa",
                      borderTop: "1px solid #ddd",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                      }}
                    >
                      <h4 style={{ fontSize: "16px", color: "#333", margin: 0 }}>Question Evaluation Results</h4>
                      <button
                        onClick={() => setShowEvaluation(false)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#6c757d",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        Hide Evaluation
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      {evaluationResults.map((result, index) => (
                        <div
                          key={index}
                          style={{
                            backgroundColor: "#fff",
                            padding: "20px",
                            borderRadius: "6px",
                            border: `2px solid ${result.isStrong ? "#28a745" : "#ffc107"}`,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          }}
                        >
                          <div style={{ marginBottom: "15px" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "18px",
                                  color: result.isStrong ? "#28a745" : "#ffc107",
                                }}
                              >
                                {result.isStrong ? "✅" : "⚠️"}
                              </span>
                              <strong style={{ fontSize: "14px", color: "#333" }}>
                                Question {index + 1}: {result.isStrong ? "Strong" : "Needs Improvement"}
                              </strong>
                            </div>
                            <div
                              style={{
                                fontSize: "14px",
                                color: "#666",
                                fontStyle: "italic",
                                backgroundColor: "#f8f9fa",
                                padding: "10px",
                                borderRadius: "4px",
                                marginBottom: "15px",
                              }}
                            >
                              "{result.question}"
                            </div>
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <div>
                              <strong style={{ fontSize: "13px", color: "#333" }}>Analysis:</strong>
                              <p style={{ fontSize: "13px", color: "#666", margin: "5px 0", lineHeight: "1.4" }}>
                                {result.reasoning}
                              </p>
                            </div>

                            <div>
                              <strong style={{ fontSize: "13px", color: "#333" }}>Response Type:</strong>
                              <p style={{ fontSize: "13px", color: "#666", margin: "5px 0", lineHeight: "1.4" }}>
                                {result.responseType}
                              </p>
                            </div>

                            <div>
                              <strong style={{ fontSize: "13px", color: "#333" }}>Early-Stage Suitability:</strong>
                              <p
                                style={{
                                  fontSize: "13px",
                                  color: result.isGoodForEarlyStage ? "#28a745" : "#dc3545",
                                  margin: "5px 0",
                                  lineHeight: "1.4",
                                  fontWeight: "500",
                                }}
                              >
                                {result.isGoodForEarlyStage
                                  ? "✅ Good for early-stage interviews"
                                  : "❌ Not ideal for early-stage interviews"}
                              </p>
                            </div>

                            {result.improvement && (
                              <div
                                style={{
                                  backgroundColor: "#e3f2fd",
                                  padding: "12px",
                                  borderRadius: "4px",
                                  borderLeft: "4px solid #2196f3",
                                }}
                              >
                                <strong style={{ fontSize: "13px", color: "#1976d2" }}>
                                  💡 Improvement Suggestion:
                                </strong>
                                <p style={{ fontSize: "13px", color: "#1565c0", margin: "5px 0", lineHeight: "1.4" }}>
                                  {result.improvement}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <button
              onClick={() => {
                // Save questions to session storage
                sessionStorage.setItem("interviewQuestions", JSON.stringify(questionBankInterviewQuestions))
                alert("Interview questions saved!")

                // Award tokens for saving interview questions
                earnTokensForStep("INTERVIEW_QUESTIONS_SAVED")
              }}
              style={{
                padding: "12px 24px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Save Questions
            </button>
          </div>
        </div>
      )
    }

    return <div>Task content not found</div>
  }

  return (
    <div style={{ minHeight: "100vh", position: "relative", backgroundColor: "#1a1a1a" }}>
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
        {/* Sidebar Toggle */}
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

        {/* Back Arrow */}
        <button
          onClick={() => {
            const optionsParam = selectedOptions.join(",")
            window.location.href = `/research/detail?step=${currentSection}&options=${optionsParam}`
          }}
          style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          ←
        </button>

        {/* Task Title */}
        <h2 style={{ marginLeft: "20px", fontSize: "18px", color: "#333" }}>{getTaskTitle()}</h2>
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
        {/* Top section - Settings and Profile icons */}
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

        {/* Six vertically stacked buttons */}
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
            Health Check
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
      <div
        style={{
          marginTop: "60px",
          padding: "40px 20px",
          color: "#e0e0e0",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            color: "#666",
            fontWeight: "bold",
            marginBottom: "40px",
            textAlign: "center",
            letterSpacing: "0.1em",
          }}
        >
          {getTaskTitle().toUpperCase()}
        </h1>

        {getTaskContent()}
      </div>

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

      {/* History Modal */}
      {showHistory && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
          onClick={() => setShowHistory(false)}
        >
          <div
            style={{
              backgroundColor: "#2a2a2a",
              color: "#e0e0e0",
              padding: "40px",
              borderRadius: "8px",
              maxWidth: "800px",
              maxHeight: "80vh",
              overflowY: "auto",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}
            >
              <h3 style={{ fontSize: "24px", color: "#fff", margin: 0 }}>Analysis History</h3>
              <button
                onClick={() => setShowHistory(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  color: "#ccc",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            {analysisHistory.length === 0 ? (
              <p style={{ color: "#ccc", textAlign: "center", padding: "40px" }}>
                No previous versions found. Generate your first analysis to start building history.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                {analysisHistory.map((entry, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#1a1a1a",
                      padding: "25px",
                      borderRadius: "8px",
                      border: "1px solid #444",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "15px",
                        borderBottom: "1px solid #444",
                        paddingBottom: "10px",
                      }}
                    >
                      <h4 style={{ fontSize: "16px", color: "#fff", margin: 0 }}>
                        Version {analysisHistory.length - index}
                      </h4>
                      <span style={{ fontSize: "14px", color: "#888" }}>{entry.timestamp}</span>
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.6",
                        color: "#e0e0e0",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {entry.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Education Modal */}
      {showEducationModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
          onClick={() => setShowEducationModal(false)}
        >
          <div
            style={{
              backgroundColor: "#2a2a2a",
              color: "#e0e0e0",
              padding: "60px",
              borderRadius: "8px",
              maxWidth: "900px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowEducationModal(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "none",
                border: "none",
                fontSize: "32px", // increased from 24px to 32px to make X button bigger
                color: "#ccc",
                cursor: "pointer",
              }}
            >
              ×
            </button>

            {/* Title and Subtitle - Always Visible */}
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <h2 style={{ fontSize: "32px", color: "#fff", marginBottom: "15px", fontWeight: "bold" }}>
                How to Write Great Interview Questions
              </h2>
              <p style={{ fontSize: "18px", color: "#ccc", lineHeight: "1.6" }}>
                Want honest insights? It starts with asking the right questions — here's how.
              </p>
            </div>

            {/* Navigation */}
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}
            >
              <button
                onClick={() => setCurrentEducationPart(Math.max(1, currentEducationPart - 1))}
                disabled={currentEducationPart === 1}
                style={{
                  padding: "10px 20px",
                  backgroundColor: currentEducationPart === 1 ? "#444" : "#007bff",
                  color: currentEducationPart === 1 ? "#888" : "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "16px",
                  cursor: currentEducationPart === 1 ? "not-allowed" : "pointer",
                }}
              >
                ← Previous
              </button>

              <div style={{ display: "flex", gap: "10px" }}>
                {[1, 2, 3].map((part) => (
                  <button
                    key={part}
                    onClick={() => setCurrentEducationPart(part)}
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      border: "none",
                      backgroundColor: currentEducationPart === part ? "#007bff" : "#666",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  if (currentEducationPart === 3) {
                    setShowEducationModal(false)
                  } else {
                    setCurrentEducationPart(Math.min(3, currentEducationPart + 1))
                  }
                }}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#007bff", // removed disabled state since Exit button should always be clickable
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                {currentEducationPart === 3 ? "Exit" : "Next →"}
              </button>
            </div>

            {/* Content Parts */}
            <div style={{ minHeight: "300px", fontSize: "16px", lineHeight: "1.8" }}>
              {currentEducationPart === 1 && (
                <div>
                  <h3 style={{ fontSize: "24px", color: "#fff", marginBottom: "30px" }}>📘 Part 1</h3>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: "20px", display: "flex", alignItems: "flex-start" }}>
                      <span style={{ color: "#007bff", marginRight: "10px", fontSize: "18px" }}>•</span>
                      <span>Focus on learning, not confirming what you hope is true.</span>
                    </li>
                    <li style={{ marginBottom: "20px", display: "flex", alignItems: "flex-start" }}>
                      <span style={{ color: "#007bff", marginRight: "10px", fontSize: "18px" }}>•</span>
                      <span>Ask about past behavior, not opinions or guesses about the future.</span>
                    </li>
                    <li style={{ marginBottom: "20px", display: "flex", alignItems: "flex-start" }}>
                      <span style={{ color: "#007bff", marginRight: "10px", fontSize: "18px" }}>•</span>
                      <span>Avoid yes/no questions – aim for open-ended ones.</span>
                    </li>
                  </ul>
                </div>
              )}

              {currentEducationPart === 2 && (
                <div>
                  <h3 style={{ fontSize: "24px", color: "#fff", marginBottom: "30px" }}>📘 Part 2</h3>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: "20px", display: "flex", alignItems: "flex-start" }}>
                      <span style={{ color: "#007bff", marginRight: "10px", fontSize: "18px" }}>•</span>
                      <span>Don't pitch your idea – you're here to listen, not sell.</span>
                    </li>
                    <li style={{ marginBottom: "20px", display: "flex", alignItems: "flex-start" }}>
                      <span style={{ color: "#007bff", marginRight: "10px", fontSize: "18px" }}>•</span>
                      <span>Steer clear of leading questions (e.g. "Would you use this?").</span>
                    </li>
                    <li style={{ marginBottom: "20px", display: "flex", alignItems: "flex-start" }}>
                      <span style={{ color: "#007bff", marginRight: "10px", fontSize: "18px" }}>•</span>
                      <span>Don't ask hypotheticals (e.g. "Would you pay for it?").</span>
                    </li>
                  </ul>
                </div>
              )}

              {currentEducationPart === 3 && (
                <div>
                  <h3 style={{ fontSize: "24px", color: "#fff", marginBottom: "30px" }}>📘 Part 3</h3>
                  <div style={{ marginBottom: "30px" }}>
                    <p style={{ marginBottom: "20px", fontWeight: "bold" }}>Great questions sound like:</p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: "30px" }}>
                      <li style={{ marginBottom: "15px", display: "flex", alignItems: "flex-start" }}>
                        <span style={{ color: "#007bff", marginRight: "10px", fontSize: "18px" }}>–</span>
                        <span>"Tell me about the last time you…"</span>
                      </li>
                      <li style={{ marginBottom: "15px", display: "flex", alignItems: "flex-start" }}>
                        <span style={{ color: "#007bff", marginRight: "10px", fontSize: "18px" }}>–</span>
                        <span>"How do you currently handle…"</span>
                      </li>
                      <li style={{ marginBottom: "15px", display: "flex", alignItems: "flex-start" }}>
                        <span style={{ color: "#007bff", marginRight: "10px", fontSize: "18px" }}>–</span>
                        <span>"What's the hardest part about…"</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p style={{ marginBottom: "15px" }}>Let them talk – silence is powerful.</p>
                    <p style={{ marginBottom: "15px" }}>
                      If something's unclear, ask: "Why?" or "Can you tell me more?"
                    </p>
                    <p style={{ marginBottom: "15px" }}>
                      Always take notes or ask to record the conversation (with permission).
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Part indicator */}
            <div style={{ textAlign: "center", marginTop: "30px", color: "#888", fontSize: "14px" }}>
              Part {currentEducationPart} of 3
            </div>
          </div>
        </div>
      )}

      {/* MomTest Game Modal */}
      {showMomTestGame && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
          onClick={() => setShowMomTestGame(false)}
        >
          <div
            style={{
              backgroundColor: "#2a2a2a",
              color: "#e0e0e0",
              padding: "60px",
              borderRadius: "8px",
              maxWidth: "800px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowMomTestGame(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "none",
                border: "none",
                fontSize: "24px",
                color: "#ccc",
                cursor: "pointer",
              }}
            >
              ×
            </button>

            {/* History Header */}
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <h2 style={{ fontSize: "28px", color: "#fff", marginBottom: "10px" }}>MomTest Game</h2>
              <p style={{ fontSize: "16px", color: "#ccc" }}>
                Test your skills in identifying good and bad interview questions.
              </p>
            </div>

            {!gameCompleted ? (
              <div>
                <h3 style={{ fontSize: "24px", color: "#fff", marginBottom: "20px" }}>
                  Question {currentQuestionIndex + 1} of {gameQuestions.length}
                </h3>
                <p style={{ fontSize: "18px", color: "#ccc", marginBottom: "30px" }}>
                  {gameQuestions[currentQuestionIndex]?.question}
                </p>

                <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
                  <button
                    onClick={() => answerQuestion("✅ Good Question")}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    ✅ Good Question
                  </button>
                  <button
                    onClick={() => answerQuestion("❌ Bad Question")}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    ❌ Bad Question
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: "28px", color: "#fff", marginBottom: "20px", textAlign: "center" }}>
                  Game Over!
                </h3>
                <p style={{ fontSize: "20px", color: "#ccc", marginBottom: "30px", textAlign: "center" }}>
                  Your Score: {gameScore} / {gameQuestions.length}
                </p>

                <div style={{ marginBottom: "30px" }}>
                  <h4 style={{ fontSize: "20px", color: "#fff", marginBottom: "15px" }}>Review:</h4>
                  {gameQuestions.map((q, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "#1a1a1a",
                        padding: "20px",
                        borderRadius: "6px",
                        marginBottom: "15px",
                      }}
                    >
                      <p style={{ fontSize: "16px", color: "#fff", marginBottom: "10px" }}>
                        {index + 1}. {q.question}
                      </p>
                      <p style={{ fontSize: "14px", color: "#888", marginBottom: "5px" }}>
                        Correct Answer: {q.correctAnswer}
                      </p>
                      <p style={{ fontSize: "14px", color: "#888", marginBottom: "5px" }}>
                        Your Answer: {q.userAnswer}
                      </p>
                      <p style={{ fontSize: "14px", color: "#888" }}>Explanation: {q.explanation}</p>
                    </div>
                  ))}
                </div>

                <div style={{ textAlign: "center" }}>
                  <button
                    onClick={() => setShowMomTestGame(false)}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showGameHistory && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
          onClick={() => setShowGameHistory(false)}
        >
          <div
            style={{
              backgroundColor: "#2a2a2a",
              color: "#e0e0e0",
              padding: "40px",
              borderRadius: "8px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowGameHistory(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "none",
                border: "none",
                fontSize: "32px",
                color: "#ccc",
                cursor: "pointer",
              }}
            >
              ×
            </button>

            {/* History Header */}
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <h2 style={{ fontSize: "28px", color: "#fff", marginBottom: "10px" }}>Past Scores</h2>
              <p style={{ fontSize: "16px", color: "#ccc" }}>Your MomTest Game performance history</p>
            </div>

            {/* Scores List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {gameScores.length > 0 ? (
                gameScores.map((score, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#1a1a1a",
                      padding: "20px",
                      borderRadius: "6px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: "1px solid #444",
                    }}
                  >
                    <div>
                      <p style={{ fontSize: "16px", color: "#fff", margin: 0 }}>Score: {score.score} / 10</p>
                      <p style={{ fontSize: "14px", color: "#888", margin: "5px 0 0 0" }}>{score.date}</p>
                    </div>
                    <div
                      style={{
                        padding: "6px 12px",
                        borderRadius: "4px",
                        fontSize: "14px",
                        fontWeight: "bold",
                        backgroundColor: score.score >= 7 ? "#28a745" : score.score >= 5 ? "#ffc107" : "#dc3545",
                        color: score.score >= 5 ? "#000" : "#fff",
                      }}
                    >
                      {score.score >= 7 ? "Great!" : score.score >= 5 ? "Good" : "Practice More"}
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#888",
                  }}
                >
                  <p>No game scores yet. Play the MomTest Game to see your results here!</p>
                </div>
              )}
            </div>

            {/* Close Button at Bottom */}
            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <button
                onClick={() => setShowGameHistory(false)}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
