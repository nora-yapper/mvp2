import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { scenario, currentContext } = await request.json()

    if (!scenario) {
      return NextResponse.json({ error: "Scenario is required" }, { status: 400 })
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
            content:
              "You are a startup advisor. Analyze what-if scenarios and provide structured analysis covering timeline impact, resource implications, team dynamics, investor relations, market position, and strategic recommendations.",
          },
          {
            role: "user",
            content: `Analyze this what-if scenario: "${scenario}". Current context: ${JSON.stringify(currentContext)}. Provide analysis in these areas: timeline, resources, team, investors, market, recommendations.`,
          },
        ],
        max_tokens: 1200,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || "Unable to analyze the scenario."

    // Parse the response into structured format
    const analysis = {
      timeline: extractSection(content, "timeline"),
      resources: extractSection(content, "resources"),
      team: extractSection(content, "team"),
      investors: extractSection(content, "investors"),
      market: extractSection(content, "market"),
      recommendations: extractSection(content, "recommendations"),
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("What-if analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze scenario" }, { status: 500 })
  }
}

function extractSection(content: string, section: string): string {
  const regex = new RegExp(`${section}[:\\s]*([^\\n]*(?:\\n(?!\\w+:)[^\\n]*)*)`, "i")
  const match = content.match(regex)
  return match ? match[1].trim() : `Analysis for ${section} not available.`
}
