// Original: src/tools/AgentTool/agentDisplay.ts
function resolveAgentOverrides(allAgents, activeAgents) {
  let activeMap = /* @__PURE__ */ new Map;
  for (let agent of activeAgents)
    activeMap.set(agent.agentType, agent);
  let seen = /* @__PURE__ */ new Set, resolved = [];
  for (let agent of allAgents) {
    let key3 = `${agent.agentType}:${agent.source}`;
    if (seen.has(key3))
      continue;
    seen.add(key3);
    let active = activeMap.get(agent.agentType), overriddenBy = active && active.source !== agent.source ? active.source : void 0;
    resolved.push({ ...agent, overriddenBy });
  }
  return resolved;
}
function resolveAgentModelDisplay(agent) {
  let model = agent.model || getDefaultSubagentModel();
  if (!model)
    return;
  return model === "inherit" ? "inherit" : model;
}
function getOverrideSourceLabel(source) {
  return getSourceDisplayName(source).toLowerCase();
}
function compareAgentsByName(a2, b) {
  return a2.agentType.localeCompare(b.agentType, void 0, {
    sensitivity: "base"
  });
}
var AGENT_SOURCE_GROUPS;
var init_agentDisplay = __esm(() => {
  init_agent();
  init_constants2();
  AGENT_SOURCE_GROUPS = [
    { label: "User agents", source: "userSettings" },
    { label: "Project agents", source: "projectSettings" },
    { label: "Local agents", source: "localSettings" },
    { label: "Managed agents", source: "policySettings" },
    { label: "Plugin agents", source: "plugin" },
    { label: "CLI arg agents", source: "flagSettings" },
    { label: "Built-in agents", source: "built-in" }
  ];
});
