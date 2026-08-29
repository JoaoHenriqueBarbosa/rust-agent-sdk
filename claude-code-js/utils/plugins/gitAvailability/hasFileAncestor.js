// function: hasFileAncestor
function hasFileAncestor(targetPath) {
  let parts = targetPath.split(path14.sep), currentPath = "";
  for (let part of parts) {
    if (!part)
      continue;
    let nextPath = currentPath + path14.sep + part;
    try {
      let stat12 = fs12.statSync(nextPath);
      if (stat12.isFile() || stat12.isSymbolicLink())
        return !0;
    } catch {
      break;
    }
    currentPath = nextPath;
  }
  return !1;
}
