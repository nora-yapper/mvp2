import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { scenario, context } = await request.json()

    if (!scenario) {
      return NextResponse.json({ error: "Scenario description is required" }, { status: 400 })
    }

    // Mock response instead of AI SDK
    const analysis = {
      scenario,
      context: context || "general",
      probability: Math.floor(Math.random() * 60) + 20,
      impact_level: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
      potential_outcomes: [
        "Increased market share",
        "Higher customer satisfaction",
        "Improved operational efficiency",
        "Enhanced competitive position",
      ].slice(0, Math.floor(Math.random() * 3) + 1),
      risks: [
        "Resource allocation challenges",
        "Market timing issues",
        "Competitive response",
        "Technical implementation hurdles",
      ].slice(0, Math.floor(Math.random() * 3) + 1),
      mitigation_strategies: [
        "Phased implementation approach",
        "Continuous market monitoring",
        "Flexible resource planning",
        "Regular stakeholder communication",
      ],
      confidence_score: Math.floor(Math.random() * 30) + 60,
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Error analyzing what-if scenario:", error)
    return NextResponse.json({ error: "Failed to analyze scenario" }, { status: 500 })
  }
}
