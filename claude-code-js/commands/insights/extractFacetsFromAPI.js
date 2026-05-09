// function: extractFacetsFromAPI
async function extractFacetsFromAPI(log3, sessionId) {
  try {
    let transcript = await formatTranscriptWithSummarization(log3), jsonPrompt = `${FACET_EXTRACTION_PROMPT}${transcript}

RESPOND WITH ONLY A VALID JSON OBJECT matching this schema:
{
  "underlying_goal": "What the user fundamentally wanted to achieve",
  "goal_categories": {"category_name": count, ...},
  "outcome": "fully_achieved|mostly_achieved|partially_achieved|not_achieved|unclear_from_transcript",
  "user_satisfaction_counts": {"level": count, ...},
  "claude_helpfulness": "unhelpful|slightly_helpful|moderately_helpful|very_helpful|essential",
  "session_type": "single_task|multi_task|iterative_refinement|exploration|quick_question",
  "friction_counts": {"friction_type": count, ...},
  "friction_detail": "One sentence describing friction or empty",
  "primary_success": "none|fast_accurate_search|correct_code_edits|good_explanations|proactive_help|multi_file_changes|good_debugging",
  "brief_summary": "One sentence: what user wanted and whether they got it"
}`, result = await queryWithModel({
      systemPrompt: asSystemPrompt([]),
      userPrompt: jsonPrompt,
      signal: new AbortController().signal,
      options: {
        model: getAnalysisModel(),
        querySource: "insights",
        agents: [],
        isNonInteractiveSession: !0,
        hasAppendSystemPrompt: !1,
        mcpTools: [],
        maxOutputTokensOverride: 4096
      }
    }), jsonMatch = extractTextContent(result.message.content).match(/\{[\s\S]*\}/);
    if (!jsonMatch)
      return null;
    let parsed = jsonParse(jsonMatch[0]);
    if (!isValidSessionFacets(parsed))
      return null;
    return { ...parsed, session_id: sessionId };
  } catch (err2) {
    return logError2(Error(`Facet extraction failed: ${toError(err2).message}`)), null;
  }
}
