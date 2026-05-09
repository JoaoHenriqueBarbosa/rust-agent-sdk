// Original: src/utils/sessionFileAccessHooks.ts
var exports_sessionFileAccessHooks = {};
__export(exports_sessionFileAccessHooks, {
  registerSessionFileAccessHooks: () => registerSessionFileAccessHooks,
  isMemoryFileAccess: () => isMemoryFileAccess
});
function getFilePathFromInput(toolName, toolInput) {
  switch (toolName) {
    case FILE_READ_TOOL_NAME: {
      let parsed = FileReadTool.inputSchema.safeParse(toolInput);
      return parsed.success ? parsed.data.file_path : null;
    }
    case FILE_EDIT_TOOL_NAME: {
      let parsed = inputSchema12().safeParse(toolInput);
      return parsed.success ? parsed.data.file_path : null;
    }
    case FILE_WRITE_TOOL_NAME: {
      let parsed = FileWriteTool.inputSchema.safeParse(toolInput);
      return parsed.success ? parsed.data.file_path : null;
    }
    default:
      return null;
  }
}
function getSessionFileTypeFromInput(toolName, toolInput) {
  switch (toolName) {
    case FILE_READ_TOOL_NAME: {
      let parsed = FileReadTool.inputSchema.safeParse(toolInput);
      if (!parsed.success)
        return null;
      return detectSessionFileType(parsed.data.file_path);
    }
    case GREP_TOOL_NAME: {
      let parsed = GrepTool.inputSchema.safeParse(toolInput);
      if (!parsed.success)
        return null;
      if (parsed.data.path) {
        let pathType = detectSessionFileType(parsed.data.path);
        if (pathType)
          return pathType;
      }
      if (parsed.data.glob) {
        let globType = detectSessionPatternType(parsed.data.glob);
        if (globType)
          return globType;
      }
      return null;
    }
    case GLOB_TOOL_NAME: {
      let parsed = GlobTool.inputSchema.safeParse(toolInput);
      if (!parsed.success)
        return null;
      if (parsed.data.path) {
        let pathType = detectSessionFileType(parsed.data.path);
        if (pathType)
          return pathType;
      }
      let patternType = detectSessionPatternType(parsed.data.pattern);
      if (patternType)
        return patternType;
      return null;
    }
    default:
      return null;
  }
}
function isMemoryFileAccess(toolName, toolInput) {
  if (getSessionFileTypeFromInput(toolName, toolInput) === "session_memory")
    return !0;
  let filePath = getFilePathFromInput(toolName, toolInput);
  if (filePath && (isAutoMemFile(filePath) || !1))
    return !0;
  return !1;
}
async function handleSessionFileAccess(input, _toolUseID, _signal) {
  if (input.hook_event_name !== "PostToolUse")
    return {};
  let fileType = getSessionFileTypeFromInput(input.tool_name, input.tool_input), subagentName = getSubagentLogName(), subagentProps = subagentName ? { subagent_name: subagentName } : {};
  if (fileType === "session_memory")
    logEvent("tengu_session_memory_accessed", { ...subagentProps });
  else if (fileType === "session_transcript")
    logEvent("tengu_transcript_accessed", { ...subagentProps });
  let filePath = getFilePathFromInput(input.tool_name, input.tool_input);
  if (filePath && isAutoMemFile(filePath))
    switch (logEvent("tengu_memdir_accessed", {
      tool: input.tool_name,
      ...subagentProps
    }), input.tool_name) {
      case FILE_READ_TOOL_NAME:
        logEvent("tengu_memdir_file_read", { ...subagentProps });
        break;
      case FILE_EDIT_TOOL_NAME:
        logEvent("tengu_memdir_file_edit", { ...subagentProps });
        break;
      case FILE_WRITE_TOOL_NAME:
        logEvent("tengu_memdir_file_write", { ...subagentProps });
        break;
    }
  if (!1)
    switch (input.tool_name) {
      case FILE_READ_TOOL_NAME:
      case FILE_EDIT_TOOL_NAME:
      case FILE_WRITE_TOOL_NAME:
    }
  return {};
}
function registerSessionFileAccessHooks() {
  let hook = {
    type: "callback",
    callback: handleSessionFileAccess,
    timeout: 1,
    internal: !0
  };
  registerHookCallbacks({
    PostToolUse: [
      { matcher: FILE_READ_TOOL_NAME, hooks: [hook] },
      { matcher: GREP_TOOL_NAME, hooks: [hook] },
      { matcher: GLOB_TOOL_NAME, hooks: [hook] },
      { matcher: FILE_EDIT_TOOL_NAME, hooks: [hook] },
      { matcher: FILE_WRITE_TOOL_NAME, hooks: [hook] }
    ]
  });
}
var init_sessionFileAccessHooks = __esm(() => {
  init_state();
  init_types20();
  init_FileReadTool();
  init_prompt2();
  init_FileWriteTool();
  init_prompt4();
  init_GlobTool();
  init_GrepTool();
  init_prompt5();
  init_memoryFileDetection();
  init_agentContext();
});
