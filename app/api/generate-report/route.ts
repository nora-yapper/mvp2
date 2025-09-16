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
        let cleanedText = text.trim()

        // Remove any markdown formatting
        if (cleanedText.startsWith("```json")) {
          cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/\s*```$/, "")
        } else if (cleanedText.startsWith("```")) {
          cleanedText = cleanedText.replace(/^```\s*/, "").replace(/\s*```$/, "")
        }

        // Handle duplicate JSON objects - take only the first complete one
        const jsonStart = cleanedText.indexOf("{")
        if (jsonStart !== -1) {
          let braceCount = 0
          let endIndex = jsonStart

          for (let i = jsonStart; i < cleanedText.length; i++) {
            if (cleanedText[i] === "{") braceCount++
            if (cleanedText[i] === "}") braceCount--
            if (braceCount === 0) {
              endIndex = i + 1
              break
            }
          }

          cleanedText = cleanedText.substring(jsonStart, endIndex)
        }

        // Remove any trailing incomplete content
        cleanedText = cleanedText.replace(/,\s*$/, "")

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

  const hasNotes = notes && notes.trim().length > 0

  if (!hasNotes) {
    // Simple default report generation without complex analysis
    return createSimpleReportPrompt(title, dateRange, audience, sections)
  }

  const additionalContext = `\n\nFOUNDER'S NOTES:\n${notes}`

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

CRITICAL JSON FORMAT REQUIREMENTS:
1. Respond with ONLY valid JSON - no markdown, no code blocks, no extra text
2. Do NOT wrap response in \`\`\`json or any other formatting
3. Generate ONE complete JSON object only
4. Ensure all strings are properly escaped and complete
5. Do NOT repeat or duplicate the JSON structure

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

   DECISION LOGIC:
   • If ANY segment is TYPE B → Include additionalNotes with ONLY TYPE B content
   • If ALL segments are TYPE A → NO additionalNotes field
   • TYPE A content gets applied to existing sections silently
   • TYPE B content becomes professional additionalNotes content
   • Multiple TYPE B items can be combined into one additionalNotes section

Generate content for each enabled section. Make the content professional, realistic, and appropriate for the target audience.

RESPONSE FORMAT - EXACT JSON STRUCTURE:
{${enabledSections.includes("startupDescription") ? '\n  "startupDescription": "Professional description...",' : ""}${enabledSections.includes("progressOverview") ? '\n  "progressOverview": "Summary of progress...",' : ""}${enabledSections.includes("tractionMilestones") ? '\n  "tractionMilestones": [\n    "Milestone 1",\n    "Milestone 2"\n  ],' : ""}${enabledSections.includes("risksBottlenecks") ? '\n  "risksBottlenecks": "Analysis of risks...",' : ""}${enabledSections.includes("productStrategy") ? '\n  "productStrategy": "Product strategy...",' : ""}${enabledSections.includes("forecastPriorities") ? '\n  "forecastPriorities": "Forward-looking priorities..."' : ""}}

CONDITIONAL FIELD - Add ONLY if founder's notes contain TYPE B content:
"additionalNotes": "Professional content for new sections (TYPE B content only)"

REMEMBER: Respond with ONLY the JSON object, no other text or formatting.`

  return prompt
}

function createSimpleReportPrompt(title: string, dateRange: string, audience: string, sections: any) {
  const enabledSections = Object.entries(sections)
    .filter(([_, enabled]) => enabled)
    .map(([section, _]) => section)

  return `
Create a professional startup report with the following details:

REPORT DETAILS:
- Report Title: ${title} (THIS IS ONLY A REPORT TITLE/LABEL - DO NOT USE THIS AS THE COMPANY NAME)
- Reporting Period: ${dateRange}
- Target Audience: ${audience}
- Sections to include: ${enabledSections.join(", ")}

CRITICAL JSON FORMAT REQUIREMENTS:
1. Respond with ONLY valid JSON - no markdown, no code blocks, no extra text
2. Do NOT wrap response in \`\`\`json or any other formatting
3. Generate ONE complete JSON object only
4. Ensure all strings are properly escaped and complete

INSTRUCTIONS:
1. The title "${title}" is ONLY the report title/label - it is NOT the startup name
2. Create content about a generic startup/company - do NOT reference "${title}" as the company name
3. Use terms like "our startup", "the company", "our organization" instead of using the report title
4. Generate realistic, professional startup content
5. NEVER refer to the person writing this report as "user" - always use "founder", "founders", or "co-founders"

Generate standard professional content for each enabled section.

RESPONSE FORMAT - EXACT JSON STRUCTURE:
{${enabledSections.includes("startupDescription") ? '\n  "startupDescription": "Professional description...",' : ""}${enabledSections.includes("progressOverview") ? '\n  "progressOverview": "Summary of progress...",' : ""}${enabledSections.includes("tractionMilestones") ? '\n  "tractionMilestones": [\n    "Milestone 1",\n    "Milestone 2"\n  ],' : ""}${enabledSections.includes("risksBottlenecks") ? '\n  "risksBottlenecks": "Analysis of risks...",' : ""}${enabledSections.includes("productStrategy") ? '\n  "productStrategy": "Product strategy...",' : ""}${enabledSections.includes("forecastPriorities") ? '\n  "forecastPriorities": "Forward-looking priorities..."' : ""}}

REMEMBER: Respond with ONLY the JSON object, no other text or formatting.`
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
