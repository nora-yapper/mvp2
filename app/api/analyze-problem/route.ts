import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { problemStatement, startupInfo } = await request.json()

    if (!problemStatement) {
      return NextResponse.json({ error: "Problem statement is required" }, { status: 400 })
    }

    const prompt = `
You are an expert startup advisor analyzing a problem statement for customer research. 

Startup Context:
${
  startupInfo
    ? `
- Company: ${startupInfo.companyName || "Not specified"}
- Industry: ${startupInfo.industry || "Not specified"}  
- Stage: ${startupInfo.stage || "Not specified"}
- Team Size: ${startupInfo.teamSize || "Not specified"}
- Target Market: ${startupInfo.targetMarket || "Not specified"}
`
    : "No startup information provided"
}

Problem Statement to Analyze:
"${problemStatement}"

Please provide a comprehensive analysis with the following sections:

## Problem Analysis
Analyze the problem statement for clarity, specificity, and market relevance.

## Research Objectives  
Based on this problem, what are the key research questions that need to be answered?

## Target Customer Insights
Who should be interviewed and what customer segments should be prioritized?

## Validation Approach
What specific aspects of this problem need validation through customer interviews?

## Risk Assessment
What assumptions in this problem statement are most risky and need testing?

Provide actionable, specific guidance that will help structure effective customer research.
`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 1500,
    })

    return NextResponse.json({ analysis: text })
  } catch (error) {
    console.error("Error analyzing problem:", error)
    return NextResponse.json({ error: "Failed to analyze problem" }, { status: 500 })
  }
}
