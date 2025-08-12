import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { questions } = await req.json()

    // Mock response instead of AI-generated content
    const mockEvaluation = {
      evaluation: `Question Evaluation Results:

**Overall Assessment**: The questions provided demonstrate good strategic thinking and cover important areas for consideration.

**Strengths**:
- Clear and focused inquiries
- Relevant to current objectives
- Actionable scope for responses

**Areas for Enhancement**:
- Consider adding timeline-specific questions
- Include stakeholder impact considerations
- Add measurable outcome criteria

**Recommended Next Steps**:
1. Prioritize questions by urgency and impact
2. Assign ownership for each question area
3. Set deadlines for responses
4. Create follow-up action items

**Quality Score**: 8.5/10

These questions provide a solid foundation for moving forward with your initiative.`,
      score: 8.5,
      recommendations: [
        "Add timeline considerations to each question",
        "Include resource requirement assessments",
        "Consider stakeholder perspectives",
      ],
      prioritizedQuestions: questions.map((q: string, index: number) => ({
        question: q,
        priority: index < 3 ? "High" : "Medium",
        category: "Strategic",
      })),
    }

    return NextResponse.json(mockEvaluation)
  } catch (error) {
    console.error("Error in evaluate-questions:", error)
    return NextResponse.json({ error: "Failed to evaluate questions" }, { status: 500 })
  }
}
