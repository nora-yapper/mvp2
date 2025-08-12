import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { area } = await request.json()

    if (!area || typeof area !== "string") {
      return NextResponse.json({ error: "Area is required and must be a string" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are an expert startup advisor and analyst. You provide concise, actionable analysis of specific startup areas. Your responses should be:
      - 2-3 sentences maximum
      - Focused on the specific area mentioned
      - Include both current assessment and actionable recommendations
      - Professional but encouraging tone
      - Specific and practical advice`,
      prompt: `Analyze the "${area}" aspect of a startup. Provide a brief assessment covering current state and key recommendations for improvement in this specific area.`,
    })

    return NextResponse.json({ analysis: text })
  } catch (error) {
    console.error("Error analyzing startup area:", error)
    return NextResponse.json({ error: "Failed to analyze startup area" }, { status: 500 })
  }
}
