import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: openai("gpt-4o"),
    messages,
    system:
      "You are a helpful startup advisor. Provide practical, actionable advice for entrepreneurs and startup teams.",
  })

  return result.toAIStreamResponse()
}
