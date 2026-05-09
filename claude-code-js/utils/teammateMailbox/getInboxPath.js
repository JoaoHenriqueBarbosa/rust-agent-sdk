// function: getInboxPath
function getInboxPath(agentName, teamName) {
  let team = teamName || getTeamName() || "default", safeTeam = sanitizePathComponent(team), safeAgentName = sanitizePathComponent(agentName), inboxDir = join71(getTeamsDir(), safeTeam, "inboxes"), fullPath = join71(inboxDir, `${safeAgentName}.json`);
  return logForDebugging(`[TeammateMailbox] getInboxPath: agent=${agentName}, team=${team}, fullPath=${fullPath}`), fullPath;
}
