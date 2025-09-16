import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("[v0] API route called - starting execution")

  try {
    console.log("[v0] Attempting to parse request body")
    let requestBody
    try {
      requestBody = await request.json()
      console.log("[v0] Request body parsed successfully")
    } catch (parseError) {
      console.error("[v0] Failed to parse request body:", parseError)
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { formData } = requestBody
    console.log("[v0] Form data extracted:", formData ? "present" : "missing")

    if (!formData) {
      console.log("[v0] No form data provided")
      return NextResponse.json({ error: "Form data is required" }, { status: 400 })
    }

    // Check if OpenAI API key is available
    console.log("[v0] Checking OpenAI API key")
    if (!process.env.OPENAI_API_KEY) {
      console.log("[v0] No OpenAI API key found, using fallback content")
      return getFallbackContent(formData)
    }

    console.log("[v0] OpenAI API key found, proceeding with AI generation")

    try {
      console.log("[v0] Creating prompt")
      const prompt = createReportPrompt(formData)
      console.log("[v0] Prompt created successfully, length:", prompt.length)

      console.log("[v0] Making OpenAI API call")
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a professional business report writer who creates comprehensive startup reports. Always respond with valid JSON in the exact format requested.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      })

      console.log("[v0] OpenAI API response received, status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] OpenAI API error:", response.status, errorText)
        console.log("[v0] Falling back to fallback content due to API error")
        return getFallbackContent(formData)
      }

      const data = await response.json()
      console.log("[v0] OpenAI response parsed successfully")
      const aiResponse = data.choices[0]?.message?.content

      if (!aiResponse) {
        console.error("[v0] No response content from OpenAI")
        console.log("[v0] Falling back to fallback content due to empty response")
        return getFallbackContent(formData)
      }

      // Parse the AI response
      let parsedResponse
      try {
        console.log("[v0] Parsing AI response")
        // Clean the response text
        let cleanedText = aiResponse.trim()
        if (cleanedText.startsWith("```json")) {
          cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/\s*```$/, "")
        } else if (cleanedText.startsWith("```")) {
          cleanedText = cleanedText.replace(/^```\s*/, "").replace(/\s*```$/, "")
        }

        parsedResponse = JSON.parse(cleanedText)
        console.log("[v0] AI response parsed successfully")
      } catch (parseError) {
        console.error("[v0] Failed to parse OpenAI response:", parseError)
        console.error("[v0] Raw AI response:", aiResponse)
        console.log("[v0] Falling back to fallback content due to parse error")
        return getFallbackContent(formData)
      }

      console.log("[v0] Returning successful AI-generated content")
      return NextResponse.json({
        content: parsedResponse,
        source: "openai",
      })
    } catch (openaiError) {
      console.error("[v0] OpenAI API error:", openaiError)
      console.log("[v0] Falling back to fallback content due to OpenAI error")
      return getFallbackContent(formData)
    }
  } catch (error) {
    console.error("[v0] API route error:", error)
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function createReportPrompt(formData: any) {
  const { title, startDate, endDate, audience, sections, notes } = formData

  const dateRange = startDate && endDate ? `${startDate} to ${endDate}` : "current period"
  const additionalContext = notes ? `\n\nADDITIONAL CONTEXT FROM FOUNDER:\n${notes}` : ""

  const enabledSections = Object.entries(sections)
    .filter(([_, enabled]) => enabled)
    .map(([section, _]) => section)

  const prompt = `
Create a professional startup report with the following details:

REPORT DETAILS:
- Report Title: ${title} (THIS IS ONLY A REPORT TITLE/LABEL - DO NOT USE THIS AS THE COMPANY NAME)
- Reporting Period: ${dateRange}
- Target Audience: ${audience}
- Sections to include: ${enabledSections.join(", ")}
${additionalContext}

CRITICAL INSTRUCTIONS:
1. The title "${title}" is ONLY the report title/label - it is NOT the startup name
2. Create content about a generic startup/company - do NOT reference "${title}" as the company name
3. Use terms like "our startup", "the company", "our organization" instead of using the report title
4. Generate realistic startup content that stands on its own, independent of the report title
5. NEVER refer to the person writing this report as "user" - always use "founder", "founders", or "co-founders" depending on context

6. ADDITIONAL NOTES ANALYSIS - THIS IS THE MOST CRITICAL RULE:
   
   STEP 1: Analyze the founder's notes to determine if they are INSTRUCTIONAL or ADDITIONAL:
   
   INSTRUCTIONAL NOTES (these modify existing sections, DO NOT create additionalNotes field):
   - Any command or directive that tells you to modify existing sections
   - Phrases like: "add [X] to [section]", "make [section] more [Y]", "focus on [Z] in [section]", "include [A] in [section]"
   - Phrases like: "mention [X]", "emphasize [Y]", "highlight [Z]", "talk about [A]"
   - Phrases like: "update [section] with [info]", "change [section] to include [X]"
   - Any sentence that starts with action verbs: "add", "include", "mention", "focus", "emphasize", "highlight", "update", "change", "make", "ensure"
   - Any content that references specific report sections by name
   - ANY instruction about HOW to write or WHAT to include in the report
   
   ADDITIONAL CONTENT (these are standalone info, DO create additionalNotes field):
   - New factual information that doesn't fit in standard sections
   - Supplementary context that stands alone
   - Background information not covered elsewhere
   - Statements that provide additional context without instructing changes
   - Information that would naturally appear as a separate "Additional Notes" section
   
   STEP 2: If notes are INSTRUCTIONAL (even partially):
   - Apply ALL instructions to the relevant sections
   - DO NOT include any "additionalNotes" field in your JSON response
   - Seamlessly integrate the instructional content into existing sections
   
   STEP 3: If notes contain ONLY truly additional standalone content:
   - Include ONLY the non-instructional parts in the "additionalNotes" field
   - Never include instructional phrases in additionalNotes

7. EXAMPLES OF INSTRUCTIONAL vs ADDITIONAL:
   - "add pets are awesome to startup description" = INSTRUCTIONAL → modify startupDescription
   - "mention our new office in the overview" = INSTRUCTIONAL → modify progressOverview  
   - "focus on AI features in product strategy" = INSTRUCTIONAL → modify productStrategy
   - "We have a partnership with XYZ Corp" = ADDITIONAL → include in additionalNotes
   - "Our team loves working remotely" = ADDITIONAL → include in additionalNotes

Generate content for each enabled section. Make the content:
1. Professional and business-appropriate
2. Specific to the reporting period and audience
3. Incorporate any instructional context from founder notes into the relevant sections
4. Realistic and actionable
5. Appropriate length for each section (2-4 sentences for most, bullet points for milestones)
6. NEVER use the report title "${title}" as the startup/company name in any section
7. Always refer to the report writer as "founder" or "co-founders", never as "user"

RESPONSE FORMAT:
Respond with ONLY valid JSON. Include ONLY the fields for enabled sections: ${enabledSections.join(", ")}

Base JSON structure (only include enabled sections):
{${enabledSections.includes("startupDescription") ? '\n  "startupDescription": "Professional description of the startup and its mission (incorporate any instructional notes here)...",' : ""}${enabledSections.includes("progressOverview") ? '\n  "progressOverview": "Summary of progress during the reporting period (incorporate any instructional notes here)...",' : ""}${enabledSections.includes("tractionMilestones") ? '\n  "tractionMilestones": [\n    "Specific milestone 1",\n    "Specific milestone 2",\n    "Specific milestone 3"\n  ],' : ""}${enabledSections.includes("risksBottlenecks") ? '\n  "risksBottlenecks": "Analysis of current risks and bottlenecks (incorporate any instructional notes here)...",' : ""}${enabledSections.includes("productStrategy") ? '\n  "productStrategy": "Product strategy and roadmap insights (incorporate any instructional notes here)...",' : ""}${enabledSections.includes("forecastPriorities") ? '\n  "forecastPriorities": "Forward-looking priorities and forecasts (incorporate any instructional notes here)..."' : ""}}

ONLY add "additionalNotes": "content here" field if the founder's notes contain truly additional standalone information that doesn't belong in the standard sections above AND contains no instructional language.

CRITICAL: If ANY part of the notes is instructional, do NOT include additionalNotes field at all.
`

  return prompt
}

function getFallbackContent(formData: any) {
  const { sections, notes } = formData

  const content: any = {}

  if (sections.startupDescription) {
    content.startupDescription = notes
      ? `Our startup is focused on delivering innovative solutions that address key market challenges. ${notes.includes("product") || notes.includes("solution") ? "Based on our current focus, we are building solutions that directly address the needs identified in our market research." : "We have built a strong foundation with a clear value proposition and growing market traction."}`
      : "Our startup is focused on delivering innovative solutions that address key market challenges. We have built a strong foundation with a clear value proposition and growing market traction."
  }

  if (sections.progressOverview) {
    content.progressOverview = notes
      ? `This reporting period we have made significant progress toward our objectives. ${notes.includes("growth") || notes.includes("progress") ? "Our growth metrics align with the strategic initiatives outlined in our planning." : "We have maintained high quality standards while advancing our key initiatives."}`
      : "This quarter we have successfully delivered 87% of our planned objectives while maintaining high quality standards and team satisfaction. Our development velocity has increased by 40% compared to the previous quarter."
  }

  if (sections.tractionMilestones) {
    content.tractionMilestones = [
      "Completed major platform improvements affecting user experience",
      "Achieved significant operational efficiency gains",
      "Successfully onboarded new team members and stakeholders",
      "Maintained high customer satisfaction and engagement metrics",
    ]
  }

  if (sections.risksBottlenecks) {
    content.risksBottlenecks = notes
      ? `While progress has been strong, we continue to monitor key challenges in our operations. ${notes.includes("risk") || notes.includes("challenge") ? "The specific challenges mentioned in our planning require ongoing attention and strategic focus." : "Resource allocation and strategic coordination remain key focus areas."}`
      : "While progress has been strong, we face ongoing challenges in scaling our operations and maintaining quality as we grow. Resource allocation and team coordination remain key focus areas that require immediate attention."
  }

  if (sections.productStrategy) {
    content.productStrategy = notes
      ? `Our product roadmap is aligned with market demands and user feedback. ${notes.includes("feature") || notes.includes("product") ? "The product direction incorporates the strategic insights from our recent analysis." : "We have prioritized features that drive user engagement and retention."}`
      : "Our product roadmap is aligned with market demands and user feedback. We've prioritized features that drive user engagement and retention, with a focus on scalability and performance optimization."
  }

  if (sections.forecastPriorities) {
    content.forecastPriorities = notes
      ? `Looking ahead, we are prioritizing initiatives that align with our strategic objectives. ${notes.includes("future") || notes.includes("plan") ? "Our forward-looking priorities incorporate the insights and direction outlined in our strategic planning." : "We are focusing on sustainable growth and operational excellence."}`
      : "Looking ahead, we're prioritizing system optimization, team expansion, and strategic partnerships. Our AI-powered recommendations suggest focusing on automation and process refinement to achieve our next growth phase."
  }

  // Analyze notes to determine if they contain additional standalone content
  const additionalNotes = notes
    ? notes
        .split(/\n+/)
        .filter(
          (note) =>
            !note.startsWith("add") &&
            !note.startsWith("make") &&
            !note.startsWith("focus") &&
            !note.startsWith("include") &&
            !note.startsWith("mention") &&
            !note.startsWith("emphasize") &&
            !note.startsWith("highlight") &&
            !note.startsWith("update") &&
            !note.startsWith("change") &&
            !note.startsWith("ensure") &&
            !note.includes("startupDescription") &&
            !note.includes("progressOverview") &&
            !note.includes("tractionMilestones") &&
            !note.includes("risksBottlenecks") &&
            !note.includes("productStrategy") &&
            !note.includes("forecastPriorities"),
        )
        .join("\n")
    : ""

  if (additionalNotes.trim()) {
    content.additionalNotes = `Additional context: ${additionalNotes}`
  }

  return NextResponse.json({
    content,
    source: "fallback",
  })
}
