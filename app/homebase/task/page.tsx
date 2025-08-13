"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { earnTokensForStep } from "@/lib/token-integration"

export default function HomebaseTaskPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<string>("")

  // Startup Info Form State
  const [startupInfo, setStartupInfo] = useState({
    companyName: "",
    industry: "",
    stage: "",
    teamSize: "",
    targetMarket: "",
    problemStatement: "",
    currentRevenue: "",
    fundingStatus: "",
  })

  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const task = params.get("task") || ""
    setCurrentTask(task)

    // Load saved startup info
    const savedInfo = sessionStorage.getItem("startupInfo")
    if (savedInfo) {
      setStartupInfo(JSON.parse(savedInfo))
      setIsSaved(true)
    }
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setStartupInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
    setIsSaved(false)
  }

  const handleSave = () => {
    // Check if required fields are filled
    const requiredFields = ["companyName", "industry", "stage", "problemStatement"]
    const isComplete = requiredFields.every((field) => startupInfo[field as keyof typeof startupInfo].trim() !== "")

    // Save to session storage
    sessionStorage.setItem("startupInfo", JSON.stringify(startupInfo))
    setIsSaved(true)

    // Award tokens for completing startup info (only first time)
    const hasCompletedBefore = sessionStorage.getItem("hasCompletedStartupInfo")
    if (isComplete && !hasCompletedBefore) {
      earnTokensForStep("HOMEBASE_STARTUP_INFO")
      sessionStorage.setItem("hasCompletedStartupInfo", "true")
    }

    alert("Startup information saved successfully!")
  }

  const renderStartupInfoTask = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Button onClick={() => window.history.back()} variant="outline" className="mb-4">
          ← Back to Homebase
        </Button>
        <h1 className="text-3xl font-bold mb-2">Startup Information</h1>
        <p className="text-gray-600">Tell us about your startup to get personalized insights and recommendations.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={startupInfo.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                placeholder="Enter your company name"
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry *</Label>
              <Input
                id="industry"
                value={startupInfo.industry}
                onChange={(e) => handleInputChange("industry", e.target.value)}
                placeholder="e.g., SaaS, E-commerce, FinTech"
              />
            </div>

            <div>
              <Label htmlFor="stage">Stage *</Label>
              <select
                id="stage"
                value={startupInfo.stage}
                onChange={(e) => handleInputChange("stage", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select stage</option>
                <option value="idea">Idea Stage</option>
                <option value="mvp">MVP Development</option>
                <option value="early-traction">Early Traction</option>
                <option value="growth">Growth Stage</option>
                <option value="scale">Scale Stage</option>
              </select>
            </div>

            <div>
              <Label htmlFor="teamSize">Team Size</Label>
              <select
                id="teamSize"
                value={startupInfo.teamSize}
                onChange={(e) => handleInputChange("teamSize", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select team size</option>
                <option value="solo">Solo founder</option>
                <option value="2-3">2-3 people</option>
                <option value="4-10">4-10 people</option>
                <option value="11-25">11-25 people</option>
                <option value="25+">25+ people</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="targetMarket">Target Market</Label>
              <Input
                id="targetMarket"
                value={startupInfo.targetMarket}
                onChange={(e) => handleInputChange("targetMarket", e.target.value)}
                placeholder="Describe your target customers"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="problemStatement">Problem Statement *</Label>
              <Textarea
                id="problemStatement"
                value={startupInfo.problemStatement}
                onChange={(e) => handleInputChange("problemStatement", e.target.value)}
                placeholder="What problem are you solving?"
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="currentRevenue">Current Monthly Revenue</Label>
              <select
                id="currentRevenue"
                value={startupInfo.currentRevenue}
                onChange={(e) => handleInputChange("currentRevenue", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select revenue range</option>
                <option value="0">$0 (Pre-revenue)</option>
                <option value="1-1000">$1 - $1,000</option>
                <option value="1000-5000">$1,000 - $5,000</option>
                <option value="5000-10000">$5,000 - $10,000</option>
                <option value="10000-50000">$10,000 - $50,000</option>
                <option value="50000+">$50,000+</option>
              </select>
            </div>

            <div>
              <Label htmlFor="fundingStatus">Funding Status</Label>
              <select
                id="fundingStatus"
                value={startupInfo.fundingStatus}
                onChange={(e) => handleInputChange("fundingStatus", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select funding status</option>
                <option value="bootstrapped">Bootstrapped</option>
                <option value="seeking-pre-seed">Seeking Pre-seed</option>
                <option value="pre-seed">Pre-seed Funded</option>
                <option value="seeking-seed">Seeking Seed</option>
                <option value="seed">Seed Funded</option>
                <option value="series-a+">Series A+</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-500">* Required fields</div>
            <div className="flex gap-2">
              {isSaved && <span className="text-green-600 text-sm flex items-center">✓ Saved</span>}
              <Button onClick={handleSave}>Save Information</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderTaskContent = () => {
    if (currentTask === "startup-info") {
      return renderStartupInfoTask()
    }

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Button onClick={() => window.history.back()} variant="outline" className="mb-4">
            ← Back to Homebase
          </Button>
          <h1 className="text-3xl font-bold mb-2">Task: {currentTask}</h1>
        </div>

        <Alert>
          <AlertDescription>
            This task is coming soon! We're working on building out all the homebase tools.
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
