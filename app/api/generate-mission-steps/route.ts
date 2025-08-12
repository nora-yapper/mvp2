import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { mission, teamMembers } = await request.json()

    if (!mission) {
      return NextResponse.json({ error: "Mission is required" }, { status: 400 })
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
              "You are a startup advisor. Break down missions into actionable steps. Each step should be specific, measurable, and assignable to team members based on their skills.",
          },
          {
            role: "user",
            content: `Break down this mission into 4-6 actionable steps: "${mission}". Team members: ${JSON.stringify(teamMembers)}. For each step, provide: title, description, assignee (match to team member skills), deadline, priority (High/Medium/Low), and category.`,
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
    const content = data.choices[0]?.message?.content || "Unable to generate mission steps."

    // Parse the response into structured steps
    const steps = parseMissionSteps(content, teamMembers)

    return NextResponse.json({ steps })
  } catch (error) {
    console.error("Mission steps generation error:", error)
    return NextResponse.json({ error: "Failed to generate mission steps" }, { status: 500 })
  }
}

function parseMissionSteps(content: string, teamMembers: any[]) {
  // Simple parsing - extract steps from the response
  const lines = content.split("\n").filter((line) => line.trim())
  const steps = []

  for (let i = 0; i < Math.min(6, lines.length); i++) {
    const line = lines[i]
    if (line.includes(".") || line.includes("-")) {
      const cleanLine = line.replace(/^\d+\.?\s*-?\s*/, "").trim()
      steps.push({
        title: cleanLine.split(":")[0] || cleanLine.substring(0, 50),
        description: cleanLine.split(":")[1] || cleanLine,
        assignee: assignToTeamMember(cleanLine, teamMembers),
        deadline: getDeadline(i + 1),
        priority: i < 2 ? "High" : i < 4 ? "Medium" : "Low",
        category: getCategoryFromContent(cleanLine),
      })
    }
  }

  return steps.length > 0
    ? steps
    : [
        {
          title: "Execute Mission Plan",
          description: "Complete the mission objectives",
          assignee: teamMembers[0]?.name || "Team Lead",
          deadline: getDeadline(1),
          priority: "High",
          category: "General",
        },
      ]
}

function assignToTeamMember(task: string, teamMembers: any[]): string {
  const taskLower = task.toLowerCase()

  // Simple skill matching
  for (const member of teamMembers) {
    const skills = member.skills?.map((s: string) => s.toLowerCase()) || []
    if (skills.some((skill: string) => taskLower.includes(skill))) {
      return member.name
    }
  }

  return teamMembers[0]?.name || "Team Lead"
}

function getCategoryFromContent(content: string): string {
  const contentLower = content.toLowerCase()
  if (contentLower.includes("market") || contentLower.includes("customer")) return "Marketing"
  if (contentLower.includes("develop") || contentLower.includes("build")) return "Development"
  if (contentLower.includes("design") || contentLower.includes("ui")) return "Design"
  if (contentLower.includes("fund") || contentLower.includes("money")) return "Finance"
  return "General"
}

function getDeadline(weekOffset: number): string {
  const date = new Date()
  date.setDate(date.getDate() + weekOffset * 7)
  return date.toISOString().split("T")[0]
}
