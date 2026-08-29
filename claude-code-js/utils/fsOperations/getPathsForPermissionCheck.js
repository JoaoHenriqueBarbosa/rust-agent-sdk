// function: getPathsForPermissionCheck
function getPathsForPermissionCheck(inputPath) {
  let path2 = inputPath;
  if (path2 === "~")
    path2 = homedir2().normalize("NFC");
  else if (path2.startsWith("~/"))
    path2 = nodePath.join(homedir2().normalize("NFC"), path2.slice(2));
  let pathSet = /* @__PURE__ */ new Set, fsImpl = getFsImplementation();
  if (pathSet.add(path2), path2.startsWith("//") || path2.startsWith("\\\\"))
    return Array.from(pathSet);
  try {
    let currentPath = path2, visited = /* @__PURE__ */ new Set, maxDepth = 40;
    for (let depth = 0;depth < maxDepth; depth++) {
      if (visited.has(currentPath))
        break;
      if (visited.add(currentPath), !fsImpl.existsSync(currentPath)) {
        if (currentPath === path2) {
          let resolved = resolveDeepestExistingAncestorSync(fsImpl, path2);
          if (resolved !== void 0)
            pathSet.add(resolved);
        }
        break;
      }
      let stats = fsImpl.lstatSync(currentPath);
      if (stats.isFIFO() || stats.isSocket() || stats.isCharacterDevice() || stats.isBlockDevice())
        break;
      if (!stats.isSymbolicLink())
        break;
      let target = fsImpl.readlinkSync(currentPath), absoluteTarget = nodePath.isAbsolute(target) ? target : nodePath.resolve(nodePath.dirname(currentPath), target);
      pathSet.add(absoluteTarget), currentPath = absoluteTarget;
    }
  } catch {}
  let { resolvedPath, isSymlink } = safeResolvePath(fsImpl, path2);
  if (isSymlink && resolvedPath !== path2)
    pathSet.add(resolvedPath);
  return Array.from(pathSet);
}
