import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { area } = await request.json()

    if (!area) {
      return NextResponse.json({ error: "Startup area is required" }, { status: 400 })
    }

    // Mock response instead of AI SDK
    const analysis = {
      area,
      description: "",
      market_size: ["Large", "Medium", "Niche"][Math.floor(Math.random() * 3)],
      competition_level: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
      entry_barriers: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
      growth_potential: Math.floor(Math.random() * 40) + 60,
      key_challenges: [
        "Market education required",
        "High customer acquisition cost",
        "Regulatory compliance",
        "Technical complexity",
      ].slice(0, Math.floor(Math.random() * 3) + 1),
      opportunities: [
        "Emerging market trends",
        "Technology advancement",
        "Changing consumer behavior",
        "Regulatory changes",
      ].slice(0, Math.floor(Math.random() * 3) + 1),
      recommended_approach: "Start with MVP and validate core assumptions through user testing",
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Error analyzing startup area:", error)
    return NextResponse.json({ error: "Failed to analyze startup area" }, { status: 500 })
  }
}
