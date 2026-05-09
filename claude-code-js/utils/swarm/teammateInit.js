// Original: src/utils/swarm/teammateInit.ts
function initializeTeammateHooks(setAppState, sessionId, teamInfo) {
  let { teamName, agentId, agentName } = teamInfo, teamFile = readTeamFile(teamName);
  if (!teamFile) {
    logForDebugging(`[TeammateInit] Team file not found for team: ${teamName}`);
    return;
  }
  let leadAgentId = teamFile.leadAgentId;
  if (teamFile.teamAllowedPaths && teamFile.teamAllowedPaths.length > 0) {
    logForDebugging(`[TeammateInit] Found ${teamFile.teamAllowedPaths.length} team-wide allowed path(s)`);
    for (let allowedPath of teamFile.teamAllowedPaths) {
      let ruleContent = allowedPath.path.startsWith("/") ? `/${allowedPath.path}/**` : `${allowedPath.path}/**`;
      logForDebugging(`[TeammateInit] Applying team permission: ${allowedPath.toolName} allowed in ${allowedPath.path} (rule: ${ruleContent})`), setAppState((prev) => ({
        ...prev,
        toolPermissionContext: applyPermissionUpdate(prev.toolPermissionContext, {
          type: "addRules",
          rules: [
            {
              toolName: allowedPath.toolName,
              ruleContent
            }
          ],
          behavior: "allow",
          destination: "session"
        })
      }));
    }
  }
  let leadAgentName = teamFile.members.find((m4) => m4.agentId === leadAgentId)?.name || "team-lead";
  if (agentId === leadAgentId) {
    logForDebugging("[TeammateInit] This agent is the team leader - skipping idle notification hook");
    return;
  }
  logForDebugging(`[TeammateInit] Registering Stop hook for teammate ${agentName} to notify leader ${leadAgentName}`), addFunctionHook(setAppState, sessionId, "Stop", "", async (messages, _signal) => {
    setMemberActive(teamName, agentName, !1);
    let notification = createIdleNotification(agentName, {
      idleReason: "available",
      summary: getLastPeerDmSummary(messages)
    });
    return await writeToMailbox(leadAgentName, {
      from: agentName,
      text: jsonStringify(notification),
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      color: getTeammateColor()
    }), logForDebugging(`[TeammateInit] Sent idle notification to leader ${leadAgentName}`), !0;
  }, "Failed to send idle notification to team leader", {
    timeout: 1e4
  });
}
var init_teammateInit = __esm(() => {
  init_debug();
  init_sessionHooks();
  init_PermissionUpdate();
  init_slowOperations();
  init_teammate();
  init_teammateMailbox();
  init_teamHelpers();
});
