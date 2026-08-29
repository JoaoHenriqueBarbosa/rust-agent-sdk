// function: isSandboxPermissionRequest
function isSandboxPermissionRequest(messageText) {
  try {
    let parsed = jsonParse(messageText);
    if (parsed && parsed.type === "sandbox_permission_request")
      return parsed;
  } catch {}
  return null;
}
