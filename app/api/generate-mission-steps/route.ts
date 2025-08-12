import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { mission, timeframe } = await request.json()

    if (!mission) {
      return NextResponse.json({ error: "Mission description is required" }, { status: 400 })
    }

    // Mock response instead of AI SDK
    const steps = [
      {
        id: 1,
        title: "Define Success Criteria",
        description: "Establish clear, measurable goals for the mission",
        duration: "1 week",
        priority: "high",
      },
      {
        id: 2,
        title: "Resource Planning",
        description: "Identify and allocate necessary resources",
        duration: "2 weeks",
        priority: "high",
      },
      {
        id: 3,
        title: "Execution Phase",
        description: "Implement the core mission activities",
        duration: "4-6 weeks",
        priority: "critical",
      },
      {
        id: 4,
        title: "Monitor & Adjust",
        description: "Track progress and make necessary adjustments",
        duration: "ongoing",
        priority: "medium",
      },
      {
        id: 5,
        title: "Review & Document",
        description: "Evaluate results and document learnings",
        duration: "1 week",
        priority: "medium",
      },
    ]

    return NextResponse.json({
      mission,
      timeframe: timeframe || "8-10 weeks",
      steps,
      total_estimated_duration: "8-10 weeks",
    })
  } catch (error) {
    console.error("Error generating mission steps:", error)
    return NextResponse.json({ error: "Failed to generate mission steps" }, { status: 500 })
  }
}
