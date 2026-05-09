// Original: src/utils/queryHelpers.ts
function isResultSuccessful(message, stopReason = null) {
  if (!message)
    return !1;
  if (message.type === "assistant") {
    let lastContent = last_default(message.message.content);
    return lastContent?.type === "text" || lastContent?.type === "thinking" || lastContent?.type === "redacted_thinking";
  }
  if (message.type === "user") {
    let content = message.message.content;
    if (Array.isArray(content) && content.length > 0 && content.every((block2) => ("type" in block2) && block2.type === "tool_result"))
      return !0;
  }
  return stopReason === "end_turn";
}
function* normalizeMessage(message) {
  switch (message.type) {
    case "assistant":
      for (let _ of normalizeMessages([message])) {
        if (!isNotEmptyMessage(_))
          continue;
        yield {
          type: "assistant",
          message: _.message,
          parent_tool_use_id: null,
          session_id: getSessionId(),
          uuid: _.uuid,
          error: _.error
        };
      }
      return;
    case "progress":
      if (message.data.type === "agent_progress" || message.data.type === "skill_progress")
        for (let _ of normalizeMessages([message.data.message]))
          switch (_.type) {
            case "assistant":
              if (!isNotEmptyMessage(_))
                break;
              yield {
                type: "assistant",
                message: _.message,
                parent_tool_use_id: message.parentToolUseID,
                session_id: getSessionId(),
                uuid: _.uuid,
                error: _.error
              };
              break;
            case "user":
              yield {
                type: "user",
                message: _.message,
                parent_tool_use_id: message.parentToolUseID,
                session_id: getSessionId(),
                uuid: _.uuid,
                timestamp: _.timestamp,
                isSynthetic: _.isMeta || _.isVisibleInTranscriptOnly,
                tool_use_result: _.mcpMeta ? { content: _.toolUseResult, ..._.mcpMeta } : _.toolUseResult
              };
              break;
          }
      else if (message.data.type === "bash_progress" || message.data.type === "powershell_progress") {
        if (!isEnvTruthy(process.env.CLAUDE_CODE_REMOTE) && !process.env.CLAUDE_CODE_CONTAINER_ID)
          break;
        let trackingKey = message.parentToolUseID, now2 = Date.now(), lastSent = toolProgressLastSentTime.get(trackingKey) || 0;
        if (now2 - lastSent >= TOOL_PROGRESS_THROTTLE_MS) {
          if (toolProgressLastSentTime.size >= MAX_TOOL_PROGRESS_TRACKING_ENTRIES) {
            let firstKey = toolProgressLastSentTime.keys().next().value;
            if (firstKey !== void 0)
              toolProgressLastSentTime.delete(firstKey);
          }
          toolProgressLastSentTime.set(trackingKey, now2), yield {
            type: "tool_progress",
            tool_use_id: message.toolUseID,
            tool_name: message.data.type === "bash_progress" ? "Bash" : "PowerShell",
            parent_tool_use_id: message.parentToolUseID,
            elapsed_time_seconds: message.data.elapsedTimeSeconds,
            task_id: message.data.taskId,
            session_id: getSessionId(),
            uuid: message.uuid
          };
        }
      }
      break;
    case "user":
      for (let _ of normalizeMessages([message]))
        yield {
          type: "user",
          message: _.message,
          parent_tool_use_id: null,
          session_id: getSessionId(),
          uuid: _.uuid,
          timestamp: _.timestamp,
          isSynthetic: _.isMeta || _.isVisibleInTranscriptOnly,
          tool_use_result: _.mcpMeta ? { content: _.toolUseResult, ..._.mcpMeta } : _.toolUseResult
        };
      return;
    default:
  }
}
async function* handleOrphanedPermission(orphanedPermission, tools, mutableMessages, processUserInputContext) {
  let persistSession = !isSessionPersistenceDisabled(), { permissionResult, assistantMessage } = orphanedPermission, { toolUseID } = permissionResult;
  if (!toolUseID)
    return;
  let content = assistantMessage.message.content, toolUseBlock;
  if (Array.isArray(content)) {
    for (let block2 of content)
      if (block2.type === "tool_use" && block2.id === toolUseID) {
        toolUseBlock = block2;
        break;
      }
  }
  if (!toolUseBlock)
    return;
  let { name: toolName, input: toolInput } = toolUseBlock;
  if (!findToolByName(tools, toolName))
    return;
  let finalInput = toolInput;
  if (permissionResult.behavior === "allow")
    if (permissionResult.updatedInput !== void 0)
      finalInput = permissionResult.updatedInput;
    else
      logForDebugging(`Orphaned permission for ${toolName}: updatedInput is undefined, falling back to original tool input`, { level: "warn" });
  let finalToolUseBlock = {
    ...toolUseBlock,
    input: finalInput
  }, canUseTool = async () => ({
    ...permissionResult,
    decisionReason: {
      type: "mode",
      mode: "default"
    }
  });
  if (!mutableMessages.some((m4) => m4.type === "assistant" && Array.isArray(m4.message.content) && m4.message.content.some((b) => b.type === "tool_use" && ("id" in b) && b.id === toolUseID))) {
    if (mutableMessages.push(assistantMessage), persistSession)
      await recordTranscript(mutableMessages);
  }
  yield {
    ...assistantMessage,
    session_id: getSessionId(),
    parent_tool_use_id: null
  };
  for await (let update of runTools([finalToolUseBlock], [assistantMessage], canUseTool, processUserInputContext))
    if (update.message) {
      if (mutableMessages.push(update.message), persistSession)
        await recordTranscript(mutableMessages);
      yield {
        ...update.message,
        session_id: getSessionId(),
        parent_tool_use_id: null
      };
    }
}
function extractReadFilesFromMessages(messages, cwd2, maxSize = ASK_READ_FILE_STATE_CACHE_SIZE) {
  let cache5 = createFileStateCacheWithSizeLimit(maxSize), fileReadToolUseIds = /* @__PURE__ */ new Map, fileWriteToolUseIds = /* @__PURE__ */ new Map, fileEditToolUseIds = /* @__PURE__ */ new Map;
  for (let message of messages)
    if (message.type === "assistant" && Array.isArray(message.message.content)) {
      for (let content of message.message.content)
        if (content.type === "tool_use" && content.name === FILE_READ_TOOL_NAME) {
          let input = content.input;
          if (input?.file_path && input?.offset === void 0 && input?.limit === void 0) {
            let absolutePath = expandPath(input.file_path, cwd2);
            fileReadToolUseIds.set(content.id, absolutePath);
          }
        } else if (content.type === "tool_use" && content.name === FILE_WRITE_TOOL_NAME) {
          let input = content.input;
          if (input?.file_path && input?.content) {
            let absolutePath = expandPath(input.file_path, cwd2);
            fileWriteToolUseIds.set(content.id, {
              filePath: absolutePath,
              content: input.content
            });
          }
        } else if (content.type === "tool_use" && content.name === FILE_EDIT_TOOL_NAME) {
          let input = content.input;
          if (input?.file_path) {
            let absolutePath = expandPath(input.file_path, cwd2);
            fileEditToolUseIds.set(content.id, absolutePath);
          }
        }
    }
  for (let message of messages)
    if (message.type === "user" && Array.isArray(message.message.content)) {
      for (let content of message.message.content)
        if (content.type === "tool_result" && content.tool_use_id) {
          let readFilePath = fileReadToolUseIds.get(content.tool_use_id);
          if (readFilePath && typeof content.content === "string" && !content.content.startsWith(FILE_UNCHANGED_STUB)) {
            let fileContent = content.content.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "").split(`
`).map(stripLineNumberPrefix).join(`
`).trim();
            if (message.timestamp) {
              let timestamp = new Date(message.timestamp).getTime();
              cache5.set(readFilePath, {
                content: fileContent,
                timestamp,
                offset: void 0,
                limit: void 0
              });
            }
          }
          let writeToolData = fileWriteToolUseIds.get(content.tool_use_id);
          if (writeToolData && message.timestamp) {
            let timestamp = new Date(message.timestamp).getTime();
            cache5.set(writeToolData.filePath, {
              content: writeToolData.content,
              timestamp,
              offset: void 0,
              limit: void 0
            });
          }
          let editFilePath = fileEditToolUseIds.get(content.tool_use_id);
          if (editFilePath && content.is_error !== !0)
            try {
              let { content: diskContent } = readFileSyncWithMetadata(editFilePath);
              cache5.set(editFilePath, {
                content: diskContent,
                timestamp: getFileModificationTime(editFilePath),
                offset: void 0,
                limit: void 0
              });
            } catch (e) {
              if (!isFsInaccessible(e))
                throw e;
            }
        }
    }
  return cache5;
}
function extractBashToolsFromMessages(messages) {
  let tools = /* @__PURE__ */ new Set;
  for (let message of messages)
    if (message.type === "assistant" && Array.isArray(message.message.content)) {
      for (let content of message.message.content)
        if (content.type === "tool_use" && content.name === BASH_TOOL_NAME) {
          let { input } = content;
          if (typeof input !== "object" || input === null || !("command" in input))
            continue;
          let cmd = extractCliName(typeof input.command === "string" ? input.command : void 0);
          if (cmd)
            tools.add(cmd);
        }
    }
  return tools;
}
function extractCliName(command12) {
  if (!command12)
    return;
  let tokens = command12.trim().split(/\s+/);
  for (let token of tokens) {
    if (/^[A-Za-z_]\w*=/.test(token))
      continue;
    if (STRIPPED_COMMANDS.has(token))
      continue;
    return token;
  }
  return;
}
var ASK_READ_FILE_STATE_CACHE_SIZE = 10, MAX_TOOL_PROGRESS_TRACKING_ENTRIES = 100, TOOL_PROGRESS_THROTTLE_MS = 30000, toolProgressLastSentTime, STRIPPED_COMMANDS;
var init_queryHelpers = __esm(() => {
  init_last();
  init_state();
  init_toolOrchestration();
  init_Tool();
  init_prompt2();
  init_prompt4();
  init_debug();
  init_envUtils();
  init_errors();
  init_file();
  init_fileRead();
  init_fileStateCache();
  init_messages3();
  init_path2();
  init_sessionStorage();
  toolProgressLastSentTime = /* @__PURE__ */ new Map;
  STRIPPED_COMMANDS = /* @__PURE__ */ new Set(["sudo"]);
});
