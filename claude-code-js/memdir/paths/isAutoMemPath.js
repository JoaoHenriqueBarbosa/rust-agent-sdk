// function: isAutoMemPath
function isAutoMemPath(absolutePath) {
  return normalize3(absolutePath).startsWith(getAutoMemPath());
}
