// Original: src/tools/AgentTool/builtInAgents.ts
function areExplorePlanAgentsEnabled() {
  return !1;
}
function getBuiltInAgents() {
  if (isEnvTruthy(process.env.CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS) && getIsNonInteractiveSession())
    return [];
  let agents = [
    GENERAL_PURPOSE_AGENT,
    STATUSLINE_SETUP_AGENT
  ];
  if (areExplorePlanAgentsEnabled())
    agents.push(EXPLORE_AGENT, PLAN_AGENT);
  if (process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-ts" && process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-py" && process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-cli")
    agents.push(CLAUDE_CODE_GUIDE_AGENT);
  return agents;
}
var init_builtInAgents = __esm(() => {
  init_state();
  init_envUtils();
  init_claudeCodeGuideAgent();
  init_exploreAgent();
  init_generalPurposeAgent();
  init_planAgent();
  init_statuslineSetup();
});
