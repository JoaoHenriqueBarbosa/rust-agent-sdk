// function: getAgentMetadataPath
function getAgentMetadataPath(agentId) {
  return getAgentTranscriptPath(agentId).replace(/\.jsonl$/, ".meta.json");
}
