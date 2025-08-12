import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { mission } = await req.json()

    // Mock response instead of AI-generated content
    const mockSteps = {
      steps: `Mission Steps for: "${mission}"

## Step 1: Strategic Assessment
**Objective**: Understand current state and define success criteria
- Conduct stakeholder analysis
- Map existing resources and capabilities
- Identify gaps and opportunities
- Set measurable goals and KPIs

## Step 2: Planning & Design
**Objective**: Create comprehensive execution strategy
- Develop detailed project roadmap
- Allocate resources and assign responsibilities
- Create risk management framework
- Establish communication protocols

## Step 3: Implementation
**Objective**: Execute the mission systematically
- Launch pilot programs or initial phases
- Monitor progress against milestones
- Adapt strategy based on real-world feedback
- Maintain stakeholder engagement

## Step 4: Optimization
**Objective**: Refine and scale successful elements
- Analyze performance data and outcomes
- Implement improvements and best practices
- Scale successful initiatives
- Document lessons learned

## Step 5: Sustainability
**Objective**: Ensure long-term success and continuity
- Establish ongoing governance structures
- Create knowledge transfer processes
- Build capability for future iterations
- Measure and report on long-term impact

Each step builds upon the previous one, creating a robust foundation for mission success.`,
      totalSteps: 5,
      estimatedDuration: "12-16 weeks",
      keyMilestones: [
        "Strategic assessment complete",
        "Implementation plan approved",
        "Pilot launch successful",
        "Full deployment achieved",
        "Sustainability measures in place",
      ],
    }

    return NextResponse.json(mockSteps)
  } catch (error) {
    console.error("Error in generate-mission-steps:", error)
    return NextResponse.json({ error: "Failed to generate mission steps" }, { status: 500 })
  }
}
