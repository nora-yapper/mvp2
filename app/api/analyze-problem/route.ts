import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { problem } = await request.json()

    if (!problem) {
      return NextResponse.json({ error: "Problem description is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system:
        "You are an expert business analyst. Analyze the given problem and provide structured insights including root causes, impact assessment, and potential solutions.",
      prompt: `Analyze this business problem: ${problem}

Please provide:
1. Problem breakdown and root causes
2. Impact assessment (short-term and long-term)
3. Potential solutions with pros/cons
4. Recommended action plan
5. Success metrics to track progress

Format your response in a clear, structured manner.`,
    })

    return NextResponse.json({ analysis: text })
  } catch (error) {
    console.error("Error analyzing problem:", error)
    return NextResponse.json({ error: "Failed to analyze problem" }, { status: 500 })
  }
}
