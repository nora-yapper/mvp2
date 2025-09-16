import { type NextRequest, NextResponse } from "next/server"

// Add function to get startup context
function getStartupContext() {
  // This will be passed from the client
  return null
}

export async function POST(request: NextRequest) {
  try {
    const { messages, startupContext } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 })
    }

    // Build context-aware system message
    let systemMessage = "You are a helpful startup advisor assistant."

    if (startupContext && startupContext.companyName) {
      systemMessage += ` You are helping ${startupContext.companyName}, a ${startupContext.stage || "startup"} company in the ${startupContext.industry || "technology"} industry.`

      if (startupContext.description) {
        systemMessage += ` Company description: ${startupContext.description}`
      }

      if (startupContext.keyProblem) {
        systemMessage += ` They are solving: ${startupContext.keyProblem}`
      }

      if (startupContext.targetMarket) {
        systemMessage += ` Their target market is: ${startupContext.targetMarket}`
      }

      systemMessage += " Provide advice that is specific and relevant to their business context."
    }

    // Add system message to the beginning if not already present
    const contextualMessages = [
      { role: "system", content: systemMessage },
      ...messages.filter((msg) => msg.role !== "system"),
    ]

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: contextualMessages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const message = data.choices[0]?.message?.content || "I'm here to help you with your startup!"

    return NextResponse.json({ message })
  } catch (error) {
    console.error("Error in chat API:", error)

    // Fallback response if OpenAI fails
    return NextResponse.json({
      message:
        "I'm here to help you with your startup! Try asking me about strategy, product development, or customer research.",
    })
  }
}
