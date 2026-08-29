// function: relativePath
function relativePath(from, to) {
  if (getPlatform() === "windows") {
    let posixFrom = windowsPathToPosixPath(from), posixTo = windowsPathToPosixPath(to);
    return posix7.relative(posixFrom, posixTo);
  }
  return posix7.relative(from, to);
}
