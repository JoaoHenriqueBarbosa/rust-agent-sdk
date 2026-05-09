// function: findSymlinkInPath
function findSymlinkInPath(targetPath, allowedWritePaths) {
  let parts = targetPath.split(path14.sep), currentPath = "";
  for (let part of parts) {
    if (!part)
      continue;
    let nextPath = currentPath + path14.sep + part;
    try {
      if (fs12.lstatSync(nextPath).isSymbolicLink()) {
        if (allowedWritePaths.some((allowedPath) => nextPath.startsWith(allowedPath + "/") || nextPath === allowedPath))
          return nextPath;
      }
    } catch {
      break;
    }
    currentPath = nextPath;
  }
  return null;
}
