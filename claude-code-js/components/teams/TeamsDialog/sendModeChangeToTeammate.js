// function: sendModeChangeToTeammate
function sendModeChangeToTeammate(teammateName, teamName, targetMode) {
  setMemberMode(teamName, teammateName, targetMode);
  let message = createModeSetRequestMessage({
    mode: targetMode,
    from: "team-lead"
  });
  writeToMailbox(teammateName, {
    from: "team-lead",
    text: jsonStringify(message),
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  }, teamName), logForDebugging(`[TeamsDialog] Sent mode change to ${teammateName}: ${targetMode}`);
}
