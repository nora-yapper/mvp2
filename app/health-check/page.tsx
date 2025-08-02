"use client"

import type React from "react"

import { useState } from "react"
import { ArrowUp, ArrowDown, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface MetricData {
  id: string
  title: string
  score: number
  color: string
}

const metricsData: MetricData[] = [
  { id: "product", title: "Product & Innovation", score: 85, color: "#E5E7EB" },
  { id: "marketing", title: "Marketing & Brand", score: 62, color: "#E5E7EB" },
  { id: "sales", title: "Sales & Revenue", score: 95, color: "#E5E7EB" },
  { id: "team", title: "Team & Culture", score: 73, color: "#E5E7EB" },
  { id: "operations", title: "Operations & Scalability", score: 45, color: "#E5E7EB" },
  { id: "financial", title: "Financial Health", score: 88, color: "#E5E7EB" },
]

export default function HealthCheckPage() {
  const [analysisInput, setAnalysisInput] = useState("")
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null)

  const handleAnalyze = () => {
    if (analysisInput.trim()) {
      setShowAnalysis(true)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAnalyze()
    }
  }

  const toggleMetricDetails = (metricId: string) => {
    setExpandedMetric(expandedMetric === metricId ? null : metricId)
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <Button variant="ghost" size="icon" className="text-white hover:bg-slate-800">
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light mb-4">Health Check</h1>
          <p className="text-slate-400 text-lg mb-8">
            Choose an area to analyze and I'll show you how your startup is doing
          </p>

          {/* Analysis Input */}
          <div className="relative max-w-md mx-auto mb-8">
            <Input
              value={analysisInput}
              onChange={(e) => setAnalysisInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g. team, product, growth, research..."
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 pr-12 py-3"
            />
            <Button
              onClick={handleAnalyze}
              size="icon"
              className="absolute right-1 top-1 bg-slate-600 hover:bg-slate-500 h-8 w-8"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Analysis Results */}
        {showAnalysis && (
          <div className="mb-12">
            <div className="bg-slate-800/30 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-medium mb-4">Analysis Results</h3>
              <p className="text-slate-300 leading-relaxed">
                Analysis complete for "{analysisInput}": Your startup shows strong potential in this area with room for
                strategic improvements. Key recommendations include focusing on data-driven decision making and
                implementing scalable processes.
              </p>
            </div>
          </div>
        )}

        {/* Metrics Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-light mb-4">Your Startup Metrics</h2>
          <p className="text-slate-400 text-lg">Real-time health metrics of key areas</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {metricsData.map((metric) => (
            <div key={metric.id} className="text-center">
              <h3 className="text-xl font-medium mb-8">{metric.title}</h3>

              {/* Progress Bar Container */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {/* Background Bar */}
                  <div className="w-12 h-32 bg-slate-700 rounded-full overflow-hidden">
                    {/* Progress Fill */}
                    <div
                      className="w-full bg-gradient-to-t from-slate-300 to-white rounded-full transition-all duration-1000 ease-out"
                      style={{
                        height: `${metric.score}%`,
                        marginTop: `${100 - metric.score}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Score Display */}
              <div className="mb-6">
                <div className="text-3xl font-light mb-1">{metric.score}%</div>
                <div className="text-slate-400 text-sm">Current Score</div>
              </div>

              {/* View Details Button */}
              <Button
                variant="ghost"
                onClick={() => toggleMetricDetails(metric.id)}
                className="text-slate-300 hover:text-white hover:bg-slate-800/50 text-sm"
              >
                View Details{" "}
                {expandedMetric === metric.id ? (
                  <ArrowUp className="ml-1 h-4 w-4" />
                ) : (
                  <ArrowDown className="ml-1 h-4 w-4" />
                )}
              </Button>

              {/* Expanded Details */}
              {expandedMetric === metric.id && (
                <div className="mt-4 p-4 bg-slate-800/30 rounded-lg">
                  <p className="text-slate-400 text-sm">Detailed health analysis coming soon...</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-4 right-4">
        <div className="text-xs text-slate-500">Edit with ❤️ Lovable</div>
      </div>
    </div>
  )
}
