// Original: src/services/extractMemories/extractMemories.ts
function denyAutoMemTool(tool, reason) {
  return logForDebugging(`[autoMem] denied ${tool.name}: ${reason}`), logEvent("tengu_auto_mem_tool_denied", {
    tool_name: sanitizeToolNameForAnalytics(tool.name)
  }), {
    behavior: "deny",
    message: reason,
    decisionReason: { type: "other", reason }
  };
}
function createAutoMemCanUseTool(memoryDir) {
  return async (tool, input) => {
    if (tool.name === REPL_TOOL_NAME)
      return { behavior: "allow", updatedInput: input };
    if (tool.name === FILE_READ_TOOL_NAME || tool.name === GREP_TOOL_NAME || tool.name === GLOB_TOOL_NAME)
      return { behavior: "allow", updatedInput: input };
    if (tool.name === BASH_TOOL_NAME) {
      let parsed = tool.inputSchema.safeParse(input);
      if (parsed.success && tool.isReadOnly(parsed.data))
        return { behavior: "allow", updatedInput: input };
      return denyAutoMemTool(tool, "Only read-only shell commands are permitted in this context (ls, find, grep, cat, stat, wc, head, tail, and similar)");
    }
    if ((tool.name === FILE_EDIT_TOOL_NAME || tool.name === FILE_WRITE_TOOL_NAME) && "file_path" in input) {
      let filePath = input.file_path;
      if (typeof filePath === "string" && isAutoMemPath(filePath))
        return { behavior: "allow", updatedInput: input };
    }
    return denyAutoMemTool(tool, `only ${FILE_READ_TOOL_NAME}, ${GREP_TOOL_NAME}, ${GLOB_TOOL_NAME}, read-only ${BASH_TOOL_NAME}, and ${FILE_EDIT_TOOL_NAME}/${FILE_WRITE_TOOL_NAME} within ${memoryDir} are allowed`);
  };
}
var init_extractMemories = __esm(() => {
  init_state();
  init_memdir();
  init_memoryScan();
  init_paths();
  init_prompt2();
  init_prompt4();
  init_prompt5();
  init_constants9();
  init_abortController();
  init_debug();
  init_forkedAgent();
  init_messages3();
  init_metadata();
  init_prompts();
});
