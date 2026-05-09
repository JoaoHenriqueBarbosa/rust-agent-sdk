// function: findFirstNonExistentComponent
function findFirstNonExistentComponent(targetPath) {
  let parts = targetPath.split(path14.sep), currentPath = "";
  for (let part of parts) {
    if (!part)
      continue;
    let nextPath = currentPath + path14.sep + part;
    if (!fs12.existsSync(nextPath))
      return nextPath;
    currentPath = nextPath;
  }
  return targetPath;
}
