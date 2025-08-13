import { type NextRequest, NextResponse } from "next/server"
import { spendTokensForAI, hasEnoughTokens } from "@/lib/token-integration"

export async function POST(request: NextRequest) {
  try {
    const { problemDescription, startupContext } = await request.json()

    if (!problemDescription) {
      return NextResponse.json({ error: "Problem description is required" }, { status: 400 })
    }

    // Check if user has enough tokens
    if (!hasEnoughTokens("RESEARCH_ANALYSIS")) {
      return NextResponse.json(
        {
          error: "Insufficient tokens. You need 15 tokens for AI analysis.",
        },
        { status: 402 },
      )
    }

    // Spend tokens for AI analysis
    spendTokensForAI("RESEARCH_ANALYSIS")

    // Build context-aware system prompt
    let systemPrompt = `You are a startup advisor helping analyze problem statements. Based on the user's problem description, generate a structured analysis with exactly these sections:

**Problem Statement:** (A clear, concise restatement of the core problem)
**Target Audience:** (Who specifically has this problem - be detailed about demographics, behaviors, and characteristics)
**Context & Trigger:** (When and where this problem occurs, what triggers it)
**Impact or Pain:** (What are the consequences of this problem - emotional, financial, time-based, etc.)
**Assumptions to Validate:** (Key assumptions that need to be tested through research)

Keep each section focused and actionable. Use bullet points where helpful. Be specific rather than generic.`

    const userPrompt = `Please analyze this problem statement and provide the structured breakdown: ${problemDescription}`

    // Add startup context if available
    if (startupContext && startupContext.companyName) {
      systemPrompt += `\n\nContext: You are analyzing this for ${startupContext.companyName}, a ${startupContext.stage || "startup"} company in the ${startupContext.industry || "technology"} industry.`

      if (startupContext.targetMarket) {
        systemPrompt += ` Their target market is: ${startupContext.targetMarket}.`
      }

      if (startupContext.businessModel) {
        systemPrompt += ` Their business model: ${startupContext.businessModel}.`
      }

      systemPrompt += " Tailor your analysis to be relevant to their specific business context."
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const analysis = data.choices[0]?.message?.content || "Unable to generate analysis"

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Error analyzing problem:", error)

    // Fallback response if OpenAI fails
    const problemDescription = "Default problem description" // Declare the variable here
    const fallbackAnalysis = `**Problem Statement:** ${problemDescription}

**Target Audience:** Early adopters and potential users who experience this specific challenge.

**Context & Trigger:** This problem typically occurs during daily workflows and decision-making processes.

**Impact or Pain:** Users experience frustration, inefficiency, and potential lost opportunities when this problem persists.

**Assumptions to Validate:** 
• Users are actively seeking solutions to this problem
• The problem occurs frequently enough to warrant a solution
• Users would be willing to adopt a new solution`

    return NextResponse.json({ analysis: fallbackAnalysis })
  }
}
