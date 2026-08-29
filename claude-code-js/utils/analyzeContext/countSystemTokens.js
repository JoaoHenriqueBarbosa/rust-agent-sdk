// function: countSystemTokens
async function countSystemTokens(effectiveSystemPrompt) {
  let systemContext = await getSystemContext(), namedEntries = [
    ...effectiveSystemPrompt.filter((content) => content.length > 0 && content !== SYSTEM_PROMPT_DYNAMIC_BOUNDARY).map((content) => ({ name: extractSectionName(content), content })),
    ...Object.entries(systemContext).filter(([, content]) => content.length > 0).map(([name3, content]) => ({ name: name3, content }))
  ];
  if (namedEntries.length < 1)
    return { systemPromptTokens: 0, systemPromptSections: [] };
  let systemTokenCounts = await Promise.all(namedEntries.map(({ content }) => countTokensWithFallback([{ role: "user", content }], []))), systemPromptSections = namedEntries.map((entry, i5) => ({
    name: entry.name,
    tokens: systemTokenCounts[i5] || 0
  }));
  return { systemPromptTokens: systemTokenCounts.reduce((sum, tokens) => sum + (tokens || 0), 0), systemPromptSections };
}
