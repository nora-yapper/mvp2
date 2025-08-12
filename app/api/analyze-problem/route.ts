import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { problem } = await request.json()

    if (!problem) {
      return NextResponse.json({ error: "Problem description is required" }, { status: 400 })
    }

    // Mock response instead of AI SDK
    const analysis = {
      problem: problem,
      severity: Math.random() > 0.5 ? "high" : "medium",
      category: ["technical", "business", "user experience"][Math.floor(Math.random() * 3)],
      recommendations: [
        "Conduct user research to validate the problem",
        "Analyze competitor solutions",
        "Define success metrics",
        "Create a minimum viable solution",
      ],
      estimatedEffort: `${Math.floor(Math.random() * 8) + 1} weeks`,
      confidence: Math.floor(Math.random() * 30) + 70,
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Error analyzing problem:", error)
    return NextResponse.json({ error: "Failed to analyze problem" }, { status: 500 })
  }
}
