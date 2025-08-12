import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { mission, teamMembers } = await request.json()

    if (!mission) {
      return NextResponse.json({ error: "Mission description is required" }, { status: 400 })
    }

    // Simulate mission step generation
    await new Promise((resolve) => setTimeout(resolve, 500))

    const steps = [
      {
        title: "Step 1",
        description: "Do this",
        assignee: teamMembers[0]?.name || "Assignee",
        deadline: "2025-08-15",
        priority: "High",
        category: "General",
      },
      {
        title: "Step 2",
        description: "Do that",
        assignee: teamMembers[1]?.name || "Assignee",
        deadline: "2025-08-22",
        priority: "Medium",
        category: "General",
      },
    ]

    return NextResponse.json({
      mission,
      steps,
    })
  } catch (error) {
    console.error("Error generating mission steps:", error)
    return NextResponse.json({ error: "Failed to generate mission steps" }, { status: 500 })
  }
}
