// function: isPermissionRequest
function isPermissionRequest(messageText) {
  try {
    let parsed = jsonParse(messageText);
    if (parsed && parsed.type === "permission_request")
      return parsed;
  } catch {}
  return null;
}
