// Original: src/commands/agents/index.ts
var agents, agents_default;
var init_agents2 = __esm(() => {
  agents = {
    type: "local-jsx",
    name: "agents",
    description: "Manage agent configurations",
    load: () => Promise.resolve().then(() => (init_agents(), exports_agents))
  }, agents_default = agents;
});
