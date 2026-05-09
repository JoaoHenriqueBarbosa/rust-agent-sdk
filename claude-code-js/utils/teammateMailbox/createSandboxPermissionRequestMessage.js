// function: createSandboxPermissionRequestMessage
function createSandboxPermissionRequestMessage(params) {
  return {
    type: "sandbox_permission_request",
    requestId: params.requestId,
    workerId: params.workerId,
    workerName: params.workerName,
    workerColor: params.workerColor,
    hostPattern: { host: params.host },
    createdAt: Date.now()
  };
}
