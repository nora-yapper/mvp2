export async function POST(request: Request) {
  try {
    const { mission, timeframe, accomplished } = await request.json()

    if (!mission || mission.trim().length === 0) {
      return Response.json({ error: "Mission is required" }, { status: 400 })
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.log("No OpenAI API key found, using fallback")
      return getFallbackResponse(mission, timeframe, accomplished)
    }

    try {
      // Create detailed prompt for OpenAI
      const prompt = createOpenAIPrompt(mission, timeframe, accomplished)

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
                "You are a startup advisor who generates specific, actionable steps to help entrepreneurs achieve their goals. Always respond with valid JSON in the exact format requested.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1500,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      const aiResponse = data.choices[0]?.message?.content

      if (!aiResponse) {
        throw new Error("No response from OpenAI")
      }

      // Parse the AI response
      let parsedResponse
      try {
        parsedResponse = JSON.parse(aiResponse)
      } catch (parseError) {
        console.error("Failed to parse OpenAI response:", parseError)
        throw new Error("Invalid JSON response from AI")
      }

      // Validate and format the response
      const formattedSteps = validateAndFormatSteps(parsedResponse.steps || [])

      return Response.json({
        steps: formattedSteps,
        source: "openai",
        total_estimated_duration: parsedResponse.total_estimated_duration || "2-4 weeks",
      })
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError)
      return getFallbackResponse(mission, timeframe, accomplished)
    }
  } catch (error) {
    console.error("API route error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

function createOpenAIPrompt(mission: string, timeframe?: string, accomplished?: string[]) {
  const prompt = `
MISSION: ${mission}
${timeframe ? `TIMELINE/DEADLINE: ${timeframe}` : ""}
${accomplished && accomplished.length > 0 ? `ALREADY ACCOMPLISHED:\n${accomplished.map((item) => `- ${item}`).join("\n")}` : ""}

Generate 3-5 immediately actionable, concrete steps that will move the user closer to their goal. Each step must be:

1. SPECIFIC - Include exact numbers, tools, deliverables
2. ACTIONABLE - Something they can start doing today
3. CONTEXTUAL - Tailored to their exact mission and progress
4. MEASURABLE - Clear success criteria

GOOD EXAMPLES:
- "Write 8-10 specific research questions focusing on pain points and willingness to pay"
- "Create a list of 50 potential customers with contact details using LinkedIn Sales Navigator"
- "Build a landing page with email signup and run $100 Facebook ad to get 100 signups"

BAD EXAMPLES (avoid these):
- "Do market research"
- "Build your product" 
- "Create a marketing strategy"

Consider what they've already accomplished to avoid repetitive suggestions.

Respond ONLY with valid JSON in this exact format:
{
  "steps": [
    {
      "id": 1,
      "title": "Specific Action Title",
      "description": "Detailed description with tools, numbers, and expected outcomes",
      "duration": "Realistic time estimate (e.g., '2-3 hours', '1 week', '3 days')",
      "priority": "critical|high|medium"
    }
  ],
  "total_estimated_duration": "Overall timeline estimate"
}
`

  return prompt
}

function validateAndFormatSteps(steps: any[]) {
  if (!Array.isArray(steps)) {
    return getDefaultFallbackSteps()
  }

  return steps.slice(0, 5).map((step, index) => ({
    id: step.id || index + 1,
    title: step.title || `Action Step ${index + 1}`,
    description: step.description || "Complete this important task",
    duration: step.duration || "1-2 weeks",
    priority: ["critical", "high", "medium"].includes(step.priority) ? step.priority : "medium",
  }))
}

function getFallbackResponse(mission: string, timeframe?: string, accomplished?: string[]) {
  const fallbackSteps = getContextualFallbackSteps(mission, timeframe, accomplished)

  return Response.json({
    steps: fallbackSteps,
    source: "fallback",
    total_estimated_duration: timeframe || "2-4 weeks",
  })
}

function getContextualFallbackSteps(mission: string, timeframe?: string, accomplished?: string[]) {
  const missionLower = mission.toLowerCase()
  const accomplishedSet = new Set(accomplished?.map((item) => item.toLowerCase()) || [])

  // Customer interview specific steps
  if (missionLower.includes("interview") || missionLower.includes("customer research")) {
    return [
      {
        id: 1,
        title: "Write 8-10 Research Questions",
        description: "Create specific questions focusing on pain points, current solutions, and willingness to pay",
        duration: "2-3 hours",
        priority: "critical",
      },
      {
        id: 2,
        title: "Build List of 30 Target Interviewees",
        description: "Use LinkedIn, industry forums, and your network to identify and contact potential interviewees",
        duration: "1 day",
        priority: "high",
      },
      {
        id: 3,
        title: "Schedule First 5 Interviews This Week",
        description: "Send personalized outreach messages and use Calendly to book 30-minute interviews",
        duration: "3-4 hours",
        priority: "high",
      },
    ]
  }

  // MVP/Product building
  if (missionLower.includes("mvp") || missionLower.includes("build") || missionLower.includes("develop")) {
    return [
      {
        id: 1,
        title: "Define Core Feature Set (Maximum 3)",
        description: "List the 3 most essential features for your MVP - avoid feature creep",
        duration: "4-6 hours",
        priority: "critical",
      },
      {
        id: 2,
        title: "Choose Tech Stack and Set Up Environment",
        description: "Select frameworks, set up development environment, and create project structure",
        duration: "1-2 days",
        priority: "high",
      },
      {
        id: 3,
        title: "Build Version 0.1 This Week",
        description: "Create basic working version with core feature - focus on functionality over design",
        duration: "1 week",
        priority: "high",
      },
    ]
  }

  // Launch/Marketing
  if (missionLower.includes("launch") || missionLower.includes("marketing") || missionLower.includes("promote")) {
    return [
      {
        id: 1,
        title: "Create Pre-Launch Timeline with 10 Tasks",
        description:
          "Break down launch into specific tasks with deadlines - include content, outreach, and technical prep",
        duration: "3-4 hours",
        priority: "critical",
      },
      {
        id: 2,
        title: "Build Email List of 100 Interested Users",
        description: "Create landing page with email signup and share in relevant communities",
        duration: "1-2 weeks",
        priority: "high",
      },
      {
        id: 3,
        title: "Prepare Launch Day Content",
        description: "Write social media posts, press release, and Product Hunt submission",
        duration: "2-3 days",
        priority: "medium",
      },
    ]
  }

  // Sales/Revenue
  if (missionLower.includes("sales") || missionLower.includes("revenue") || missionLower.includes("customers")) {
    return [
      {
        id: 1,
        title: "Create List of 50 Potential Customers",
        description: "Research and compile contact details of ideal customers using LinkedIn and industry directories",
        duration: "1-2 days",
        priority: "critical",
      },
      {
        id: 2,
        title: "Write 3 Email Templates",
        description: "Create templates for cold outreach, follow-up, and proposal emails",
        duration: "3-4 hours",
        priority: "high",
      },
      {
        id: 3,
        title: "Send 10 Personalized Emails Daily",
        description: "Customize templates and send targeted outreach emails to potential customers",
        duration: "1 hour daily",
        priority: "high",
      },
    ]
  }

  // Default generic but actionable steps
  return getDefaultFallbackSteps()
}

function getDefaultFallbackSteps() {
  return [
    {
      id: 1,
      title: "Define Your Success Metrics",
      description: "Identify 3 specific, measurable outcomes that will indicate progress toward your goal",
      duration: "2-3 hours",
      priority: "critical",
    },
    {
      id: 2,
      title: "Create Weekly Action Plan",
      description: "Break down your mission into weekly milestones with specific deliverables",
      duration: "1-2 hours",
      priority: "high",
    },
    {
      id: 3,
      title: "Set Up Progress Tracking System",
      description: "Choose a tool (Notion, Trello, or spreadsheet) to track daily progress and metrics",
      duration: "1 hour",
      priority: "medium",
    },
  ]
}
