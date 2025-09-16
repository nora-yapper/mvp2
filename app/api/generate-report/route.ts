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

6. ADDITIONAL NOTES ANALYSIS - THIS IS CRITICAL:
   BEFORE including any "additionalNotes" field, analyze the founder's notes:
   
   INSTRUCTIONAL NOTES (DO NOT include additionalNotes field):
   - "add [something] to startup description" → incorporate into startupDescription
   - "make [section] more [adjective]" → modify that section accordingly
   - "focus on [topic] in [section]" → emphasize that topic in the specified section
   - "include [information] in [section]" → add that information to the specified section
   - Any note that tells you HOW to modify existing sections
   
   ADDITIONAL CONTENT (DO include additionalNotes field):
   - New topics not covered in existing sections
   - Supplementary information that doesn't fit elsewhere
   - Context that stands alone as additional information
   
   EXAMPLE: "add pets are awesome to startup description" = INSTRUCTIONAL → incorporate into startupDescription, DO NOT include additionalNotes
   EXAMPLE: "We also have a partnership with XYZ Corp" = ADDITIONAL → include in additionalNotes

7. If notes are instructional, apply them to the relevant sections and NEVER include additionalNotes field
8. Only include additionalNotes field if the notes contain truly standalone additional content

Generate content for each enabled section. Make the content:
1. Professional and business-appropriate
2. Specific to the reporting period and audience
3. Incorporate any additional context provided by the founder throughout ALL sections
4. Realistic and actionable
5. Appropriate length for each section (2-4 sentences for most, bullet points for milestones)
6. NEVER use the report title "${title}" as the startup/company name in any section
7. Always refer to the report writer as "founder" or "co-founders", never as "user"

IMPORTANT: 
- If additional context is provided, analyze it and incorporate relevant insights throughout ALL report sections
- Use the context to make the report more specific and tailored
- Write about a startup/company generically - do not assume any specific company name
- When referencing the person who provided context, use "founder" or "co-founders"
- CRITICAL: Only include additionalNotes if the founder context contains truly additional standalone content, NOT instructions for existing sections

Respond with ONLY valid JSON in this exact format:
{
  "startupDescription": "Professional description of the startup and its mission (do NOT use '${title}' as company name)...",
  "progressOverview": "Summary of progress during the reporting period...",
  "tractionMilestones": [
    "Specific milestone 1",
    "Specific milestone 2",
    "Specific milestone 3"
  ],
  "risksBottlenecks": "Analysis of current risks and bottlenecks...",
  "productStrategy": "Product strategy and roadmap insights...",
  "forecastPriorities": "Forward-looking priorities and forecasts..."
}

Only include fields for sections that are enabled: ${enabledSections.join(", ")}
DO NOT include additionalNotes field unless the founder context contains truly additional standalone content (not instructions for existing sections).
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
            !note.startsWith("include"),
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
