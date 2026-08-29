// Original: src/hooks/useSwarmInitialization.ts
function useSwarmInitialization(setAppState, initialMessages, { enabled: enabled2 = !0 } = {}) {
  import_react267.useEffect(() => {
    if (!enabled2)
      return;
    if (isAgentSwarmsEnabled()) {
      let firstMessage = initialMessages?.[0], teamName = firstMessage && "teamName" in firstMessage ? firstMessage.teamName : void 0, agentName = firstMessage && "agentName" in firstMessage ? firstMessage.agentName : void 0;
      if (teamName && agentName) {
        initializeTeammateContextFromSession(setAppState, teamName, agentName);
        let member = readTeamFile(teamName)?.members.find((m4) => m4.name === agentName);
        if (member)
          initializeTeammateHooks(setAppState, getSessionId(), {
            teamName,
            agentId: member.agentId,
            agentName
          });
      } else {
        let context7 = getDynamicTeamContext?.();
        if (context7?.teamName && context7?.agentId && context7?.agentName)
          initializeTeammateHooks(setAppState, getSessionId(), {
            teamName: context7.teamName,
            agentId: context7.agentId,
            agentName: context7.agentName
          });
      }
    }
  }, [setAppState, initialMessages, enabled2]);
}
var import_react267;
var init_useSwarmInitialization = __esm(() => {
  init_state();
  init_agentSwarmsEnabled();
  init_reconnection();
  init_teamHelpers();
  init_teammateInit();
  init_teammate();
  import_react267 = __toESM(require_react_development(), 1);
});
