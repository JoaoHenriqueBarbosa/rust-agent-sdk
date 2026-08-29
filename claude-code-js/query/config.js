// Original: src/query/config.ts
function buildQueryConfig() {
  return {
    sessionId: getSessionId(),
    gates: {
      streamingToolExecution: !1,
      emitToolUseSummaries: isEnvTruthy(process.env.CLAUDE_CODE_EMIT_TOOL_USE_SUMMARIES),
      isAnt: !0,
      fastModeEnabled: !isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_FAST_MODE)
    }
  };
}
var init_config12 = __esm(() => {
  init_state();
  init_envUtils();
});
