import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { scenario, context } = await request.json()

    if (!scenario) {
      return NextResponse.json({ error: "Scenario is required" }, { status: 400 })
    }

    const prompt = `
You are a strategic business advisor analyzing a "what-if" scenario for a startup.

Context: ${context || "No additional context provided"}

Scenario to Analyze: "${scenario}"

Please provide a comprehensive analysis with:

## Immediate Impact Assessment
- What would happen in the first 30-90 days?
- Which areas of the business would be most affected?
- What resources would be required?

## Strategic Implications
- How does this align with or conflict with current strategy?
- What new opportunities might emerge?
- What existing plans might need to change?

## Risk Analysis
- What are the primary risks of this scenario?
- What could go wrong and how likely is it?
- What safeguards or contingencies should be considered?

## Implementation Considerations
- What would need to happen to make this scenario reality?
- What are the key dependencies and bottlenecks?
- What skills, resources, or partnerships would be needed?

## Recommendation
- Should this scenario be pursued? Why or why not?
- If yes, what should be the first steps?
- What metrics should be tracked to measure success?

Provide specific, actionable insights that help with strategic decision-making.
`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 1800,
    })

    return NextResponse.json({ analysis: text })
  } catch (error) {
    console.error("Error analyzing what-if scenario:", error)
    return NextResponse.json({ error: "Failed to analyze scenario" }, { status: 500 })
  }
}
