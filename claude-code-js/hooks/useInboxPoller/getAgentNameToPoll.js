// function: getAgentNameToPoll
function getAgentNameToPoll(appState) {
  if (isInProcessTeammate())
    return;
  if (isTeammate())
    return getAgentName();
  if (isTeamLead(appState.teamContext)) {
    let leadAgentId = appState.teamContext.leadAgentId;
    return appState.teamContext.teammates[leadAgentId]?.name || "team-lead";
  }
  return;
}
