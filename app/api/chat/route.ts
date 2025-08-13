import { type NextRequest, NextResponse } from "next/server"
import { spendTokensForAI, hasEnoughTokens } from "@/lib/token-integration"

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 })
    }

    // Check if user has enough tokens
    if (!hasEnoughTokens("AI_CHAT_MESSAGE")) {
      return NextResponse.json({
        message: "Insufficient tokens. You need 5 tokens to chat with AI assistant.",
      })
    }

    // Spend tokens for AI chat
    spendTokensForAI("AI_CHAT_MESSAGE")

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const message = data.choices[0]?.message?.content || "I'm here to help you create better interview questions!"

    return NextResponse.json({ message })
  } catch (error) {
    console.error("Error in chat API:", error)

    // Fallback response if OpenAI fails
    return NextResponse.json({
      message:
        "I'm here to help you create better interview questions! Try asking me about behavioral questions, avoiding hypotheticals, or how to structure effective customer interviews.",
    })
  }
}
