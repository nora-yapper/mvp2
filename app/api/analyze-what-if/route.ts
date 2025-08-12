import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { scenario, currentState, variables } = await request.json()

    if (!scenario) {
      return NextResponse.json({ error: "Scenario description is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system:
        "You are an expert scenario planner and strategic analyst. Analyze what-if scenarios and their potential impacts on business outcomes.",
      prompt: `What-if Scenario: ${scenario}
Current State: ${currentState || "Not specified"}
Key Variables: ${variables || "Not specified"}

Provide a comprehensive what-if analysis including:
1. Scenario probability assessment
2. Potential outcomes (best case, worst case, most likely)
3. Impact analysis on key business metrics
4. Required resources and capabilities
5. Timeline and implementation considerations
6. Risk factors and mitigation strategies
7. Success indicators and monitoring metrics
8. Alternative scenarios and contingency plans
9. Strategic recommendations
10. Action items and next steps

Format as a detailed scenario analysis report with clear recommendations.`,
    })

    return NextResponse.json({ analysis: text })
  } catch (error) {
    console.error("Error analyzing what-if scenario:", error)
    return NextResponse.json({ error: "Failed to analyze what-if scenario" }, { status: 500 })
  }
}
