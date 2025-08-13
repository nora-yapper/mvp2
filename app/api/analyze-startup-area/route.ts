import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { area } = await request.json()

    if (!area) {
      return NextResponse.json({ error: "Area description is required" }, { status: 400 })
    }

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
            content: `You are an AI startup advisor analyzing specific areas of a startup's health. Generate a concise analysis (maximum 4 sentences) that:
            1. Summarizes the current state of the specified area
            2. Highlights what's going well
            3. Identifies key challenges or gaps
            4. Suggests 1-2 specific, actionable improvements
            
            Use placeholder data and realistic startup scenarios. Be encouraging but honest about areas needing improvement. Focus on practical, implementable advice.`,
          },
          {
            role: "user",
            content: `Analyze this area of my startup: ${area}`,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const analysis = data.choices[0]?.message?.content || "Unable to generate analysis at this time."

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Error analyzing startup area:", error)

    // Fallback response if OpenAI fails
    const fallbackAnalysis =
      "I'm currently having trouble connecting to generate your analysis. Please try again in a moment, or feel free to ask me specific questions about your startup area in the chat below."

    return NextResponse.json({ analysis: fallbackAnalysis })
  }
}
