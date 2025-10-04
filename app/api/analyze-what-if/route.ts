import { type NextRequest, NextResponse } from "next/server"

// Simple validator to detect nonsense/off-topic input
function validateScenario(raw: unknown): { ok: boolean; reason?: string } {
  if (typeof raw !== "string") return { ok: false, reason: "Scenario must be a string." }
  const scenario = raw.trim()

  if (scenario.length < 8) return { ok: false, reason: "Too short." }
  if (/^[^a-zA-Z0-9]+$/.test(scenario)) return { ok: false, reason: "Gibberish characters." }
  if (/^(?:[a-zA-Z])\1{5,}$/.test(scenario)) return { ok: false, reason: "Repeated character spam." }
  if (/[\uD800-\uDFFF]/.test(scenario)) return { ok: false, reason: "Unsupported surrogate characters." }

  // Light topicality check for startup context
  const keywords = [
    "mvp","runway","fundraise","funding","seed","series a","burn","roadmap","milestone",
    "churn","activation","retention","pricing","go-to-market","gtm","product","launch",
    "engineer","team","hiring","budget","ad spend","marketing","sales","pipeline","users",
    "competitor","market","traction","pilot","investor","kpi","arpu","cac","ltv","feature",
    "timeline","delay","scope","pivot","incubator","accelerator"
  ]
  const sLower = scenario.toLowerCase()
  const hits = keywords.reduce((acc,k)=> acc + (sLower.includes(k) ? 1 : 0), 0)
  if (hits === 0) return { ok: false, reason: "Not startup-related." }

  return { ok: true }
}

export async function POST(request: NextRequest) {
  try {
    const { scenario, currentContext } = await request.json()

    if (!scenario) {
      return NextResponse.json({ message: "Please enter a startup-related what-if scenario to generate an analysis." })
    }

    // Validate scenario text
    const v = validateScenario(scenario)
    if (!v.ok) {
      return NextResponse.json({
        message: "Please enter a startup-related what-if scenario to generate an analysis.",
      })
    }

    // If input looks valid, continue with OpenAI call
    const prompt = `You are a startup advisor analyzing a what-if scenario. 

Current startup context:
- Stage: ${currentContext?.stage || "early-stage"}
- Team size: ${currentContext?.team_size || "small team"}
- Runway: ${currentContext?.runway_days || "limited"} days
- Current priorities: ${currentContext?.current_priorities?.join(", ") || "MVP development, user acquisition"}

Scenario to analyze: "${scenario}"

Provide a comprehensive analysis covering these areas (respond in plain text without markdown formatting):
Timeline: How this scenario affects project timelines and milestones
Resources: Impact on budget, runway, and resource allocation
Team: Effects on team dynamics, workload, and morale
Market: How this affects market positioning and competitive advantage
Investors: Impact on investor relations and fundraising prospects
Recommendations: Specific actionable steps to handle this scenario

Format your response as a JSON object with these exact keys: timeline, resources, team, market, investors, recommendations. Each value should be a clear, concise paragraph without any markdown formatting or special characters.`

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
    const text = data.choices?.[0]?.message?.content ?? ""

    // If the model ever says “invalid scenario”, just send the same friendly message
    if (/invalid scenario/i.test(text)) {
      return NextResponse.json({
        message: "Please enter a startup-related what-if scenario to generate an analysis.",
      })
    }

    // Try to parse JSON
    try {
      const analysis = JSON.parse(text)
      return NextResponse.json({ analysis })
    } catch {
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
    return NextResponse.json({ message: "Something went wrong while analyzing the scenario." })
  }
}

function extractSection(text: string, sectionName: string): string {
  const lines = text.split("\n")
  let capturing = false
  const content: string[] = []

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
      if (line.trim()) content.push(line.trim())
    }
  }

  return (
    content.join(" ").replace(/\*\*/g, "").replace(/\*/g, "").trim() ||
    `Analysis for ${sectionName.replace(":", "")} will be provided based on your specific scenario.`
  )
}
