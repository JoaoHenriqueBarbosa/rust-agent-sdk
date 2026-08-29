// function: safeResolvePath
function safeResolvePath(fs2, filePath) {
  if (filePath.startsWith("//") || filePath.startsWith("\\\\"))
    return { resolvedPath: filePath, isSymlink: !1, isCanonical: !1 };
  try {
    let stats = fs2.lstatSync(filePath);
    if (stats.isFIFO() || stats.isSocket() || stats.isCharacterDevice() || stats.isBlockDevice())
      return { resolvedPath: filePath, isSymlink: !1, isCanonical: !1 };
    let resolvedPath = fs2.realpathSync(filePath);
    return {
      resolvedPath,
      isSymlink: resolvedPath !== filePath,
      isCanonical: !0
    };
  } catch (_error) {
    return { resolvedPath: filePath, isSymlink: !1, isCanonical: !1 };
  }
}
