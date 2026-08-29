// function: getSessionMemoryDir
function getSessionMemoryDir() {
  return join136(getProjectDir2(getCwd()), getSessionId(), "session-memory") + sep32;
}
