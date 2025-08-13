import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { questions } = await request.json()

    if (!questions || questions.length === 0) {
      return NextResponse.json({ error: "Questions are required" }, { status: 400 })
    }

    const questionsText = questions.map((q: any, index: number) => `${index + 1}. ${q.question}`).join("\n")

    const prompt = `
You are an expert in customer development and The Mom Test methodology. Evaluate these interview questions:

${questionsText}

For each question, provide:

## Question Analysis
Rate each question (1-10) and explain:
- How well it follows Mom Test principles
- Whether it's leading or neutral
- If it asks about past behavior vs future intentions
- How actionable the answers would be

## Specific Improvements
For questions that need work, provide:
- Exact rewording suggestions
- Why the original phrasing is problematic
- How the improved version is better

## Overall Assessment
- Overall quality score (1-10)
- Best questions in the set
- Biggest areas for improvement
- Missing question types that should be added

## Mom Test Principles Reminder
- Ask about past behavior, not future intentions
- Don't mention your idea directly
- Ask about their life, not your product
- Focus on problems and workflows, not solutions

Be specific and actionable in your feedback.
`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 2000,
    })

    return NextResponse.json({ evaluation: text })
  } catch (error) {
    console.error("Error evaluating questions:", error)
    return NextResponse.json({ error: "Failed to evaluate questions" }, { status: 500 })
  }
}
