import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { solution, timeline, resources } = await request.json()

    if (!solution) {
      return NextResponse.json({ error: "Solution description is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system:
        "You are an expert project manager and implementation specialist. Create detailed implementation plans for business solutions.",
      prompt: `Solution to implement: ${solution}
Timeline: ${timeline || "Not specified"}
Available resources: ${resources || "Not specified"}

Create a comprehensive implementation plan including:
1. Phase breakdown with milestones
2. Resource allocation and requirements
3. Risk assessment and mitigation strategies
4. Success metrics and KPIs
5. Timeline with dependencies
6. Communication and stakeholder management plan
7. Quality assurance and testing procedures

Format the response as a detailed, actionable implementation guide.`,
    })

    return NextResponse.json({ implementation: text })
  } catch (error) {
    console.error("Error generating implementation:", error)
    return NextResponse.json({ error: "Failed to generate implementation plan" }, { status: 500 })
  }
}
