import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { area, context } = await request.json()

    if (!area) {
      return NextResponse.json({ error: "Area is required" }, { status: 400 })
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
              "You are a startup advisor. Analyze the given startup area and provide insights on current state, challenges, opportunities, and recommendations.",
          },
          {
            role: "user",
            content: `Analyze this startup area: ${area}. Context: ${JSON.stringify(context)}`,
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
    const analysis = data.choices[0]?.message?.content || "Unable to analyze the area."

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Startup area analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze startup area" }, { status: 500 })
  }
}
