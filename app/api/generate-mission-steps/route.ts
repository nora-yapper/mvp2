import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { mission, teamMembers } = await request.json()

    if (!mission || typeof mission !== "string") {
      return NextResponse.json({ error: "Mission is required and must be a string" }, { status: 400 })
    }

    const openaiApiKey = process.env.OPENAI_API_KEY

    if (!openaiApiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    // Validate that the mission is startup/business related
    const validationResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `Analyze this mission statement and determine if it's related to startups, business, entrepreneurship, or professional goals:
            "${mission}"
            
            Respond with only "VALID" if it's business/startup related, or "INVALID" if it's not.`,
          },
        ],
        max_tokens: 10,
        temperature: 0,
      }),
    })

    if (!validationResponse.ok) {
      throw new Error(`OpenAI API error: ${validationResponse.status}`)
    }

    const validationData = await validationResponse.json()
    const validationResult = validationData.choices[0]?.message?.content?.trim()

    if (validationResult !== "VALID") {
      return NextResponse.json(
        { error: "Please provide a startup or business-related mission statement." },
        { status: 400 },
      )
    }

    // Generate actionable steps
    const prompt = `
      You are a startup advisor helping to break down a mission into actionable steps.
      
      Mission: "${mission}"
      
      Available team members:
      ${teamMembers.map((member: any) => `- ${member.name} (${member.role})`).join("\n")}
      
      Generate 4-6 specific, actionable steps to achieve this mission. Each step should:
      1. Be concrete and measurable
      2. Have a realistic timeline
      3. Be assigned to an appropriate team member based on their role
      4. Have a clear priority level
      5. Include a relevant category
      
      Return ONLY a JSON array with this exact structure:
      [
        {
          "title": "Step title",
          "description": "Detailed description of what needs to be done",
          "assignee": "Team member name from the list above",
          "deadline": "YYYY-MM-DD format",
          "priority": "High" | "Medium" | "Low",
          "category": "Category name"
        }
      ]
      
      Make sure deadlines are realistic and spread over the next 2-8 weeks.
    `

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content || ""

    let steps
    try {
      // Clean the response text to remove any markdown formatting
      let cleanedText = aiResponse.trim()

      // Remove markdown code blocks if present
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.replace(/```json\s*/, "").replace(/```\s*$/, "")
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/```\s*/, "").replace(/```\s*$/, "")
      }

      steps = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error("JSON parsing failed, trying to extract array:", parseError)

      // Try to extract JSON array using regex as fallback
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        try {
          steps = JSON.parse(jsonMatch[0])
        } catch (regexParseError) {
          console.error("Regex extraction also failed:", regexParseError)
          throw new Error("Failed to parse AI response")
        }
      } else {
        throw new Error("No JSON array found in response")
      }
    }

    // Validate the response structure
    if (!Array.isArray(steps)) {
      throw new Error("Response is not an array")
    }

    // Generate realistic future dates
    const today = new Date()
    const enhancedSteps = steps.map((step: any, index: number) => {
      const weeksFromNow = Math.floor(Math.random() * 6) + 1 // 1-6 weeks
      const deadline = new Date(today)
      deadline.setDate(deadline.getDate() + weeksFromNow * 7)

      return {
        ...step,
        deadline: deadline.toISOString().split("T")[0], // Format as YYYY-MM-DD
      }
    })

    return NextResponse.json({ steps: enhancedSteps })
  } catch (error) {
    console.error("Error generating mission steps:", error)
    return NextResponse.json({ error: "Failed to generate mission steps. Please try again." }, { status: 500 })
  }
}
