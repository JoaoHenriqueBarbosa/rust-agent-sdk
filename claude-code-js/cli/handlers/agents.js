// Original: src/cli/handlers/agents.ts
var exports_agents2 = {};
__export(exports_agents2, {
  agentsHandler: () => agentsHandler
});
function formatAgent(agent) {
  let model = resolveAgentModelDisplay(agent), parts = [agent.agentType];
  if (model)
    parts.push(model);
  if (agent.memory)
    parts.push(`${agent.memory} memory`);
  return parts.join(" \xB7 ");
}
async function agentsHandler() {
  let cwd5 = getCwd(), { allAgents } = await getAgentDefinitionsWithOverrides(cwd5), activeAgents = getActiveAgentsFromList(allAgents), resolvedAgents = resolveAgentOverrides(allAgents, activeAgents), lines2 = [], totalActive = 0;
  for (let { label, source } of AGENT_SOURCE_GROUPS) {
    let groupAgents = resolvedAgents.filter((a2) => a2.source === source).sort(compareAgentsByName);
    if (groupAgents.length === 0)
      continue;
    lines2.push(`${label}:`);
    for (let agent of groupAgents)
      if (agent.overriddenBy) {
        let winnerSource = getOverrideSourceLabel(agent.overriddenBy);
        lines2.push(`  (shadowed by ${winnerSource}) ${formatAgent(agent)}`);
      } else
        lines2.push(`  ${formatAgent(agent)}`), totalActive++;
    lines2.push("");
  }
  if (lines2.length === 0)
    console.log("No agents found.");
  else
    console.log(`${totalActive} active agents
`), console.log(lines2.join(`
`).trimEnd());
}
var init_agents3 = __esm(() => {
  init_agentDisplay();
  init_loadAgentsDir();
  init_cwd2();
});
