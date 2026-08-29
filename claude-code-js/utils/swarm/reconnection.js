// Original: src/utils/swarm/reconnection.ts
function computeInitialTeamContext() {
  let context7 = getDynamicTeamContext();
  if (!context7?.teamName || !context7?.agentName) {
    logForDebugging("[Reconnection] computeInitialTeamContext: No teammate context set (not a teammate)");
    return;
  }
  let { teamName, agentId, agentName } = context7, teamFile = readTeamFile(teamName);
  if (!teamFile) {
    logError2(Error(`[computeInitialTeamContext] Could not read team file for ${teamName}`));
    return;
  }
  let teamFilePath = getTeamFilePath(teamName), isLeader = !agentId;
  return logForDebugging(`[Reconnection] Computed initial team context for ${isLeader ? "leader" : `teammate ${agentName}`} in team ${teamName}`), {
    teamName,
    teamFilePath,
    leadAgentId: teamFile.leadAgentId,
    selfAgentId: agentId,
    selfAgentName: agentName,
    isLeader,
    teammates: {}
  };
}
function initializeTeammateContextFromSession(setAppState, teamName, agentName) {
  let teamFile = readTeamFile(teamName);
  if (!teamFile) {
    logError2(Error(`[initializeTeammateContextFromSession] Could not read team file for ${teamName} (agent: ${agentName})`));
    return;
  }
  let member = teamFile.members.find((m4) => m4.name === agentName);
  if (!member)
    logForDebugging(`[Reconnection] Member ${agentName} not found in team ${teamName} - may have been removed`);
  let agentId = member?.agentId, teamFilePath = getTeamFilePath(teamName);
  setAppState((prev) => ({
    ...prev,
    teamContext: {
      teamName,
      teamFilePath,
      leadAgentId: teamFile.leadAgentId,
      selfAgentId: agentId,
      selfAgentName: agentName,
      isLeader: !1,
      teammates: {}
    }
  })), logForDebugging(`[Reconnection] Initialized agent context from session for ${agentName} in team ${teamName}`);
}
var init_reconnection = __esm(() => {
  init_debug();
  init_log3();
  init_teammate();
  init_teamHelpers();
});
