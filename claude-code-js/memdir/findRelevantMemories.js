// Original: src/memdir/findRelevantMemories.ts
async function findRelevantMemories(query3, memoryDir, signal, recentTools = [], alreadySurfaced = /* @__PURE__ */ new Set) {
  let memories = (await scanMemoryFiles(memoryDir, signal)).filter((m4) => !alreadySurfaced.has(m4.filePath));
  if (memories.length === 0)
    return [];
  let selectedFilenames = await selectRelevantMemories(query3, memories, signal, recentTools), byFilename = new Map(memories.map((m4) => [m4.filename, m4]));
  return selectedFilenames.map((filename) => byFilename.get(filename)).filter((m4) => m4 !== void 0).map((m4) => ({ path: m4.filePath, mtimeMs: m4.mtimeMs }));
}
async function selectRelevantMemories(query3, memories, signal, recentTools) {
  let validFilenames = new Set(memories.map((m4) => m4.filename)), manifest = formatMemoryManifest(memories), toolsSection = recentTools.length > 0 ? `

Recently used tools: ${recentTools.join(", ")}` : "";
  try {
    let textBlock = (await sideQuery({
      model: getDefaultSonnetModel(),
      system: SELECT_MEMORIES_SYSTEM_PROMPT,
      skipSystemPromptPrefix: !0,
      messages: [
        {
          role: "user",
          content: `Query: ${query3}

Available memories:
${manifest}${toolsSection}`
        }
      ],
      max_tokens: 256,
      output_format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            selected_memories: { type: "array", items: { type: "string" } }
          },
          required: ["selected_memories"],
          additionalProperties: !1
        }
      },
      signal,
      querySource: "memdir_relevance"
    })).content.find((block2) => block2.type === "text");
    if (!textBlock || textBlock.type !== "text")
      return [];
    return jsonParse(textBlock.text).selected_memories.filter((f) => validFilenames.has(f));
  } catch (e) {
    if (signal.aborted)
      return [];
    return logForDebugging(`[memdir] selectRelevantMemories failed: ${errorMessage(e)}`, { level: "warn" }), [];
  }
}
var SELECT_MEMORIES_SYSTEM_PROMPT = `You are selecting memories that will be useful to Claude Code as it processes a user's query. You will be given the user's query and a list of available memory files with their filenames and descriptions.

Return a list of filenames for the memories that will clearly be useful to Claude Code as it processes the user's query (up to 5). Only include memories that you are certain will be helpful based on their name and description.
- If you are unsure if a memory will be useful in processing the user's query, then do not include it in your list. Be selective and discerning.
- If there are no memories in the list that would clearly be useful, feel free to return an empty list.
- If a list of recently-used tools is provided, do not select memories that are usage reference or API documentation for those tools (Claude Code is already exercising them). DO still select memories containing warnings, gotchas, or known issues about those tools \u2014 active use is exactly when those matter.
`;
var init_findRelevantMemories = __esm(() => {
  init_debug();
  init_errors();
  init_model();
  init_sideQuery();
  init_slowOperations();
  init_memoryScan();
});
