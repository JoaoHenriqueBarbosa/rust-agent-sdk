// function: createPermissionRequestMessage
function createPermissionRequestMessage(params) {
  return {
    type: "permission_request",
    request_id: params.request_id,
    agent_id: params.agent_id,
    tool_name: params.tool_name,
    tool_use_id: params.tool_use_id,
    description: params.description,
    input: params.input,
    permission_suggestions: params.permission_suggestions || []
  };
}
