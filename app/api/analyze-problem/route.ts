import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { problemDescription } = await request.json()

    if (!problemDescription) {
      return NextResponse.json({ error: "Problem description is required" }, { status: 400 })
    }

    const openaiApiKey = process.env.OPENAI_API_KEY
    const analysisInstructions = `
Analyze the problem description and provide a structured response with the following format:

**Problem Statement (1 sentence):** A clear summary of the core problem, in plain language.

**Target Audience:** Who experiences this problem (describe user segment).

**Context & Trigger:** When, where, or in what situation the problem appears.

**Impact or Pain:** Why this problem matters to the user (consequences, frustrations, missed opportunities).

**Assumptions to Validate:** List 2–3 key assumptions or uncertainties that need to be tested through interviews.

Please format your response clearly with these exact headings and provide actionable insights for each section.
`

    if (!openaiApiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: analysisInstructions,
          },
          {
            role: "user",
            content: `Please analyze this problem description: ${problemDescription}`,
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
    console.error("Error calling OpenAI API:", error)
    return NextResponse.json({ error: "Failed to analyze problem description" }, { status: 500 })
  }
}
