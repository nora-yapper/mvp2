import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { scenario } = await req.json()

    // Mock response instead of AI-generated content
    const mockAnalysis = {
      analysis: `What-If Scenario Analysis: "${scenario}"

## Scenario Overview
This analysis examines the potential outcomes and implications of the proposed scenario, considering various factors and their interconnected effects.

## Potential Outcomes

### Positive Scenarios (Probability: 60%)
- **Best Case**: Optimal conditions align, leading to exceptional results
- **Expected Case**: Normal progression with anticipated benefits realized
- **Moderate Success**: Partial achievement of objectives with valuable learnings

### Challenging Scenarios (Probability: 40%)
- **Setbacks**: Temporary obstacles that require strategy adjustments
- **Worst Case**: Significant challenges requiring major pivots or reassessment

## Impact Analysis

### Short-term Effects (0-6 months)
- Immediate resource allocation changes
- Stakeholder reaction and adaptation
- Initial performance indicators

### Medium-term Effects (6-18 months)
- Market response and competitive dynamics
- Operational efficiency improvements
- Financial performance impact

### Long-term Effects (18+ months)
- Strategic positioning changes
- Sustainable competitive advantages
- Organizational capability development

## Risk Mitigation Strategies
1. **Contingency Planning**: Prepare alternative approaches for key scenarios
2. **Early Warning Systems**: Establish metrics to detect scenario shifts
3. **Flexible Resource Allocation**: Maintain adaptability in resource deployment
4. **Stakeholder Communication**: Keep all parties informed of scenario developments

## Recommendations
Based on this analysis, proceed with measured optimism while maintaining robust contingency plans and regular scenario reassessment.`,
      probability: {
        success: 0.65,
        partialSuccess: 0.25,
        failure: 0.1,
      },
      keyFactors: ["Market conditions", "Resource availability", "Stakeholder support", "External dependencies"],
      contingencies: [
        "Alternative resource sources",
        "Modified timeline options",
        "Scaled-back scope scenarios",
        "Exit strategy considerations",
      ],
    }

    return NextResponse.json(mockAnalysis)
  } catch (error) {
    console.error("Error in analyze-what-if:", error)
    return NextResponse.json({ error: "Failed to analyze what-if scenario" }, { status: 500 })
  }
}
