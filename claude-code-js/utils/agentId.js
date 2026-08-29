// Original: src/utils/agentId.ts
function formatAgentId(agentName, teamName) {
  return `${agentName}@${teamName}`;
}
function parseAgentId(agentId) {
  let atIndex = agentId.indexOf("@");
  if (atIndex === -1)
    return null;
  return {
    agentName: agentId.slice(0, atIndex),
    teamName: agentId.slice(atIndex + 1)
  };
}
function generateRequestId(requestType, agentId) {
  let timestamp = Date.now();
  return `${requestType}-${timestamp}@${agentId}`;
}
