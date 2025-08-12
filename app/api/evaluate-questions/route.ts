import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { questions } = await request.json()

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: "Questions array is required" }, { status: 400 })
    }

    // Mock evaluation instead of AI SDK
    const evaluations = questions.map((question: string, index: number) => {
      const questionLower = question.toLowerCase()

      const isHypothetical =
        questionLower.includes("would you") ||
        questionLower.includes("do you think") ||
        questionLower.includes("would this") ||
        questionLower.includes("if you") ||
        questionLower.includes("imagine")

      const isLeading =
        questionLower.includes("don't you think") ||
        questionLower.includes("wouldn't you agree") ||
        questionLower.includes("isn't it true") ||
        questionLower.includes("do you agree")

      const isYesNo =
        questionLower.startsWith("do you") ||
        questionLower.startsWith("are you") ||
        questionLower.startsWith("will you") ||
        questionLower.startsWith("can you") ||
        questionLower.startsWith("have you")

      const isBehavioral =
        questionLower.includes("tell me about") ||
        questionLower.includes("describe") ||
        questionLower.includes("walk me through") ||
        questionLower.includes("last time you") ||
        questionLower.includes("when did you")

      const isOpenEnded =
        questionLower.includes("how do you") ||
        questionLower.includes("what do you") ||
        questionLower.includes("why do you") ||
        questionLower.includes("what's the") ||
        questionLower.includes("how would you describe")

      const isProblemFocused =
        questionLower.includes("problem") ||
        questionLower.includes("challenge") ||
        questionLower.includes("difficult") ||
        questionLower.includes("frustrating") ||
        questionLower.includes("pain")

      const hasGoodPatterns = isBehavioral || isOpenEnded || isProblemFocused
      const hasBadPatterns = isHypothetical || isLeading || isYesNo
      const isStrong = hasGoodPatterns && !hasBadPatterns

      let reasoning = ""
      if (isStrong) {
        if (isBehavioral) reasoning = "This question encourages specific, behavioral responses about past actions."
        else if (isOpenEnded) reasoning = "This is an open-ended question that invites detailed responses."
        else if (isProblemFocused) reasoning = "This question focuses on real problems and pain points."
        else reasoning = "This question follows good interview practices."
      } else {
        if (isHypothetical) reasoning = "This question is hypothetical and may not reveal actual behavior patterns."
        else if (isLeading) reasoning = "This is a leading question that may bias the response."
        else if (isYesNo) reasoning = "This question may lead to yes/no answers rather than detailed insights."
        else reasoning = "This question could be improved to be more open-ended and behavioral."
      }

      let responseType = ""
      if (isBehavioral) responseType = "Specific behavioral examples and past experiences"
      else if (isHypothetical) responseType = "Hypothetical opinions and speculation"
      else if (isYesNo) responseType = "Short yes/no answers with limited detail"
      else if (isOpenEnded) responseType = "Detailed explanations and insights"
      else responseType = "General responses"

      let improvement = null
      if (!isStrong) {
        if (isHypothetical) {
          improvement =
            "Try rephrasing to focus on past behavior: 'Tell me about the last time you...' or 'Describe a situation when you...'"
        } else if (isLeading) {
          improvement =
            "Remove the leading aspect and ask neutrally: 'How do you feel about...' or 'What's your experience with...'"
        } else if (isYesNo) {
          improvement = "Make it open-ended: 'How do you currently handle...' or 'What's your process for...'"
        } else {
          improvement =
            "Consider making it more behavioral and specific: 'Tell me about a time when...' or 'Walk me through how you...'"
        }
      }

      return {
        question,
        score: Math.floor(Math.random() * 40) + 60,
        feedback: [
          "Consider making this more specific",
          "Good question - very relevant",
          "This could be more actionable",
          "Excellent insight potential",
        ][index % 4],
        category: ["market", "product", "business model", "team"][index % 4],
        isStrong,
        reasoning,
        responseType,
        improvement,
      }
    })

    return NextResponse.json({ evaluations })
  } catch (error) {
    console.error("Error in evaluate-questions API:", error)
    return NextResponse.json({ error: "Failed to evaluate questions" }, { status: 500 })
  }
}
