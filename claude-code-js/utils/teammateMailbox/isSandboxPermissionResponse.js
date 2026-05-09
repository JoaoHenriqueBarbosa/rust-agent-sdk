// function: isSandboxPermissionResponse
function isSandboxPermissionResponse(messageText) {
  try {
    let parsed = jsonParse(messageText);
    if (parsed && parsed.type === "sandbox_permission_response")
      return parsed;
  } catch {}
  return null;
}
