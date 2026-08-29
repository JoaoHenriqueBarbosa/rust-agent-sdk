// function: toPosixPath
function toPosixPath(path25) {
  if (getPlatform() === "windows")
    return windowsPathToPosixPath(path25);
  return path25;
}
