// function: sendShutdownRequestToMailbox
async function sendShutdownRequestToMailbox(targetName, teamName, reason) {
  let resolvedTeamName = teamName || getTeamName(), senderName = getAgentName() || TEAM_LEAD_NAME, requestId = generateRequestId("shutdown", targetName), shutdownMessage = createShutdownRequestMessage({
    requestId,
    from: senderName,
    reason
  });
  return await writeToMailbox(targetName, {
    from: senderName,
    text: jsonStringify(shutdownMessage),
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    color: getTeammateColor()
  }, resolvedTeamName), { requestId, target: targetName };
}
