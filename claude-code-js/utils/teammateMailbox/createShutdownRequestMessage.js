// function: createShutdownRequestMessage
function createShutdownRequestMessage(params) {
  return {
    type: "shutdown_request",
    requestId: params.requestId,
    from: params.from,
    reason: params.reason,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
}
