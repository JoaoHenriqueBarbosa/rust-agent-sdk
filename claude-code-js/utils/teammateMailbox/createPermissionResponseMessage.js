// function: createPermissionResponseMessage
function createPermissionResponseMessage(params) {
  if (params.subtype === "error")
    return {
      type: "permission_response",
      request_id: params.request_id,
      subtype: "error",
      error: params.error || "Permission denied"
    };
  return {
    type: "permission_response",
    request_id: params.request_id,
    subtype: "success",
    response: {
      updated_input: params.updated_input,
      permission_updates: params.permission_updates
    }
  };
}
