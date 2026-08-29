// function: getTranscriptPath
function getTranscriptPath() {
  let projectDir = getSessionProjectDir() ?? getProjectDir2(getOriginalCwd());
  return join134(projectDir, `${getSessionId()}.jsonl`);
}
