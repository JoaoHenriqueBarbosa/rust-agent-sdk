// function: isCustomSubagentType
function isCustomSubagentType(subagentType) {
  return !!subagentType && subagentType !== GENERAL_PURPOSE_AGENT.agentType && subagentType !== "worker";
}
