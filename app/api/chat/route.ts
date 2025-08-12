import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 })
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.role !== "user") {
      return NextResponse.json({ error: "Last message must be from user" }, { status: 400 })
    }

    // Generate response using AI SDK
    const result = await generateText({
      model: openai("gpt-4o"),
      messages: messages.map((msg) => ({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content,
      })),
      system:
        "You are a helpful AI assistant for startup founders. Provide practical, actionable advice about building and growing startups. Keep responses concise and focused.",
      maxTokens: 500,
    })

    return NextResponse.json({ message: result.text })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to generate response. Please try again." }, { status: 500 })
  }
}
