import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { area } = await request.json()

    if (!area || typeof area !== "string") {
      return NextResponse.json({ error: "Area is required and must be a string" }, { status: 400 })
    }

    const openaiApiKey = process.env.OPENAI_API_KEY

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
            content: `You are an expert startup advisor and analyst. You provide concise, actionable analysis of specific startup areas. Your responses should be:
            - 2-3 sentences maximum
            - Focused on the specific area mentioned
            - Include both current assessment and actionable recommendations
            - Professional but encouraging tone
            - Specific and practical advice`,
          },
          {
            role: "user",
            content: `Analyze the "${area}" aspect of a startup. Provide a brief assessment covering current state and key recommendations for improvement in this specific area.`,
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
    const analysis = data.choices[0]?.message?.content || "Unable to generate analysis"

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Error analyzing startup area:", error)
    return NextResponse.json({ error: "Failed to analyze startup area" }, { status: 500 })
  }
}
