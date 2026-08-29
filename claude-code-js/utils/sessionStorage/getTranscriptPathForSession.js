// function: getTranscriptPathForSession
function getTranscriptPathForSession(sessionId) {
  if (sessionId === getSessionId())
    return getTranscriptPath();
  let projectDir = getProjectDir2(getOriginalCwd());
  return join134(projectDir, `${sessionId}.jsonl`);
}
