// function: generateParallelInsights
async function generateParallelInsights(data, facets) {
  let facetSummaries = Array.from(facets.values()).slice(0, 50).map((f) => `- ${f.brief_summary} (${f.outcome}, ${f.claude_helpfulness})`).join(`
`), frictionDetails = Array.from(facets.values()).filter((f) => f.friction_detail).slice(0, 20).map((f) => `- ${f.friction_detail}`).join(`
`), userInstructions = Array.from(facets.values()).flatMap((f) => f.user_instructions_to_claude || []).slice(0, 15).map((i5) => `- ${i5}`).join(`
`), fullContext = jsonStringify({
    sessions: data.total_sessions,
    analyzed: data.sessions_with_facets,
    date_range: data.date_range,
    messages: data.total_messages,
    hours: Math.round(data.total_duration_hours),
    commits: data.git_commits,
    top_tools: Object.entries(data.tool_counts).sort((a2, b) => b[1] - a2[1]).slice(0, 8),
    top_goals: Object.entries(data.goal_categories).sort((a2, b) => b[1] - a2[1]).slice(0, 8),
    outcomes: data.outcomes,
    satisfaction: data.satisfaction,
    friction: data.friction,
    success: data.success,
    languages: data.languages
  }, null, 2) + `

SESSION SUMMARIES:
` + facetSummaries + `

FRICTION DETAILS:
` + frictionDetails + `

USER INSTRUCTIONS TO CLAUDE:
` + (userInstructions || "None captured"), results = await Promise.all(INSIGHT_SECTIONS.map((section) => generateSectionInsight(section, fullContext))), insights = {};
  for (let { name: name3, result } of results)
    if (result)
      insights[name3] = result;
  let projectAreasText = insights.project_areas?.areas?.map((a2) => `- ${a2.name}: ${a2.description}`).join(`
`) || "", bigWinsText = insights.what_works?.impressive_workflows?.map((w2) => `- ${w2.title}: ${w2.description}`).join(`
`) || "", frictionText = insights.friction_analysis?.categories?.map((c3) => `- ${c3.category}: ${c3.description}`).join(`
`) || "", featuresText = insights.suggestions?.features_to_try?.map((f) => `- ${f.feature}: ${f.one_liner}`).join(`
`) || "", patternsText = insights.suggestions?.usage_patterns?.map((p4) => `- ${p4.title}: ${p4.suggestion}`).join(`
`) || "", horizonText = insights.on_the_horizon?.opportunities?.map((o5) => `- ${o5.title}: ${o5.whats_possible}`).join(`
`) || "", atAGlanceSection = {
    name: "at_a_glance",
    prompt: `You're writing an "At a Glance" summary for a Claude Code usage insights report for Claude Code users. The goal is to help them understand their usage and improve how they can use Claude better, especially as models improve.

Use this 4-part structure:

1. **What's working** - What is the user's unique style of interacting with Claude and what are some impactful things they've done? You can include one or two details, but keep it high level since things might not be fresh in the user's memory. Don't be fluffy or overly complimentary. Also, don't focus on the tool calls they use.

2. **What's hindering you** - Split into (a) Claude's fault (misunderstandings, wrong approaches, bugs) and (b) user-side friction (not providing enough context, environment issues -- ideally more general than just one project). Be honest but constructive.

3. **Quick wins to try** - Specific Claude Code features they could try from the examples below, or a workflow technique if you think it's really compelling. (Avoid stuff like "Ask Claude to confirm before taking actions" or "Type out more context up front" which are less compelling.)

4. **Ambitious workflows for better models** - As we move to much more capable models over the next 3-6 months, what should they prepare for? What workflows that seem impossible now will become possible? Draw from the appropriate section below.

Keep each section to 2-3 not-too-long sentences. Don't overwhelm the user. Don't mention specific numerical stats or underlined_categories from the session data below. Use a coaching tone.

RESPOND WITH ONLY A VALID JSON OBJECT:
{
  "whats_working": "(refer to instructions above)",
  "whats_hindering": "(refer to instructions above)",
  "quick_wins": "(refer to instructions above)",
  "ambitious_workflows": "(refer to instructions above)"
}

SESSION DATA:
${fullContext}

## Project Areas (what user works on)
${projectAreasText}

## Big Wins (impressive accomplishments)
${bigWinsText}

## Friction Categories (where things go wrong)
${frictionText}

## Features to Try
${featuresText}

## Usage Patterns to Adopt
${patternsText}

## On the Horizon (ambitious workflows for better models)
${horizonText}`,
    maxTokens: 8192
  }, atAGlanceResult = await generateSectionInsight(atAGlanceSection, "");
  if (atAGlanceResult.result)
    insights.at_a_glance = atAGlanceResult.result;
  return insights;
}
