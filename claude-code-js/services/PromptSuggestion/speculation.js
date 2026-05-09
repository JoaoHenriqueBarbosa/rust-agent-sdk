// Original: src/services/PromptSuggestion/speculation.ts
import { randomUUID as randomUUID5 } from "crypto";
import { rm as rm4 } from "fs";
import { appendFile as appendFile3, copyFile as copyFile2, mkdir as mkdir5 } from "fs/promises";
import { dirname as dirname26, isAbsolute as isAbsolute12, join as join46, relative as relative8 } from "path";
function safeRemoveOverlay(overlayPath) {
  rm4(overlayPath, { recursive: !0, force: !0, maxRetries: 3, retryDelay: 100 }, () => {});
}
function getOverlayPath(id) {
  return join46(getClaudeTempDir(), "speculation", String(process.pid), id);
}
function denySpeculation(message, reason) {
  return {
    behavior: "deny",
    message,
    decisionReason: { type: "other", reason }
  };
}
async function copyOverlayToMain(overlayPath, writtenPaths, cwd2) {
  let allCopied = !0;
  for (let rel of writtenPaths) {
    let src = join46(overlayPath, rel), dest = join46(cwd2, rel);
    try {
      await mkdir5(dirname26(dest), { recursive: !0 }), await copyFile2(src, dest);
    } catch {
      allCopied = !1, logForDebugging(`[Speculation] Failed to copy ${rel} to main`);
    }
  }
  return allCopied;
}
function logSpeculation(id, outcome, startTime, suggestionLength, messages, boundary, extras) {
  logEvent("tengu_speculation", {
    speculation_id: id,
    outcome,
    duration_ms: Date.now() - startTime,
    suggestion_length: suggestionLength,
    tools_executed: countToolsInMessages(messages),
    completed: boundary !== null,
    boundary_type: boundary?.type,
    boundary_tool: getBoundaryTool(boundary),
    boundary_detail: getBoundaryDetail(boundary),
    ...extras
  });
}
function countToolsInMessages(messages) {
  let blocks = messages.filter(isUserMessageWithArrayContent).flatMap((m4) => m4.message.content).filter((b) => typeof b === "object" && b !== null && ("type" in b));
  return count2(blocks, (b) => b.type === "tool_result" && !b.is_error);
}
function getBoundaryTool(boundary) {
  if (!boundary)
    return;
  switch (boundary.type) {
    case "bash":
      return "Bash";
    case "edit":
    case "denied_tool":
      return boundary.toolName;
    case "complete":
      return;
  }
}
function getBoundaryDetail(boundary) {
  if (!boundary)
    return;
  switch (boundary.type) {
    case "bash":
      return boundary.command.slice(0, 200);
    case "edit":
      return boundary.filePath;
    case "denied_tool":
      return boundary.detail;
    case "complete":
      return;
  }
}
function isUserMessageWithArrayContent(m4) {
  return m4.type === "user" && "message" in m4 && Array.isArray(m4.message.content);
}
function prepareMessagesForInjection(messages) {
  let isToolResult = (b) => typeof b === "object" && b !== null && b.type === "tool_result" && typeof b.tool_use_id === "string", isSuccessful = (b) => !b.is_error && !(typeof b.content === "string" && b.content.includes(INTERRUPT_MESSAGE_FOR_TOOL_USE)), toolIdsWithSuccessfulResults = new Set(messages.filter(isUserMessageWithArrayContent).flatMap((m4) => m4.message.content).filter(isToolResult).filter(isSuccessful).map((b) => b.tool_use_id)), keep = (b) => b.type !== "thinking" && b.type !== "redacted_thinking" && !(b.type === "tool_use" && !toolIdsWithSuccessfulResults.has(b.id)) && !(b.type === "tool_result" && !toolIdsWithSuccessfulResults.has(b.tool_use_id)) && !(b.type === "text" && (b.text === INTERRUPT_MESSAGE || b.text === INTERRUPT_MESSAGE_FOR_TOOL_USE));
  return messages.map((msg) => {
    if (!("message" in msg) || !Array.isArray(msg.message.content))
      return msg;
    let content = msg.message.content.filter(keep);
    if (content.length === msg.message.content.length)
      return msg;
    if (content.length === 0)
      return null;
    if (!content.some((b) => b.type !== "text" || b.text !== void 0 && b.text.trim() !== ""))
      return null;
    return { ...msg, message: { ...msg.message, content } };
  }).filter((m4) => m4 !== null);
}
function createSpeculationFeedbackMessage(messages, boundary, timeSavedMs, sessionTotalMs) {
  return null;
}
function updateActiveSpeculationState(setAppState, updater) {
  setAppState((prev) => {
    if (prev.speculation.status !== "active")
      return prev;
    let current = prev.speculation, updates = updater(current);
    if (!Object.entries(updates).some(([key2, value]) => current[key2] !== value))
      return prev;
    return {
      ...prev,
      speculation: { ...current, ...updates }
    };
  });
}
function resetSpeculationState(setAppState) {
  setAppState((prev) => {
    if (prev.speculation.status === "idle")
      return prev;
    return { ...prev, speculation: IDLE_SPECULATION_STATE };
  });
}
function isSpeculationEnabled() {
  return logForDebugging("[Speculation] enabled=false"), !1;
}
async function generatePipelinedSuggestion(context3, suggestionText, speculatedMessages, setAppState, parentAbortController) {
  try {
    let appState = context3.toolUseContext.getAppState(), suppressReason = getSuggestionSuppressReason(appState);
    if (suppressReason) {
      logSuggestionSuppressed(`pipeline_${suppressReason}`);
      return;
    }
    let augmentedContext = {
      ...context3,
      messages: [
        ...context3.messages,
        createUserMessage({ content: suggestionText }),
        ...speculatedMessages
      ]
    }, pipelineAbortController = createChildAbortController(parentAbortController);
    if (pipelineAbortController.signal.aborted)
      return;
    let promptId = getPromptVariant(), { suggestion, generationRequestId } = await generateSuggestion(pipelineAbortController, promptId, createCacheSafeParams(augmentedContext));
    if (pipelineAbortController.signal.aborted)
      return;
    if (shouldFilterSuggestion(suggestion, promptId))
      return;
    logForDebugging(`[Speculation] Pipelined suggestion: "${suggestion.slice(0, 50)}..."`), updateActiveSpeculationState(setAppState, () => ({
      pipelinedSuggestion: {
        text: suggestion,
        promptId,
        generationRequestId
      }
    }));
  } catch (error44) {
    if (error44 instanceof Error && error44.name === "AbortError")
      return;
    logForDebugging(`[Speculation] Pipelined suggestion failed: ${errorMessage(error44)}`);
  }
}
async function startSpeculation(suggestionText, context3, setAppState, isPipelined = !1, cacheSafeParams) {
  if (!isSpeculationEnabled())
    return;
  abortSpeculation(setAppState);
  let id = randomUUID5().slice(0, 8), abortController = createChildAbortController(context3.toolUseContext.abortController);
  if (abortController.signal.aborted)
    return;
  let startTime = Date.now(), messagesRef = { current: [] }, writtenPathsRef = { current: /* @__PURE__ */ new Set }, overlayPath = getOverlayPath(id), cwd2 = getCwdState();
  try {
    await mkdir5(overlayPath, { recursive: !0 });
  } catch {
    logForDebugging("[Speculation] Failed to create overlay directory");
    return;
  }
  let contextRef = { current: context3 };
  setAppState((prev) => ({
    ...prev,
    speculation: {
      status: "active",
      id,
      abort: () => abortController.abort(),
      startTime,
      messagesRef,
      writtenPathsRef,
      boundary: null,
      suggestionLength: suggestionText.length,
      toolUseCount: 0,
      isPipelined,
      contextRef
    }
  })), logForDebugging(`[Speculation] Starting speculation ${id}`);
  try {
    let result = await runForkedAgent({
      promptMessages: [createUserMessage({ content: suggestionText })],
      cacheSafeParams: cacheSafeParams ?? createCacheSafeParams(context3),
      skipTranscript: !0,
      canUseTool: async (tool, input) => {
        let isWriteTool = WRITE_TOOLS.has(tool.name), isSafeReadOnlyTool = SAFE_READ_ONLY_TOOLS.has(tool.name);
        if (isWriteTool) {
          let appState = context3.toolUseContext.getAppState(), { mode, isBypassPermissionsModeAvailable } = appState.toolPermissionContext;
          if (!(mode === "acceptEdits" || mode === "bypassPermissions" || mode === "plan" && isBypassPermissionsModeAvailable)) {
            logForDebugging(`[Speculation] Stopping at file edit: ${tool.name}`);
            let editPath = "file_path" in input ? input.file_path : void 0;
            return updateActiveSpeculationState(setAppState, () => ({
              boundary: {
                type: "edit",
                toolName: tool.name,
                filePath: editPath ?? "",
                completedAt: Date.now()
              }
            })), abortController.abort(), denySpeculation("Speculation paused: file edit requires permission", "speculation_edit_boundary");
          }
        }
        if (isWriteTool || isSafeReadOnlyTool) {
          let pathKey2 = "notebook_path" in input ? "notebook_path" : ("path" in input) ? "path" : "file_path", filePath = input[pathKey2];
          if (filePath) {
            let rel = relative8(cwd2, filePath);
            if (isAbsolute12(rel) || rel.startsWith("..")) {
              if (isWriteTool)
                return logForDebugging(`[Speculation] Denied ${tool.name}: path outside cwd: ${filePath}`), denySpeculation("Write outside cwd not allowed during speculation", "speculation_write_outside_root");
              return {
                behavior: "allow",
                updatedInput: input,
                decisionReason: {
                  type: "other",
                  reason: "speculation_read_outside_root"
                }
              };
            }
            if (isWriteTool) {
              if (!writtenPathsRef.current.has(rel)) {
                let overlayFile = join46(overlayPath, rel);
                await mkdir5(dirname26(overlayFile), { recursive: !0 });
                try {
                  await copyFile2(join46(cwd2, rel), overlayFile);
                } catch {}
                writtenPathsRef.current.add(rel);
              }
              input = { ...input, [pathKey2]: join46(overlayPath, rel) };
            } else if (writtenPathsRef.current.has(rel))
              input = { ...input, [pathKey2]: join46(overlayPath, rel) };
            return logForDebugging(`[Speculation] ${isWriteTool ? "Write" : "Read"} ${filePath} -> ${input[pathKey2]}`), {
              behavior: "allow",
              updatedInput: input,
              decisionReason: {
                type: "other",
                reason: "speculation_file_access"
              }
            };
          }
          if (isSafeReadOnlyTool)
            return {
              behavior: "allow",
              updatedInput: input,
              decisionReason: {
                type: "other",
                reason: "speculation_read_default_cwd"
              }
            };
        }
        if (tool.name === "Bash") {
          let command12 = "command" in input && typeof input.command === "string" ? input.command : "";
          if (!command12 || checkReadOnlyConstraints({ command: command12 }, commandHasAnyCd(command12)).behavior !== "allow")
            return logForDebugging(`[Speculation] Stopping at bash: ${command12.slice(0, 50) || "missing command"}`), updateActiveSpeculationState(setAppState, () => ({
              boundary: { type: "bash", command: command12, completedAt: Date.now() }
            })), abortController.abort(), denySpeculation("Speculation paused: bash boundary", "speculation_bash_boundary");
          return {
            behavior: "allow",
            updatedInput: input,
            decisionReason: {
              type: "other",
              reason: "speculation_readonly_bash"
            }
          };
        }
        logForDebugging(`[Speculation] Stopping at denied tool: ${tool.name}`);
        let detail = String("url" in input && input.url || "file_path" in input && input.file_path || "path" in input && input.path || "command" in input && input.command || "").slice(0, 200);
        return updateActiveSpeculationState(setAppState, () => ({
          boundary: {
            type: "denied_tool",
            toolName: tool.name,
            detail,
            completedAt: Date.now()
          }
        })), abortController.abort(), denySpeculation(`Tool ${tool.name} not allowed during speculation`, "speculation_unknown_tool");
      },
      querySource: "speculation",
      forkLabel: "speculation",
      maxTurns: MAX_SPECULATION_TURNS,
      overrides: { abortController, requireCanUseTool: !0 },
      onMessage: (msg) => {
        if (msg.type === "assistant" || msg.type === "user") {
          if (messagesRef.current.push(msg), messagesRef.current.length >= MAX_SPECULATION_MESSAGES)
            abortController.abort();
          if (isUserMessageWithArrayContent(msg)) {
            let newTools = count2(msg.message.content, (b) => b.type === "tool_result" && !b.is_error);
            if (newTools > 0)
              updateActiveSpeculationState(setAppState, (prev) => ({
                toolUseCount: prev.toolUseCount + newTools
              }));
          }
        }
      }
    });
    if (abortController.signal.aborted)
      return;
    updateActiveSpeculationState(setAppState, () => ({
      boundary: {
        type: "complete",
        completedAt: Date.now(),
        outputTokens: result.totalUsage.output_tokens
      }
    })), logForDebugging(`[Speculation] Complete: ${countToolsInMessages(messagesRef.current)} tools`), generatePipelinedSuggestion(contextRef.current, suggestionText, messagesRef.current, setAppState, abortController);
  } catch (error44) {
    if (abortController.abort(), error44 instanceof Error && error44.name === "AbortError") {
      safeRemoveOverlay(overlayPath), resetSpeculationState(setAppState);
      return;
    }
    safeRemoveOverlay(overlayPath), logError2(error44 instanceof Error ? error44 : Error("Speculation failed")), logSpeculation(id, "error", startTime, suggestionText.length, messagesRef.current, null, {
      error_type: error44 instanceof Error ? error44.name : "Unknown",
      error_message: errorMessage(error44).slice(0, 200),
      error_phase: "start",
      is_pipelined: isPipelined
    }), resetSpeculationState(setAppState);
  }
}
async function acceptSpeculation(state3, setAppState, cleanMessageCount) {
  if (state3.status !== "active")
    return null;
  let {
    id,
    messagesRef,
    writtenPathsRef,
    abort: abort7,
    startTime,
    suggestionLength,
    isPipelined
  } = state3, messages = messagesRef.current, overlayPath = getOverlayPath(id), acceptedAt = Date.now();
  if (abort7(), cleanMessageCount > 0)
    await copyOverlayToMain(overlayPath, writtenPathsRef.current, getCwdState());
  safeRemoveOverlay(overlayPath);
  let boundary = state3.boundary, timeSavedMs = Math.min(acceptedAt, boundary?.completedAt ?? 1 / 0) - startTime;
  if (setAppState((prev) => {
    if (prev.speculation.status === "active" && prev.speculation.boundary)
      boundary = prev.speculation.boundary, timeSavedMs = Math.min(acceptedAt, boundary.completedAt ?? 1 / 0) - startTime;
    return {
      ...prev,
      speculation: IDLE_SPECULATION_STATE,
      speculationSessionTimeSavedMs: prev.speculationSessionTimeSavedMs + timeSavedMs
    };
  }), logForDebugging(boundary === null ? `[Speculation] Accept ${id}: still running, using ${messages.length} messages` : `[Speculation] Accept ${id}: already complete`), logSpeculation(id, "accepted", startTime, suggestionLength, messages, boundary, {
    message_count: messages.length,
    time_saved_ms: timeSavedMs,
    is_pipelined: isPipelined
  }), timeSavedMs > 0) {
    let entry = {
      type: "speculation-accept",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      timeSavedMs
    };
    appendFile3(getTranscriptPath(), jsonStringify(entry) + `
`, {
      mode: 384
    }).catch(() => {
      logForDebugging("[Speculation] Failed to write speculation-accept to transcript");
    });
  }
  return { messages, boundary, timeSavedMs };
}
function abortSpeculation(setAppState) {
  setAppState((prev) => {
    if (prev.speculation.status !== "active")
      return prev;
    let {
      id,
      abort: abort7,
      startTime,
      boundary,
      suggestionLength,
      messagesRef,
      isPipelined
    } = prev.speculation;
    return logForDebugging(`[Speculation] Aborting ${id}`), logSpeculation(id, "aborted", startTime, suggestionLength, messagesRef.current, boundary, { abort_reason: "user_typed", is_pipelined: isPipelined }), abort7(), safeRemoveOverlay(getOverlayPath(id)), { ...prev, speculation: IDLE_SPECULATION_STATE };
  });
}
async function handleSpeculationAccept(speculationState, speculationSessionTimeSavedMs, setAppState, input, deps) {
  try {
    let { setMessages, readFileState, cwd: cwd2 } = deps;
    setAppState((prev) => {
      if (prev.promptSuggestion.text === null && prev.promptSuggestion.promptId === null)
        return prev;
      return {
        ...prev,
        promptSuggestion: {
          text: null,
          promptId: null,
          shownAt: 0,
          acceptedAt: 0,
          generationRequestId: null
        }
      };
    });
    let speculationMessages = speculationState.messagesRef.current, cleanMessages = prepareMessagesForInjection(speculationMessages), userMessage = createUserMessage({ content: input });
    setMessages((prev) => [...prev, userMessage]);
    let result = await acceptSpeculation(speculationState, setAppState, cleanMessages.length), isComplete = result?.boundary?.type === "complete";
    if (!isComplete) {
      let lastNonAssistant = cleanMessages.findLastIndex((m4) => m4.type !== "assistant");
      cleanMessages = cleanMessages.slice(0, lastNonAssistant + 1);
    }
    let timeSavedMs = result?.timeSavedMs ?? 0, newSessionTotal = speculationSessionTimeSavedMs + timeSavedMs, feedbackMessage = createSpeculationFeedbackMessage(cleanMessages, result?.boundary ?? null, timeSavedMs, newSessionTotal);
    setMessages((prev) => [...prev, ...cleanMessages]);
    let extracted = extractReadFilesFromMessages(cleanMessages, cwd2, READ_FILE_STATE_CACHE_SIZE);
    if (readFileState.current = mergeFileStateCaches(readFileState.current, extracted), feedbackMessage)
      setMessages((prev) => [...prev, feedbackMessage]);
    if (logForDebugging(`[Speculation] ${result?.boundary?.type ?? "incomplete"}, injected ${cleanMessages.length} messages`), isComplete && speculationState.pipelinedSuggestion) {
      let { text: text2, promptId, generationRequestId } = speculationState.pipelinedSuggestion;
      logForDebugging(`[Speculation] Promoting pipelined suggestion: "${text2.slice(0, 50)}..."`), setAppState((prev) => ({
        ...prev,
        promptSuggestion: {
          text: text2,
          promptId,
          shownAt: Date.now(),
          acceptedAt: 0,
          generationRequestId
        }
      }));
      let augmentedContext = {
        ...speculationState.contextRef.current,
        messages: [
          ...speculationState.contextRef.current.messages,
          createUserMessage({ content: input }),
          ...cleanMessages
        ]
      };
      startSpeculation(text2, augmentedContext, setAppState, !0);
    }
    return { queryRequired: !isComplete };
  } catch (error44) {
    return logError2(error44 instanceof Error ? error44 : Error("handleSpeculationAccept failed")), logSpeculation(speculationState.id, "error", speculationState.startTime, speculationState.suggestionLength, speculationState.messagesRef.current, speculationState.boundary, {
      error_type: error44 instanceof Error ? error44.name : "Unknown",
      error_message: errorMessage(error44).slice(0, 200),
      error_phase: "accept",
      is_pipelined: speculationState.isPipelined
    }), safeRemoveOverlay(getOverlayPath(speculationState.id)), resetSpeculationState(setAppState), { queryRequired: !0 };
  }
}
var MAX_SPECULATION_TURNS = 20, MAX_SPECULATION_MESSAGES = 100, WRITE_TOOLS, SAFE_READ_ONLY_TOOLS;
var init_speculation = __esm(() => {
  init_state();
  init_AppStateStore();
  init_bashPermissions();
  init_readOnlyValidation();
  init_abortController();
  init_config4();
  init_debug();
  init_errors();
  init_fileStateCache();
  init_forkedAgent();
  init_format();
  init_log3();
  init_messages3();
  init_filesystem();
  init_queryHelpers();
  init_sessionStorage();
  init_slowOperations();
  init_promptSuggestion();
  WRITE_TOOLS = /* @__PURE__ */ new Set(["Edit", "Write", "NotebookEdit"]), SAFE_READ_ONLY_TOOLS = /* @__PURE__ */ new Set([
    "Read",
    "Glob",
    "Grep",
    "ToolSearch",
    "LSP",
    "TaskGet",
    "TaskList"
  ]);
});
