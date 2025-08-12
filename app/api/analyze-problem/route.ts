import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { problem } = await request.json()

    if (!problem) {
      return NextResponse.json({ error: "Problem description is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Analyze this startup problem and provide insights:

Problem: ${problem}

Please provide:
1. Problem validation (is this a real problem?)
2. Market size estimation
3. Potential solutions
4. Key challenges
5. Success factors

Format your response in a clear, structured way.`,
    })

    return NextResponse.json({ analysis: text })
  } catch (error) {
    console.error("Error analyzing problem:", error)
    return NextResponse.json({ error: "Failed to analyze problem" }, { status: 500 })
  }
}
