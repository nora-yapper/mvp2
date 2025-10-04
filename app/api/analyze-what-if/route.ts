import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { scenario, currentContext } = await request.json()

    if (!scenario) {
      return NextResponse.json({ error: "Scenario is required" }, { status: 400 })
    }
    const looksInvalid =
  !scenario ||
  scenario.trim().length < 8 ||
  /^[^a-zA-Z0-9]+$/.test(scenario) || // mostly non-alphanumerics
  /^(?:[a-z])\1{5,}$/i.test(scenario) || // repeated single char
  /^[a-z0-9\s!?.,-]{0,}$/.test(scenario) === false; // weird unicode spam

if (looksInvalid) {
  return NextResponse.json({
    analysis: {
      timeline: "Invalid scenario: please enter a startup-related what-if scenario.",
      resources: "Invalid scenario: please enter a startup-related what-if scenario.",
      team: "Invalid scenario: please enter a startup-related what-if scenario.",
      market: "Invalid scenario: please enter a startup-related what-if scenario.",
      investors: "Invalid scenario: please enter a startup-related what-if scenario.",
      recommendations: "Invalid scenario: please enter a startup-related what-if scenario.",
    }
  });
}

    const looksInvalid =
      !scenario ||
      scenario.trim().length < 8 ||
      /^[^a-zA-Z0-9]+$/.test(scenario) || // mostly non-alphanumerics
      /^(?:[a-z])\1{5,}$/i.test(scenario) || // repeated single char
      /^[a-z0-9\s!?.,-]{0,}$/.test(scenario) === false // weird unicode spam

    if (looksInvalid) {
      return NextResponse.json({
        analysis: {
          timeline: "Invalid scenario: please enter a startup-related what-if scenario.",
          resources: "Invalid scenario: please enter a startup-related what-if scenario.",
          team: "Invalid scenario: please enter a startup-related what-if scenario.",
          market: "Invalid scenario: please enter a startup-related what-if scenario.",
          investors: "Invalid scenario: please enter a startup-related what-if scenario.",
          recommendations: "Invalid scenario: please enter a startup-related what-if scenario.",
        },
      })
    }

    const prompt = `You are a startup advisor analyzing a what-if scenario.

Before you do anything, VALIDATE the "scenario" text. Be strict:
- If the scenario is gibberish (random characters, repeated nonsense, emoji spam), clearly off-topic (not about startups, products, teams, markets, funding, operations, users), or too vague to analyze (e.g., "idk", "??", "asdf"), DO NOT analyze.
- If invalid, return a JSON object with these exact keys: timeline, resources, team, market, investors, recommendations.
  * Set each value to the SAME short message: "Invalid scenario: please enter a startup-related what-if scenario (e.g., 'Launch is delayed by 6 weeks', 'Key engineer leaves', 'Ad budget is cut by 30%', 'Major competitor enters our niche')."
  * No additional fields. No markdown. No special characters.

If the scenario is valid, proceed with analysis.

Current startup context:
- Stage: ${currentContext?.stage || "early-stage"}
- Team size: ${currentContext?.team_size || "small team"}
- Runway: ${currentContext?.runway_days || "limited"} days
- Current priorities: ${currentContext?.current_priorities?.join(", ") || "MVP development, user acquisition"}

Scenario to analyze: "${scenario}"

For VALID scenarios only, provide a comprehensive analysis covering these areas (respond in plain text, no markdown, no special characters):

Timeline: How this scenario affects project timelines and milestones
Resources: Impact on budget, runway, and resource allocation
Team: Effects on team dynamics, workload, and morale
Market: How this affects market positioning and competitive advantage
Investors: Impact on investor relations and fundraising prospects
Recommendations: Specific actionable steps to handle this scenario

Format your response as a JSON object with these exact keys: timeline, resources, team, market, investors, recommendations.
Each value must be a clear, concise paragraph without markdown or special characters.`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const text = data.choices[0].message.content

    // Try to parse as JSON first
    try {
      const analysis = JSON.parse(text)
      return NextResponse.json({ analysis })
    } catch (parseError) {
      // If JSON parsing fails, try to extract sections manually
      const sections = {
        timeline: extractSection(text, "Timeline:"),
        resources: extractSection(text, "Resources:"),
        team: extractSection(text, "Team:"),
        market: extractSection(text, "Market:"),
        investors: extractSection(text, "Investors:"),
        recommendations: extractSection(text, "Recommendations:"),
      }

      return NextResponse.json({ analysis: sections })
    }
  } catch (error) {
    console.error("What-if analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze scenario" }, { status: 500 })
  }
}

function extractSection(text: string, sectionName: string): string {
  const lines = text.split("\n")
  let capturing = false
  const content = []

  for (const line of lines) {
    if (line.includes(sectionName)) {
      capturing = true
      const afterColon = line.split(sectionName)[1]
      if (afterColon && afterColon.trim()) {
        content.push(afterColon.trim())
      }
      continue
    }

    if (capturing) {
      if (
        line.includes(":") &&
        (line.includes("Timeline:") ||
          line.includes("Resources:") ||
          line.includes("Team:") ||
          line.includes("Market:") ||
          line.includes("Investors:") ||
          line.includes("Recommendations:"))
      ) {
        break
      }
      if (line.trim()) {
        content.push(line.trim())
      }
    }
  }

  return (
    content.join(" ").replace(/\*\*/g, "").replace(/\*/g, "").trim() ||
    `Analysis for ${sectionName.replace(":", "")} will be provided based on your specific scenario.`
  )
}
