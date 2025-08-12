import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { questions, context } = await request.json()

    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: "Questions array is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Evaluate these interview questions for effectiveness:

Questions:
${questions.map((q: string, i: number) => `${i + 1}. ${q}`).join("\n")}

${context ? `Context: ${context}` : ""}

Please provide:
1. Overall assessment of the question set
2. Strengths and weaknesses of each question
3. Suggestions for improvement
4. Additional questions to consider
5. Interview flow recommendations

Format your response in a clear, structured way.`,
    })

    return NextResponse.json({ evaluation: text })
  } catch (error) {
    console.error("Error evaluating questions:", error)
    return NextResponse.json({ error: "Failed to evaluate questions" }, { status: 500 })
  }
}
