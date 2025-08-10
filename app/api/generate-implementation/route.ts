import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { suggestion } = await req.json()

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
            content: `You are an expert startup advisor with deep experience in early-stage companies (pre-Series A, 2-20 employees). 

CRITICAL STARTUP CONTEXT:
- Limited resources and budget constraints
- Small team wearing multiple hats
- Need for rapid execution and iteration
- Focus on lean, scrappy solutions over enterprise approaches
- Emphasis on speed-to-market and customer validation
- Bootstrap mentality - do more with less

RESPONSE FORMAT:
Respond with ONLY a JSON array of 3-5 actionable steps. Each step must be:
- Specific and immediately actionable
- Appropriate for startup resource constraints
- Realistic for small teams
- Cost-effective or free when possible
- Focused on high-impact, low-effort wins

JSON FORMAT:
[
  {
    "task": "Specific task description (startup-appropriate)",
    "assignee": "Realistic role for small startup (CEO, Founder, Lead Developer, etc.)",
    "deadline": "YYYY-MM-DD format - realistic startup timeline"
  }
]

STARTUP-SPECIFIC GUIDELINES:
- Suggest free/low-cost tools and platforms
- Recommend leveraging existing networks and relationships
- Focus on MVP approaches and rapid testing
- Emphasize personal founder involvement
- Consider resource constraints in timing
- Prioritize revenue-generating activities
- Suggest scrappy, creative solutions over expensive ones`,
          },
          {
            role: "user",
            content: `Generate startup-appropriate implementation steps for this ${suggestion.type}:

TITLE: ${suggestion.title}
DESCRIPTION: ${suggestion.description}
${suggestion.deadline ? `DEADLINE: ${suggestion.deadline}` : ""}
${suggestion.priority ? `PRIORITY: ${suggestion.priority}` : ""}

Remember: This is for a small startup team, not a large corporation. Focus on lean, scrappy, high-impact actions that a resource-constrained team can realistically execute.`,
          },
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content || ""

    // Parse the JSON response
    let steps = []
    try {
      // Extract JSON from the response if it's wrapped in text
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        steps = JSON.parse(jsonMatch[0])
      } else {
        steps = JSON.parse(aiResponse)
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError)
      // Return error for fallback handling
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 })
    }

    return NextResponse.json({ steps })
  } catch (error) {
    console.error("Implementation generation error:", error)
    return NextResponse.json({ error: "Failed to generate implementation steps" }, { status: 500 })
  }
}
