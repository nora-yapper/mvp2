import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { startupArea } = await request.json()

  // Simulate startup area analysis
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json({
    description: `Simulated analysis for: ${startupArea}. Focus on automation and personalization.`,
    keyMetrics: ["Metric 1", "Metric 2", "Metric 3"],
  })
}
