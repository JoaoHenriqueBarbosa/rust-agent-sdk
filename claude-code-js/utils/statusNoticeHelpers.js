// Original: src/utils/statusNoticeHelpers.ts
function getAgentDescriptionsTotalTokens(agentDefinitions) {
  if (!agentDefinitions)
    return 0;
  return agentDefinitions.activeAgents.filter((a2) => a2.source !== "built-in").reduce((total, agent) => {
    let description = `${agent.agentType}: ${agent.whenToUse}`;
    return total + roughTokenCountEstimation(description);
  }, 0);
}
var AGENT_DESCRIPTIONS_THRESHOLD = 15000;
var init_statusNoticeHelpers = __esm(() => {
  init_tokenEstimation();
});
