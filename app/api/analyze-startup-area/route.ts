import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { area, industry, stage } = await request.json()

    if (!area) {
      return NextResponse.json({ error: "Startup area is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system:
        "You are an expert startup advisor and market analyst. Provide comprehensive analysis of startup areas and market opportunities.",
      prompt: `Startup Area: ${area}
Industry: ${industry || "Not specified"}
Stage: ${stage || "Early stage"}

Provide a comprehensive analysis including:
1. Market opportunity and size assessment
2. Competitive landscape analysis
3. Key challenges and barriers to entry
4. Success factors and best practices
5. Funding landscape and investor interest
6. Technology trends and disruptions
7. Regulatory considerations
8. Go-to-market strategies
9. Potential partnerships and collaborations
10. Risk assessment and mitigation strategies

Format as a detailed startup area analysis report.`,
    })

    return NextResponse.json({ analysis: text })
  } catch (error) {
    console.error("Error analyzing startup area:", error)
    return NextResponse.json({ error: "Failed to analyze startup area" }, { status: 500 })
  }
}
