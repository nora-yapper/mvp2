import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { area } = await req.json()

    // Mock response instead of AI-generated content
    const mockAnalysis = {
      analysis: `Startup Area Analysis: "${area}"

## Market Opportunity
The ${area} sector presents significant opportunities for innovation and growth. Current market trends indicate strong demand for solutions that address key pain points in this space.

## Competitive Landscape
- **Established Players**: Several mature companies dominate traditional approaches
- **Emerging Competitors**: New entrants are disrupting with innovative solutions
- **Market Gaps**: Opportunities exist for differentiated value propositions

## Key Success Factors
1. **Customer-Centric Approach**: Deep understanding of user needs and behaviors
2. **Technology Innovation**: Leveraging cutting-edge tools and methodologies
3. **Scalable Business Model**: Sustainable unit economics and growth potential
4. **Strong Team**: Experienced founders with relevant domain expertise

## Recommended Strategy
- Focus on underserved market segments
- Build minimum viable product with core features
- Establish strong customer feedback loops
- Develop strategic partnerships for market access

## Risk Considerations
- Market timing and adoption rates
- Regulatory compliance requirements
- Capital requirements for scaling
- Competitive response from incumbents

This analysis provides a foundation for strategic decision-making in the ${area} startup space.`,
      marketSize: "$2.5B+ addressable market",
      competitionLevel: "Moderate to High",
      entryBarriers: ["Capital requirements", "Technical expertise", "Market access", "Regulatory compliance"],
      opportunities: [
        "Underserved customer segments",
        "Technology disruption potential",
        "Partnership opportunities",
        "International expansion",
      ],
    }

    return NextResponse.json(mockAnalysis)
  } catch (error) {
    console.error("Error in analyze-startup-area:", error)
    return NextResponse.json({ error: "Failed to analyze startup area" }, { status: 500 })
  }
}
