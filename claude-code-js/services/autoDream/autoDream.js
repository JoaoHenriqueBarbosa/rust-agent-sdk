// Original: src/services/autoDream/autoDream.ts
function getConfig4() {
  return { ...DEFAULTS2 };
}
function isGateOpen() {
  if (getKairosActive())
    return !1;
  if (getIsRemoteMode())
    return !1;
  if (!isAutoMemoryEnabled())
    return !1;
  return isAutoDreamEnabled();
}
function isForced() {
  return !1;
}
function initAutoDream() {
  let lastSessionScanAt = 0;
  runner = async function(context6, appendSystemMessage) {
    let cfg = getConfig4(), force = isForced();
    if (!force && !isGateOpen())
      return;
    let lastAt;
    try {
      lastAt = await readLastConsolidatedAt();
    } catch (e) {
      logForDebugging(`[autoDream] readLastConsolidatedAt failed: ${e.message}`);
      return;
    }
    let hoursSince = (Date.now() - lastAt) / 3600000;
    if (!force && hoursSince < cfg.minHours)
      return;
    let sinceScanMs = Date.now() - lastSessionScanAt;
    if (!force && sinceScanMs < SESSION_SCAN_INTERVAL_MS) {
      logForDebugging(`[autoDream] scan throttle \u2014 time-gate passed but last scan was ${Math.round(sinceScanMs / 1000)}s ago`);
      return;
    }
    lastSessionScanAt = Date.now();
    let sessionIds;
    try {
      sessionIds = await listSessionsTouchedSince(lastAt);
    } catch (e) {
      logForDebugging(`[autoDream] listSessionsTouchedSince failed: ${e.message}`);
      return;
    }
    let currentSession = getSessionId();
    if (sessionIds = sessionIds.filter((id) => id !== currentSession), !force && sessionIds.length < cfg.minSessions) {
      logForDebugging(`[autoDream] skip \u2014 ${sessionIds.length} sessions since last consolidation, need ${cfg.minSessions}`);
      return;
    }
    let priorMtime;
    if (force)
      priorMtime = lastAt;
    else {
      try {
        priorMtime = await tryAcquireConsolidationLock();
      } catch (e) {
        logForDebugging(`[autoDream] lock acquire failed: ${e.message}`);
        return;
      }
      if (priorMtime === null)
        return;
    }
    logForDebugging(`[autoDream] firing \u2014 ${hoursSince.toFixed(1)}h since last, ${sessionIds.length} sessions to review`), logEvent("tengu_auto_dream_fired", {
      hours_since: Math.round(hoursSince),
      sessions_since: sessionIds.length
    });
    let setAppState = context6.toolUseContext.setAppStateForTasks ?? context6.toolUseContext.setAppState, abortController = new AbortController, taskId = registerDreamTask(setAppState, {
      sessionsReviewing: sessionIds.length,
      priorMtime,
      abortController
    });
    try {
      let memoryRoot = getAutoMemPath(), transcriptDir = getProjectDir2(getOriginalCwd()), extra = `

**Tool constraints for this run:** Bash is restricted to read-only commands (\`ls\`, \`find\`, \`grep\`, \`cat\`, \`stat\`, \`wc\`, \`head\`, \`tail\`, and similar). Anything that writes, redirects to a file, or modifies state will be denied. Plan your exploration with this in mind \u2014 no need to probe.

Sessions since last consolidation (${sessionIds.length}):
${sessionIds.map((id) => `- ${id}`).join(`
`)}`, prompt = buildConsolidationPrompt(memoryRoot, transcriptDir, extra), result = await runForkedAgent({
        promptMessages: [createUserMessage({ content: prompt })],
        cacheSafeParams: createCacheSafeParams(context6),
        canUseTool: createAutoMemCanUseTool(memoryRoot),
        querySource: "auto_dream",
        forkLabel: "auto_dream",
        skipTranscript: !0,
        overrides: { abortController },
        onMessage: makeDreamProgressWatcher(taskId, setAppState)
      });
      completeDreamTask(taskId, setAppState);
      let dreamState = context6.toolUseContext.getAppState().tasks?.[taskId];
      if (appendSystemMessage && isDreamTask(dreamState) && dreamState.filesTouched.length > 0)
        appendSystemMessage({
          ...createMemorySavedMessage(dreamState.filesTouched),
          verb: "Improved"
        });
      logForDebugging(`[autoDream] completed \u2014 cache: read=${result.totalUsage.cache_read_input_tokens} created=${result.totalUsage.cache_creation_input_tokens}`), logEvent("tengu_auto_dream_completed", {
        cache_read: result.totalUsage.cache_read_input_tokens,
        cache_created: result.totalUsage.cache_creation_input_tokens,
        output: result.totalUsage.output_tokens,
        sessions_reviewed: sessionIds.length
      });
    } catch (e) {
      if (abortController.signal.aborted) {
        logForDebugging("[autoDream] aborted by user");
        return;
      }
      logForDebugging(`[autoDream] fork failed: ${e.message}`), logEvent("tengu_auto_dream_failed", {}), failDreamTask(taskId, setAppState), await rollbackConsolidationLock(priorMtime);
    }
  };
}
function makeDreamProgressWatcher(taskId, setAppState) {
  return (msg) => {
    if (msg.type !== "assistant")
      return;
    let text2 = "", toolUseCount = 0, touchedPaths = [];
    for (let block2 of msg.message.content)
      if (block2.type === "text")
        text2 += block2.text;
      else if (block2.type === "tool_use") {
        if (toolUseCount++, block2.name === FILE_EDIT_TOOL_NAME || block2.name === FILE_WRITE_TOOL_NAME) {
          let input = block2.input;
          if (typeof input.file_path === "string")
            touchedPaths.push(input.file_path);
        }
      }
    addDreamTurn(taskId, { text: text2.trim(), toolUseCount }, touchedPaths, setAppState);
  };
}
async function executeAutoDream(context6, appendSystemMessage) {
  await runner?.(context6, appendSystemMessage);
}
var SESSION_SCAN_INTERVAL_MS = 600000, DEFAULTS2, runner = null;
var init_autoDream = __esm(() => {
  init_forkedAgent();
  init_messages3();
  init_debug();
  init_paths();
  init_config11();
  init_sessionStorage();
  init_state();
  init_extractMemories();
  init_consolidationPrompt();
  init_consolidationLock();
  init_DreamTask();
  init_prompt4();
  DEFAULTS2 = {
    minHours: 24,
    minSessions: 5
  };
});
