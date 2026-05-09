// function: createShutdownApprovedMessage
function createShutdownApprovedMessage(params) {
  return {
    type: "shutdown_approved",
    requestId: params.requestId,
    from: params.from,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    paneId: params.paneId,
    backendType: params.backendType
  };
}
