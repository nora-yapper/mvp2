import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { mission, objective, constraints } = await request.json()

    if (!mission) {
      return NextResponse.json({ error: "Mission description is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system:
        "You are an expert strategic planner. Break down complex missions into actionable steps and create detailed execution plans.",
      prompt: `Mission: ${mission}
Objective: ${objective || "Not specified"}
Constraints: ${constraints || "None specified"}

Create a detailed step-by-step plan including:
1. Mission analysis and scope definition
2. Key objectives and success criteria
3. Step-by-step action plan with priorities
4. Resource requirements for each step
5. Timeline and dependencies
6. Risk factors and contingency plans
7. Progress tracking and review points

Format as a comprehensive mission execution guide with clear, actionable steps.`,
    })

    return NextResponse.json({ steps: text })
  } catch (error) {
    console.error("Error generating mission steps:", error)
    return NextResponse.json({ error: "Failed to generate mission steps" }, { status: 500 })
  }
}
