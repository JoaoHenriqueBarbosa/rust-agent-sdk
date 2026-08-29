// function: isPermissionResponse
function isPermissionResponse(messageText) {
  try {
    let parsed = jsonParse(messageText);
    if (parsed && parsed.type === "permission_response")
      return parsed;
  } catch {}
  return null;
}
