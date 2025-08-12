import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { area, description } = await request.json()

    if (!area || !description) {
      return NextResponse.json({ error: "Area and description are required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Analyze this startup area and provide detailed insights:

Area: ${area}
Description: ${description}

Please provide:
1. Market analysis and opportunities
2. Key challenges and risks
3. Competitive landscape
4. Required resources and skills
5. Potential business models
6. Success metrics to track
7. Next steps and recommendations

Format your response in a clear, structured way with actionable insights.`,
    })

    return NextResponse.json({ analysis: text })
  } catch (error) {
    console.error("Error analyzing startup area:", error)
    return NextResponse.json({ error: "Failed to analyze startup area" }, { status: 500 })
  }
}
