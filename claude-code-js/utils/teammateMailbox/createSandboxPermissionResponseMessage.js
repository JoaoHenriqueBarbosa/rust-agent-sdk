// function: createSandboxPermissionResponseMessage
function createSandboxPermissionResponseMessage(params) {
  return {
    type: "sandbox_permission_response",
    requestId: params.requestId,
    host: params.host,
    allow: params.allow,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
}
