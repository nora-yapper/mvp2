import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { suggestion, teamMembers } = await request.json()

    if (!suggestion) {
      return NextResponse.json({ error: "Suggestion is required" }, { status: 400 })
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
              "You are a startup advisor. Generate practical, actionable implementation steps for startup suggestions. Focus on low-cost, high-impact actions suitable for early-stage startups.",
          },
          {
            role: "user",
            content: `Generate 3-5 implementation steps for this suggestion: "${suggestion.title}". Description: "${suggestion.description}". Available team members: ${JSON.stringify(teamMembers)}. Each step should include: task description, assignee, deadline, and priority level.`,
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
    const content = data.choices[0]?.message?.content || "Unable to generate implementation steps."

    // Parse the response into structured steps
    const steps = parseImplementationSteps(content, teamMembers)

    return NextResponse.json({ steps })
  } catch (error) {
    console.error("Implementation generation error:", error)
    return NextResponse.json({ error: "Failed to generate implementation steps" }, { status: 500 })
  }
}

function parseImplementationSteps(content: string, teamMembers: any[]) {
  // Simple parsing - in a real app, you'd want more sophisticated parsing
  const lines = content.split("\n").filter((line) => line.trim())
  const steps = []

  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i]
    if (line.includes(".") || line.includes("-")) {
      steps.push({
        task: line.replace(/^\d+\.?\s*-?\s*/, "").trim(),
        assignee: teamMembers[i % teamMembers.length]?.name || "Team Lead",
        deadline: getDeadline(i + 1),
        priority: i < 2 ? "High" : i < 4 ? "Medium" : "Low",
      })
    }
  }

  return steps.length > 0
    ? steps
    : [
        {
          task: "Complete the suggested action",
          assignee: teamMembers[0]?.name || "Team Lead",
          deadline: getDeadline(1),
          priority: "High",
        },
      ]
}

function getDeadline(weekOffset: number): string {
  const date = new Date()
  date.setDate(date.getDate() + weekOffset * 7)
  return date.toISOString().split("T")[0]
}
