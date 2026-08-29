// function: isDuplicatePath
function isDuplicatePath(fs2, filePath, loadedPaths) {
  let { resolvedPath } = safeResolvePath(fs2, filePath);
  if (loadedPaths.has(resolvedPath))
    return !0;
  return loadedPaths.add(resolvedPath), !1;
}
