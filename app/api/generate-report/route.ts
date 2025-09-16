import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

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

      console.log("[v0] Making OpenAI API call using AI SDK")
      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
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
        maxTokens: 2000,
      })

      console.log("[v0] OpenAI API response received successfully")

      if (!text) {
        console.error("[v0] No response content from OpenAI")
        console.log("[v0] Falling back to fallback content due to empty response")
        return getFallbackContent(formData)
      }

      // Parse the AI response
      let parsedResponse
      try {
        console.log("[v0] Parsing AI response")
        // Clean the response text
        let cleanedText = text.trim()
        if (cleanedText.startsWith("```json")) {
          cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/\s*```$/, "")
        } else if (cleanedText.startsWith("```")) {
          cleanedText = cleanedText.replace(/^```\s*/, "").replace(/\s*```$/, "")
        }

        parsedResponse = JSON.parse(cleanedText)
        console.log("[v0] AI response parsed successfully")
      } catch (parseError) {
        console.error("[v0] Failed to parse OpenAI response:", parseError)
        console.error("[v0] Raw AI response:", text)
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
  const additionalContext = notes ? `\n\nFOUNDER'S NOTES:\n${notes}` : ""

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
5. NEVER refer to the person writing this report as "user" - always use "founder", "founders", or "co-founders"

6. FOUNDER'S NOTES PARSING - COMPREHENSIVE TRAINING:

   STEP 1: Split notes on connectors: "and", "also", "plus", "additionally", "furthermore", "moreover", "as well as", periods, commas
   
   STEP 2: Classify each segment:
   
   TYPE A - INSTRUCTIONS (apply to existing sections, NO additionalNotes):
   • "add X to [section]" → modify that section
   • "mention Y in progress" → add to progressOverview
   • "include Z in description" → add to startupDescription
   • "update forecast with..." → modify forecastPriorities
   • "add funding to traction" → modify tractionMilestones
   • "make sure to highlight..." → apply to relevant section
   
   TYPE B - NEW SECTIONS (create additionalNotes):
   • "add new section about X"
   • "create Y section"
   • "add section for Z"
   • "write new section about..."
   • Standalone information that doesn't fit existing sections
   
   COMPREHENSIVE EXAMPLES:
   
   Example 1: "add we got 10M funding to traction and milestones and add that we finished incubation program in a new section"
   → "add we got 10M funding to traction and milestones" = TYPE A (apply to tractionMilestones)
   → "add that we finished incubation program in a new section" = TYPE B (additionalNotes)
   → Result: Include additionalNotes with incubation program content
   
   Example 2: "add that we finished incubation program and that john is joining our team in a new section"
   → "add that we finished incubation program and that john is joining our team in a new section" = TYPE B (multiple items in ONE new section)
   → Result: Include additionalNotes with BOTH incubation program AND John joining content in one section
   
   Example 3: "add 10m funding to forecast and priorities. Write a new section about finishing incubation program. Add new mentor arthur to startup description."
   → "add 10m funding to forecast and priorities" = TYPE A (apply to forecastPriorities)
   → "Write a new section about finishing incubation program" = TYPE B (new section)
   → "Add new mentor arthur to startup description" = TYPE A (apply to startupDescription)
   → Result: Include additionalNotes with ONLY incubation program content
   
   Example 4: "mention John joining our team and add 5M funding to forecast"
   → "mention John joining our team" = TYPE B (standalone team info)
   → "add 5M funding to forecast" = TYPE A (apply to forecastPriorities)
   → Result: Include additionalNotes with John joining content
   
   Example 5: "add pets policy to startup description and mention office move in progress"
   → "add pets policy to startup description" = TYPE A (apply to startupDescription)
   → "mention office move in progress" = TYPE A (apply to progressOverview)
   → Result: NO additionalNotes (all TYPE A)
   
   Example 6: "create team culture section and add new hiring section"
   → "create team culture section" = TYPE B (new section)
   → "add new hiring section" = TYPE B (new section)
   → Result: Include additionalNotes with BOTH team culture AND hiring sections
   
   Example 7: "we hired 3 developers and add this to progress overview"
   → "we hired 3 developers" = TYPE B (standalone info)
   → "add this to progress overview" = TYPE A (instruction to apply above to progress)
   → Result: NO additionalNotes (instruction overrides standalone)
   
   Example 8: "add funding milestone to traction also we completed Y Combinator"
   → "add funding milestone to traction" = TYPE A (apply to tractionMilestones)
   → "we completed Y Combinator" = TYPE B (standalone achievement)
   → Result: Include additionalNotes with Y Combinator content
   
   Example 9: "John joined as CTO plus add office expansion to forecast"
   → "John joined as CTO" = TYPE B (standalone team update)
   → "add office expansion to forecast" = TYPE A (apply to forecastPriorities)
   → Result: Include additionalNotes with John CTO content
   
   Example 10: "add new partnerships section furthermore mention revenue growth in progress"
   → "add new partnerships section" = TYPE B (new section)
   → "mention revenue growth in progress" = TYPE A (apply to progressOverview)
   → Result: Include additionalNotes with partnerships section
   
   Example 11: "we launched beta version, add user feedback to progress, create metrics section"
   → "we launched beta version" = TYPE B (standalone achievement)
   → "add user feedback to progress" = TYPE A (apply to progressOverview)
   → "create metrics section" = TYPE B (new section)
   → Result: Include additionalNotes with BOTH beta launch AND metrics section
   
   Example 12: "add new team member Sarah to description and create onboarding section and mention Q4 goals in forecast"
   → "add new team member Sarah to description" = TYPE A (apply to startupDescription)
   → "create onboarding section" = TYPE B (new section)
   → "mention Q4 goals in forecast" = TYPE A (apply to forecastPriorities)
   → Result: Include additionalNotes with ONLY onboarding section
   
   DECISION LOGIC:
   • If ANY segment is TYPE B → Include additionalNotes with ONLY TYPE B content
   • If ALL segments are TYPE A → NO additionalNotes field
   • TYPE A content gets applied to existing sections silently
   • TYPE B content becomes professional additionalNotes content
   • Multiple TYPE B items can be combined into one additionalNotes section

Generate content for each enabled section. Make the content professional, realistic, and appropriate for the target audience.

RESPONSE FORMAT:
Respond with ONLY valid JSON. Always include these enabled sections: ${enabledSections.join(", ")}

Base structure:
{${enabledSections.includes("startupDescription") ? '\n  "startupDescription": "Professional description...",' : ""}${enabledSections.includes("progressOverview") ? '\n  "progressOverview": "Summary of progress...",' : ""}${enabledSections.includes("tractionMilestones") ? '\n  "tractionMilestones": [\n    "Milestone 1",\n    "Milestone 2"\n  ],' : ""}${enabledSections.includes("risksBottlenecks") ? '\n  "risksBottlenecks": "Analysis of risks...",' : ""}${enabledSections.includes("productStrategy") ? '\n  "productStrategy": "Product strategy...",' : ""}${enabledSections.includes("forecastPriorities") ? '\n  "forecastPriorities": "Forward-looking priorities..."' : ""}}

CONDITIONAL FIELD - Add ONLY if founder's notes contain TYPE B content:
"additionalNotes": "Professional content for new sections (TYPE B content only)"
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
