import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { scenario, context } = await request.json()

    if (!scenario) {
      return NextResponse.json({ error: "Scenario is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Analyze this "what if" scenario for a startup:

Scenario: ${scenario}
${context ? `Context: ${context}` : ""}

Please provide:
1. Potential outcomes and implications
2. Risks and opportunities
3. Required preparations
4. Mitigation strategies
5. Success indicators
6. Timeline considerations
7. Resource requirements

Format your response in a clear, structured way with actionable insights.`,
    })

    return NextResponse.json({ analysis: text })
  } catch (error) {
    console.error("Error analyzing what-if scenario:", error)
    return NextResponse.json({ error: "Failed to analyze scenario" }, { status: 500 })
  }
}
