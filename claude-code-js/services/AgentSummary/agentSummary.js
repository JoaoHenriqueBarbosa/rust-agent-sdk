// Original: src/services/AgentSummary/agentSummary.ts
function buildSummaryPrompt(previousSummary) {
  return `Describe your most recent action in 3-5 words using present tense (-ing). Name the file or function, not the branch. Do not use tools.
${previousSummary ? `
Previous: "${previousSummary}" \u2014 say something NEW.
` : ""}
Good: "Reading runAgent.ts"
Good: "Fixing null check in validate.ts"
Good: "Running auth module tests"
Good: "Adding retry logic to fetchUser"

Bad (past tense): "Analyzed the branch diff"
Bad (too vague): "Investigating the issue"
Bad (too long): "Reviewing full branch diff and AgentTool.tsx integration"
Bad (branch name): "Analyzed adam/background-summary branch diff"`;
}
function startAgentSummarization(taskId, agentId, cacheSafeParams, setAppState) {
  let { forkContextMessages: _drop, ...baseParams } = cacheSafeParams, summaryAbortController = null, timeoutId = null, stopped = !1, previousSummary = null;
  async function runSummary() {
    if (stopped)
      return;
    logForDebugging(`[AgentSummary] Timer fired for agent ${agentId}`);
    try {
      let transcript = await getAgentTranscript(agentId);
      if (!transcript || transcript.messages.length < 3) {
        logForDebugging(`[AgentSummary] Skipping summary for ${taskId}: not enough messages (${transcript?.messages.length ?? 0})`);
        return;
      }
      let cleanMessages = filterIncompleteToolCalls(transcript.messages), forkParams = {
        ...baseParams,
        forkContextMessages: cleanMessages
      };
      logForDebugging(`[AgentSummary] Forking for summary, ${cleanMessages.length} messages in context`), summaryAbortController = new AbortController;
      let canUseTool = async () => ({
        behavior: "deny",
        message: "No tools needed for summary",
        decisionReason: { type: "other", reason: "summary only" }
      }), result = await runForkedAgent({
        promptMessages: [
          createUserMessage({ content: buildSummaryPrompt(previousSummary) })
        ],
        cacheSafeParams: forkParams,
        canUseTool,
        querySource: "agent_summary",
        forkLabel: "agent_summary",
        overrides: { abortController: summaryAbortController },
        skipTranscript: !0
      });
      if (stopped)
        return;
      for (let msg of result.messages) {
        if (msg.type !== "assistant")
          continue;
        if (msg.isApiErrorMessage) {
          logForDebugging(`[AgentSummary] Skipping API error message for ${taskId}`);
          continue;
        }
        let textBlock = msg.message.content.find((b) => b.type === "text");
        if (textBlock?.type === "text" && textBlock.text.trim()) {
          let summaryText = textBlock.text.trim();
          logForDebugging(`[AgentSummary] Summary result for ${taskId}: ${summaryText}`), previousSummary = summaryText, updateAgentSummary(taskId, summaryText, setAppState);
          break;
        }
      }
    } catch (e) {
      if (!stopped && e instanceof Error)
        logError2(e);
    } finally {
      if (summaryAbortController = null, !stopped)
        scheduleNext();
    }
  }
  function scheduleNext() {
    if (stopped)
      return;
    timeoutId = setTimeout(runSummary, SUMMARY_INTERVAL_MS);
  }
  function stop() {
    if (logForDebugging(`[AgentSummary] Stopping summarization for ${taskId}`), stopped = !0, timeoutId)
      clearTimeout(timeoutId), timeoutId = null;
    if (summaryAbortController)
      summaryAbortController.abort(), summaryAbortController = null;
  }
  return scheduleNext(), { stop };
}
var SUMMARY_INTERVAL_MS = 30000;
var init_agentSummary = __esm(() => {
  init_LocalAgentTask();
  init_runAgent();
  init_debug();
  init_forkedAgent();
  init_log3();
  init_messages3();
  init_sessionStorage();
});
