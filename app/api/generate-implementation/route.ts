import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Handle both old format (task, context) and new format (suggestion, teamMembers)
    let suggestion, teamMembers, task, context

    if (body.suggestion) {
      // New format from forecast page
      suggestion = body.suggestion
      teamMembers = body.teamMembers || []
    } else if (body.task) {
      // Old format - convert to new format
      task = body.task
      context = body.context
      suggestion = {
        title: task,
        description: context || "Implementation needed",
        type: "opportunity",
      }
      teamMembers = []
    } else {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    if (!suggestion || !suggestion.title) {
      return NextResponse.json({ error: "Suggestion with title is required" }, { status: 400 })
    }

    // Token checks disabled for unlimited usage

    // Create team context
    const teamContext =
      teamMembers.length > 0
        ? `Team members: ${teamMembers.map((m: any) => `${m.name} (${m.role})`).join(", ")}`
        : "Small startup team"

    const prompt = `You are a startup advisor helping create actionable implementation steps.

Suggestion to implement: "${suggestion.title}"
Description: "${suggestion.description}"
${teamContext}

Create 3-5 specific, actionable steps that a startup can implement immediately. Each step should be:
- Practical and achievable for a small startup
- Cost-effective (prefer free/low-cost solutions)
- Have a realistic timeline
- Be assignable to a team member

For each step, provide:
- task: A clear, specific action item
- assignee: Suggest which type of role should handle this (or "Founder" if unclear)
- deadline: A realistic date in YYYY-MM-DD format (within next 2-4 weeks)

IMPORTANT: Respond with ONLY raw JSON, no markdown formatting, no code blocks, no explanations. Just the JSON object:

{
  "steps": [
    {
      "task": "specific action description",
      "assignee": "role or name",
      "deadline": "2025-09-15"
    }
  ]
}`

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
    const text = data.choices[0].message.content

    // Clean the response text and try to parse JSON
    let steps
    try {
      // Remove any markdown code block formatting
      let cleanedText = text.trim()

      // Remove \`\`\`json and \`\`\` if present
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/\s*```$/, "")
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/^```\s*/, "").replace(/\s*```$/, "")
      }

      // Remove any leading/trailing whitespace
      cleanedText = cleanedText.trim()

      const parsed = JSON.parse(cleanedText)
      steps = parsed.steps || []
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError)
      console.error("Raw AI response:", text)

      // Fallback: create steps based on suggestion type
      steps = createFallbackSteps(suggestion, teamMembers)
    }

    // Ensure we have valid steps
    if (!Array.isArray(steps) || steps.length === 0) {
      steps = createFallbackSteps(suggestion, teamMembers)
    }

    // Validate and clean up steps
    const validSteps = steps.map((step: any, index: number) => ({
      task: step.task || `Complete action for: ${suggestion.title}`,
      assignee: step.assignee || (teamMembers.length > 0 ? teamMembers[0].name : "Founder"),
      deadline: step.deadline || getDefaultDeadline(index + 1),
    }))

    return NextResponse.json({ steps: validSteps })
  } catch (error) {
    console.error("Error generating implementation:", error)
    return NextResponse.json({ error: "Failed to generate implementation" }, { status: 500 })
  }
}

function createFallbackSteps(suggestion: any, teamMembers: any[]) {
  const getAssignee = (preferredRole?: string) => {
    if (teamMembers.length === 0) return "Founder"

    if (preferredRole) {
      const member = teamMembers.find(
        (m: any) =>
          m.role.toLowerCase().includes(preferredRole.toLowerCase()) ||
          m.skills?.some((skill: string) => skill.toLowerCase().includes(preferredRole.toLowerCase())),
      )
      if (member) return member.name
    }

    return teamMembers[0].name
  }

  // Create fallback steps based on suggestion type and content
  if (suggestion.id === "techcrunch" || suggestion.title.toLowerCase().includes("techcrunch")) {
    return [
      {
        task: "Research TechCrunch Disrupt application requirements and deadlines",
        assignee: getAssignee("ceo"),
        deadline: "2025-09-01",
      },
      {
        task: "Create compelling 10-slide pitch deck highlighting unique value proposition",
        assignee: getAssignee("design"),
        deadline: "2025-09-05",
      },
      {
        task: "Record professional 3-minute product demo video",
        assignee: getAssignee("cto"),
        deadline: "2025-09-08",
      },
      {
        task: "Submit application and leverage network for introductions",
        assignee: getAssignee("ceo"),
        deadline: "2025-09-12",
      },
    ]
  } else if (suggestion.id === "fundraising" || suggestion.title.toLowerCase().includes("fundraising")) {
    return [
      {
        task: "Build comprehensive financial model with 18-month projections",
        assignee: getAssignee("ceo"),
        deadline: "2025-09-05",
      },
      {
        task: "Create investor-ready pitch deck with market analysis",
        assignee: getAssignee("design"),
        deadline: "2025-09-10",
      },
      {
        task: "Research and identify 20+ relevant investors using AngelList",
        assignee: getAssignee("business"),
        deadline: "2025-09-08",
      },
      {
        task: "Reach out to warm connections for investor introductions",
        assignee: getAssignee("ceo"),
        deadline: "2025-09-15",
      },
    ]
  } else if (suggestion.id === "vision" || suggestion.title.toLowerCase().includes("vision")) {
    return [
      {
        task: "Conduct anonymous team survey about company direction and goals",
        assignee: getAssignee("ceo"),
        deadline: "2025-09-03",
      },
      {
        task: "Schedule and facilitate team alignment workshop",
        assignee: getAssignee("ceo"),
        deadline: "2025-09-06",
      },
      {
        task: "Draft clear company mission statement and 2025 objectives",
        assignee: getAssignee("ceo"),
        deadline: "2025-09-10",
      },
      {
        task: "Create visual roadmap and communicate to all stakeholders",
        assignee: getAssignee("design"),
        deadline: "2025-09-12",
      },
    ]
  }

  // Generic fallback
  return [
    {
      task: `Analyze and define specific requirements for: ${suggestion.title}`,
      assignee: getAssignee("ceo"),
      deadline: "2025-09-01",
    },
    {
      task: `Create implementation plan and timeline`,
      assignee: getAssignee("ceo"),
      deadline: "2025-09-05",
    },
    {
      task: `Execute first phase of implementation`,
      assignee: getAssignee(),
      deadline: "2025-09-10",
    },
  ]
}

function getDefaultDeadline(weekOffset: number): string {
  const date = new Date()
  date.setDate(date.getDate() + weekOffset * 7)
  return date.toISOString().split("T")[0]
}
