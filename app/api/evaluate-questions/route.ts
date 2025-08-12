import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { questions, context } = await request.json()

    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: "Questions array is required" }, { status: 400 })
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
              "You are a startup advisor. Evaluate interview questions and provide insights on their effectiveness, relevance, and potential improvements.",
          },
          {
            role: "user",
            content: `Evaluate these interview questions: ${JSON.stringify(questions)}. Context: ${JSON.stringify(context)}`,
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
    const evaluation = data.choices[0]?.message?.content || "Unable to evaluate questions."

    return NextResponse.json({ evaluation })
  } catch (error) {
    console.error("Question evaluation error:", error)
    return NextResponse.json({ error: "Failed to evaluate questions" }, { status: 500 })
  }
}
