// function: getRemoteAgentMetadataPath
function getRemoteAgentMetadataPath(taskId) {
  return join134(getRemoteAgentsDir(), `remote-agent-${taskId}.meta.json`);
}
