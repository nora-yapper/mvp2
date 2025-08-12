import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { questions, context } = await request.json()

    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: "Questions array is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system:
        "You are an expert business consultant. Evaluate the given questions for their relevance, clarity, and strategic value in the given context.",
      prompt: `Context: ${context || "General business strategy"}

Questions to evaluate:
${questions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Please evaluate each question and provide:
1. Relevance score (1-10)
2. Clarity assessment
3. Strategic value
4. Suggested improvements if needed
5. Additional questions that might be valuable

Format your response as a structured evaluation.`,
    })

    return NextResponse.json({ evaluation: text })
  } catch (error) {
    console.error("Error evaluating questions:", error)
    return NextResponse.json({ error: "Failed to evaluate questions" }, { status: 500 })
  }
}
