// function: getAgentPendingMessageAttachments
function getAgentPendingMessageAttachments(toolUseContext) {
  let agentId = toolUseContext.agentId;
  if (!agentId)
    return [];
  return drainPendingMessages(agentId, toolUseContext.getAppState, toolUseContext.setAppStateForTasks ?? toolUseContext.setAppState).map((msg) => ({
    type: "queued_command",
    prompt: msg,
    origin: { kind: "coordinator" },
    isMeta: !0
  }));
}
