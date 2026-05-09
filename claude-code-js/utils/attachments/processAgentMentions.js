// function: processAgentMentions
function processAgentMentions(input, agents) {
  let agentMentions = extractAgentMentions(input);
  if (agentMentions.length === 0)
    return [];
  return agentMentions.map((mention) => {
    let agentType = mention.replace("agent-", ""), agentDef = agents.find((def2) => def2.agentType === agentType);
    if (!agentDef)
      return logEvent("tengu_at_mention_agent_not_found", {}), null;
    return logEvent("tengu_at_mention_agent_success", {}), {
      type: "agent_mention",
      agentType: agentDef.agentType
    };
  }).filter((result) => result !== null);
}
