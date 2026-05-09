// function: isTeamPermissionUpdate
function isTeamPermissionUpdate(messageText) {
  try {
    let parsed = jsonParse(messageText);
    if (parsed && parsed.type === "team_permission_update")
      return parsed;
  } catch {}
  return null;
}
