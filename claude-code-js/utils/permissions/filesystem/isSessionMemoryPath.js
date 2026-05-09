// function: isSessionMemoryPath
function isSessionMemoryPath(absolutePath) {
  return normalize15(absolutePath).startsWith(getSessionMemoryDir());
}
