import { type NextRequest, NextResponse } from "next/server"
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 })
    }

    const result = streamText({
      model: openai("gpt-4o"),
      system:
        "You are a helpful AI assistant for a startup management platform. Help users with business strategy, planning, and execution.",
      messages,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in chat:", error)
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 })
  }
}
