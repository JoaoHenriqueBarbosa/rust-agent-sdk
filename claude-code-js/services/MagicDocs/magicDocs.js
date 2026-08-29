// Original: src/services/MagicDocs/magicDocs.ts
function clearTrackedMagicDocs() {
  trackedMagicDocs.clear();
}
function detectMagicDocHeader(content) {
  let match = content.match(MAGIC_DOC_HEADER_PATTERN);
  if (!match || !match[1])
    return null;
  let title = match[1].trim(), headerEndIndex = match.index + match[0].length, nextLineMatch = content.slice(headerEndIndex).match(/^\s*\n(?:\s*\n)?(.+?)(?:\n|$)/);
  if (nextLineMatch && nextLineMatch[1]) {
    let italicsMatch = nextLineMatch[1].match(ITALICS_PATTERN);
    if (italicsMatch && italicsMatch[1]) {
      let instructions = italicsMatch[1].trim();
      return {
        title,
        instructions
      };
    }
  }
  return { title };
}
function getMagicDocsAgent() {
  return {
    agentType: "magic-docs",
    whenToUse: "Update Magic Docs",
    tools: [FILE_EDIT_TOOL_NAME],
    model: "sonnet",
    source: "built-in",
    baseDir: "built-in",
    getSystemPrompt: () => ""
  };
}
async function updateMagicDoc(docInfo, context6) {
  let { messages, systemPrompt, userContext, systemContext, toolUseContext } = context6, clonedReadFileState = cloneFileStateCache(toolUseContext.readFileState);
  clonedReadFileState.delete(docInfo.path);
  let clonedToolUseContext = {
    ...toolUseContext,
    readFileState: clonedReadFileState
  }, currentDoc = "";
  try {
    let output = (await FileReadTool.call({ file_path: docInfo.path }, clonedToolUseContext)).data;
    if (output.type === "text")
      currentDoc = output.file.content;
  } catch (e) {
    if (isFsInaccessible(e) || e instanceof Error && e.message.startsWith("File does not exist")) {
      trackedMagicDocs.delete(docInfo.path);
      return;
    }
    throw e;
  }
  let detected = detectMagicDocHeader(currentDoc);
  if (!detected) {
    trackedMagicDocs.delete(docInfo.path);
    return;
  }
  let userPrompt = await buildMagicDocsUpdatePrompt(currentDoc, docInfo.path, detected.title, detected.instructions), canUseTool = async (tool, input) => {
    if (tool.name === FILE_EDIT_TOOL_NAME && typeof input === "object" && input !== null && "file_path" in input) {
      let filePath = input.file_path;
      if (typeof filePath === "string" && filePath === docInfo.path)
        return { behavior: "allow", updatedInput: input };
    }
    return {
      behavior: "deny",
      message: `only ${FILE_EDIT_TOOL_NAME} is allowed for ${docInfo.path}`,
      decisionReason: {
        type: "other",
        reason: `only ${FILE_EDIT_TOOL_NAME} is allowed`
      }
    };
  };
  for await (let _message of runAgent({
    agentDefinition: getMagicDocsAgent(),
    promptMessages: [createUserMessage({ content: userPrompt })],
    toolUseContext: clonedToolUseContext,
    canUseTool,
    isAsync: !0,
    forkContextMessages: messages,
    querySource: "magic_docs",
    override: {
      systemPrompt,
      userContext,
      systemContext
    },
    availableTools: clonedToolUseContext.options.tools
  }))
    ;
}
async function initMagicDocs() {}
var MAGIC_DOC_HEADER_PATTERN, ITALICS_PATTERN, trackedMagicDocs, updateMagicDocs;
var init_magicDocs = __esm(() => {
  init_runAgent();
  init_FileReadTool();
  init_errors();
  init_fileStateCache();
  init_postSamplingHooks();
  init_messages3();
  init_prompts3();
  MAGIC_DOC_HEADER_PATTERN = /^#\s*MAGIC\s+DOC:\s*(.+)$/im, ITALICS_PATTERN = /^[_*](.+?)[_*]\s*$/m, trackedMagicDocs = /* @__PURE__ */ new Map;
  updateMagicDocs = sequential(async function(context6) {
    let { messages, querySource } = context6;
    if (querySource !== "repl_main_thread")
      return;
    if (hasToolCallsInLastAssistantTurn(messages))
      return;
    if (trackedMagicDocs.size === 0)
      return;
    for (let docInfo of Array.from(trackedMagicDocs.values()))
      await updateMagicDoc(docInfo, context6);
  });
});
