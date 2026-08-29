// function: getRemoteAgentsDir
function getRemoteAgentsDir() {
  let projectDir = getSessionProjectDir() ?? getProjectDir2(getOriginalCwd());
  return join134(projectDir, getSessionId(), "remote-agents");
}
