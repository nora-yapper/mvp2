import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1]

    // Mock response instead of AI-generated content
    const mockResponse = {
      message: `Thank you for your message: "${lastMessage.content}". 

I understand you're looking for assistance. Here's what I can help you with:

• **Strategic Planning**: Develop comprehensive business strategies
• **Problem Solving**: Analyze complex challenges and provide solutions  
• **Research Support**: Gather and synthesize relevant information
• **Implementation Guidance**: Create actionable steps for your goals

How would you like to proceed? I'm here to help you achieve your objectives.`,
      timestamp: new Date().toISOString(),
      suggestions: [
        "Tell me more about your specific goals",
        "What challenges are you currently facing?",
        "Would you like help with planning or execution?",
      ],
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error("Error in chat:", error)
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}
