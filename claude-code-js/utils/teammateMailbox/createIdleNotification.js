// function: createIdleNotification
function createIdleNotification(agentId, options2) {
  return {
    type: "idle_notification",
    from: agentId,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    idleReason: options2?.idleReason,
    summary: options2?.summary,
    completedTaskId: options2?.completedTaskId,
    completedStatus: options2?.completedStatus,
    failureReason: options2?.failureReason
  };
}
