import { type NextRequest, NextResponse } from "next/server"
import { spendTokensForAI, hasEnoughTokens } from "@/lib/token-integration"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Handle both old format (task, context) and new format (goal, context, timeframe)
    let goal, context, timeframe

    if (body.goal) {
      // New format from forecast page
      goal = body.goal
      context = body.context || "No additional context provided"
      timeframe = body.timeframe || "Not specified"
    } else {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    if (!goal) {
      return NextResponse.json({ error: "Goal is required" }, { status: 400 })
    }

    // Check if user has enough tokens
    if (!hasEnoughTokens("IMPLEMENTATION_GENERATION")) {
      return NextResponse.json(
        {
          error: "Insufficient tokens. You need 25 tokens for implementation generation.",
        },
        { status: 402 },
      )
    }

    // Spend tokens for AI generation
    spendTokensForAI("IMPLEMENTATION_GENERATION")

    const prompt = `
You are an expert startup advisor creating an implementation plan.

Goal: ${goal}
Context: ${context || "No additional context provided"}
Timeframe: ${timeframe || "Not specified"}

Create a detailed implementation plan with:

## Executive Summary
Brief overview of the goal and approach

## Phase Breakdown
Divide the implementation into logical phases (typically 3-5 phases):
- Phase name and duration
- Key objectives for each phase
- Major deliverables
- Success criteria

## Detailed Action Steps
For each phase, provide:
- Specific tasks and activities
- Who should be responsible (roles, not names)
- Dependencies between tasks
- Estimated time requirements

## Resource Requirements
- Team members and skills needed
- Budget considerations
- Tools and technology requirements
- External partnerships or vendors

## Risk Mitigation
- Potential obstacles and challenges
- Contingency plans
- Early warning indicators
- Risk mitigation strategies

## Success Metrics
- Key performance indicators (KPIs)
- Milestones and checkpoints
- How to measure progress
- Definition of success

## Timeline
- High-level timeline with major milestones
- Critical path dependencies
- Buffer time for unexpected issues

Make the plan specific, actionable, and realistic for a startup environment.
`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 2500,
    })

    return NextResponse.json({ plan: text })
  } catch (error) {
    console.error("Error generating implementation plan:", error)
    return NextResponse.json({ error: "Failed to generate implementation plan" }, { status: 500 })
  }
}
