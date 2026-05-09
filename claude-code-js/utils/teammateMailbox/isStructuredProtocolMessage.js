// function: isStructuredProtocolMessage
function isStructuredProtocolMessage(messageText) {
  try {
    let parsed = jsonParse(messageText);
    if (!parsed || typeof parsed !== "object" || !("type" in parsed))
      return !1;
    let type = parsed.type;
    return type === "permission_request" || type === "permission_response" || type === "sandbox_permission_request" || type === "sandbox_permission_response" || type === "shutdown_request" || type === "shutdown_approved" || type === "team_permission_update" || type === "mode_set_request" || type === "plan_approval_request" || type === "plan_approval_response";
  } catch {
    return !1;
  }
}
