// function: summarizeTranscriptChunk
async function summarizeTranscriptChunk(chunk2) {
  try {
    let result = await queryWithModel({
      systemPrompt: asSystemPrompt([]),
      userPrompt: SUMMARIZE_CHUNK_PROMPT + chunk2,
      signal: new AbortController().signal,
      options: {
        model: getAnalysisModel(),
        querySource: "insights",
        agents: [],
        isNonInteractiveSession: !0,
        hasAppendSystemPrompt: !1,
        mcpTools: [],
        maxOutputTokensOverride: 500
      }
    });
    return extractTextContent(result.message.content) || chunk2.slice(0, 2000);
  } catch {
    return chunk2.slice(0, 2000);
  }
}
