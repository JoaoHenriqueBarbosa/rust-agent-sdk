// Original: src/utils/agentSwarmsEnabled.ts
function isAgentTeamsFlagSet() {
  return process.argv.includes("--agent-teams");
}
function isAgentSwarmsEnabled() {
  if (!isEnvTruthy(process.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS) && !isAgentTeamsFlagSet())
    return !1;
  return !0;
}
var init_agentSwarmsEnabled = __esm(() => {
  init_envUtils();
});
