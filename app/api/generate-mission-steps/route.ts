import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { mission, timeframe, accomplished } = await request.json()

    if (!mission) {
      return NextResponse.json({ error: "Mission description is required" }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    // Parse accomplished items
    const accomplishedList = Array.isArray(accomplished)
      ? accomplished
      : accomplished
        ? accomplished
            .split("\n")
            .map((item: string) => item.trim())
            .filter((item: string) => item.length > 0)
        : []

    // Create detailed prompt for OpenAI
    const prompt = `You are an expert startup advisor and business strategist. Your task is to analyze a user's mission and provide 3-5 immediately actionable, concrete steps that will move them closer to their goal.

CONTEXT:
- Mission/Goal: ${mission}
${timeframe ? `- Timeline/Deadline: ${timeframe}` : ""}
${accomplishedList.length > 0 ? `- Already Accomplished: ${accomplishedList.join(", ")}` : ""}

INSTRUCTIONS:
1. Generate 3-5 immediately actionable, concrete steps (not generic advice)
2. Each step should be specific, measurable, and executable
3. Customize steps based on the exact mission, timeline, and accomplished work
4. Don't repeat or suggest things already accomplished
5. Include specific numbers, tools, timeframes where relevant
6. Focus on the NEXT logical steps given their current progress

EXAMPLES OF GOOD STEPS:
- "Write 8-10 specific research questions for customer interviews focusing on pain points and willingness to pay"
- "Create a list of 50 potential customers with contact details using LinkedIn Sales Navigator"
- "Build a landing page with email capture and drive 100 signups using $200 Facebook ads"

EXAMPLES OF BAD STEPS (too generic):
- "Do market research"
- "Build your product"
- "Find customers"

Return your response in this exact JSON format:
{
  "steps": [
    {
      "id": 1,
      "title": "Specific Action Title",
      "description": "Detailed description of exactly what to do, including tools, numbers, and expected outcomes",
      "duration": "Realistic time estimate",
      "priority": "critical|high|medium"
    }
  ],
  "total_estimated_duration": "Overall timeline estimate"
}`

    // Call OpenAI API
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
              "You are an expert startup advisor who provides specific, actionable business advice. Always respond with valid JSON in the exact format requested.",
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
      console.error("OpenAI API error:", response.status, response.statusText)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error("No response from OpenAI")
    }

    // Parse the JSON response from OpenAI
    let parsedResponse
    try {
      parsedResponse = JSON.parse(aiResponse)
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", aiResponse)
      throw new Error("Invalid JSON response from OpenAI")
    }

    // Validate and format the response
    const steps = parsedResponse.steps || []
    if (!Array.isArray(steps) || steps.length === 0) {
      throw new Error("Invalid steps format from OpenAI")
    }

    // Ensure steps have required fields
    const formattedSteps = steps.map((step: any, index: number) => ({
      id: step.id || index + 1,
      title: step.title || `Step ${index + 1}`,
      description: step.description || "No description provided",
      duration: step.duration || "TBD",
      priority: step.priority?.toLowerCase() || "medium",
    }))

    return NextResponse.json({
      mission,
      timeframe: timeframe || parsedResponse.total_estimated_duration || "2-4 weeks",
      steps: formattedSteps,
      total_estimated_duration: parsedResponse.total_estimated_duration || timeframe || "2-4 weeks",
      source: "openai",
    })
  } catch (error) {
    console.error("Error in generate-mission-steps:", error)

    // Fallback response if OpenAI fails
    const fallbackSteps = [
      {
        id: 1,
        title: "Break Down Your Mission Into Specific Tasks",
        description:
          "List 10 specific, measurable tasks needed to achieve your goal. Make each task actionable with clear success criteria.",
        duration: "2 hours",
        priority: "high",
      },
      {
        id: 2,
        title: "Identify and Complete Your Highest-Impact Task Today",
        description:
          "From your task list, choose the one task that will move you closest to your goal and complete it before doing anything else.",
        duration: "2-4 hours",
        priority: "critical",
      },
      {
        id: 3,
        title: "Set Up Daily Progress Tracking System",
        description:
          "Create a simple spreadsheet or use a tool like Notion to track what you accomplish each day toward your mission.",
        duration: "30 minutes",
        priority: "medium",
      },
    ]

    const mission = "Mission Analysis" // Declare mission variable here

    return NextResponse.json({
      mission,
      timeframe: "1-2 weeks",
      steps: fallbackSteps,
      total_estimated_duration: "1-2 weeks",
      source: "fallback",
      error: "OpenAI API unavailable, using fallback response",
    })
  }
}
