import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Mock response instead of AI SDK
    const responses = [
      "That's an interesting point. Let me help you explore that further.",
      "Based on your startup context, I'd recommend focusing on user validation first.",
      "Have you considered the market size for this opportunity?",
      "Let's break this down into actionable steps.",
      "What metrics would you use to measure success here?",
    ]

    const response = responses[Math.floor(Math.random() * responses.length)]

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
      context: context || "general",
    })
  } catch (error) {
    console.error("Error in chat:", error)
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}
