// function: generateSectionInsight
async function generateSectionInsight(section, dataContext) {
  try {
    let result = await queryWithModel({
      systemPrompt: asSystemPrompt([]),
      userPrompt: section.prompt + `

DATA:
` + dataContext,
      signal: new AbortController().signal,
      options: {
        model: getInsightsModel(),
        querySource: "insights",
        agents: [],
        isNonInteractiveSession: !0,
        hasAppendSystemPrompt: !1,
        mcpTools: [],
        maxOutputTokensOverride: section.maxTokens
      }
    }), text2 = extractTextContent(result.message.content);
    if (text2) {
      let jsonMatch = text2.match(/\{[\s\S]*\}/);
      if (jsonMatch)
        try {
          return { name: section.name, result: jsonParse(jsonMatch[0]) };
        } catch {
          return { name: section.name, result: null };
        }
    }
    return { name: section.name, result: null };
  } catch (err2) {
    return logError2(Error(`${section.name} failed: ${toError(err2).message}`)), { name: section.name, result: null };
  }
}
