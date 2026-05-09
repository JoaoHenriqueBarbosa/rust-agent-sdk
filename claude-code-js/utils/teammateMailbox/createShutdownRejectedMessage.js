// function: createShutdownRejectedMessage
function createShutdownRejectedMessage(params) {
  return {
    type: "shutdown_rejected",
    requestId: params.requestId,
    from: params.from,
    reason: params.reason,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
}
