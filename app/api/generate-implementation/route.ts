import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { task, context, requirements } = await request.json()

    if (!task) {
      return NextResponse.json({ error: "Task is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Generate a detailed implementation plan for this task:

Task: ${task}
${context ? `Context: ${context}` : ""}
${requirements ? `Requirements: ${requirements}` : ""}

Please provide:
1. Step-by-step implementation plan
2. Required resources and tools
3. Timeline estimation
4. Potential challenges and solutions
5. Success metrics
6. Quality assurance steps
7. Next steps after completion

Format your response in a clear, actionable way with specific details.`,
    })

    return NextResponse.json({ implementation: text })
  } catch (error) {
    console.error("Error generating implementation:", error)
    return NextResponse.json({ error: "Failed to generate implementation plan" }, { status: 500 })
  }
}
