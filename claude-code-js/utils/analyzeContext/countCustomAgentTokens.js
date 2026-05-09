// function: countCustomAgentTokens
async function countCustomAgentTokens(agentDefinitions) {
  let customAgents = agentDefinitions.activeAgents.filter((a2) => a2.source !== "built-in"), agentDetails = [], agentTokens = 0, tokenCounts = await Promise.all(customAgents.map((agent) => countTokensWithFallback([
    {
      role: "user",
      content: [agent.agentType, agent.whenToUse].join(" ")
    }
  ], [])));
  for (let [i5, agent] of customAgents.entries()) {
    let tokens = tokenCounts[i5] || 0;
    agentTokens += tokens || 0, agentDetails.push({
      agentType: agent.agentType,
      source: agent.source,
      tokens: tokens || 0
    });
  }
  return { agentTokens, agentDetails };
}
