import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { problem } = await request.json()

    if (!problem) {
      return NextResponse.json({ error: "Problem description is required" }, { status: 400 })
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
              "You are a startup advisor. Analyze the given problem and provide structured insights including root causes, impact assessment, and actionable recommendations.",
          },
          {
            role: "user",
            content: `Analyze this startup problem: ${problem}`,
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
    const analysis = data.choices[0]?.message?.content || "Unable to analyze the problem."

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Problem analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze problem" }, { status: 500 })
  }
}
