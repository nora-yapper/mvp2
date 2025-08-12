import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { scenario, currentContext } = await req.json()

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert startup advisor analyzing what-if scenarios. 

CONTEXT: Early-stage startup (${currentContext.team_size} people, ${currentContext.runway_days} days runway)
CURRENT PRIORITIES: ${currentContext.current_priorities.join(", ")}

Analyze the given scenario and provide structured insights on how it would impact different aspects of the startup journey.

RESPONSE FORMAT - Return ONLY a JSON object with these sections:
{
  "timeline": "How this affects key milestones and deadlines (2-3 sentences)",
  "resources": "Impact on budget, runway, and resource allocation (2-3 sentences)", 
  "team": "Effects on team dynamics, workload, and morale (2-3 sentences)",
  "investors": "How this might affect investor relationships and fundraising (2-3 sentences)",
  "market": "Impact on market position and competitive advantage (2-3 sentences)",
  "recommendations": "Strategic recommendations to mitigate risks or capitalize on opportunities (3-4 sentences)"
}

Be specific, actionable, and realistic for an early-stage startup. Focus on practical implications.`,
          },
          {
            role: "user",
            content: `Analyze this what-if scenario: "${scenario}"

Consider the startup context and provide detailed analysis of how this scenario would impact the different aspects of the business.`,
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
    const aiResponse = data.choices[0]?.message?.content || ""

    // Parse the JSON response
    let analysis = {}
    try {
      // Extract JSON from the response if it's wrapped in text
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
      } else {
        analysis = JSON.parse(aiResponse)
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError)
      // Return fallback analysis
      analysis = {
        timeline: "This scenario could significantly impact your current timeline and milestone delivery dates.",
        resources: "Resource allocation and budget planning would need to be reassessed based on this change.",
        team: "Team workload and dynamics may be affected, requiring careful management and communication.",
        investors: "Investor expectations and reporting may need to be updated to reflect these changes.",
        market: "Market positioning and competitive strategy should be evaluated in light of this scenario.",
        recommendations:
          "Consider developing contingency plans and maintaining open communication with stakeholders while monitoring key metrics closely.",
      }
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("What-if analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze scenario" }, { status: 500 })
  }
}
