// function: getAgentTranscriptPath
function getAgentTranscriptPath(agentId) {
  let projectDir = getSessionProjectDir() ?? getProjectDir2(getOriginalCwd()), sessionId = getSessionId(), subdir = agentTranscriptSubdirs.get(agentId), base2 = subdir ? join134(projectDir, sessionId, "subagents", subdir) : join134(projectDir, sessionId, "subagents");
  return join134(base2, `agent-${agentId}.jsonl`);
}
