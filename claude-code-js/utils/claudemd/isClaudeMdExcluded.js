// function: isClaudeMdExcluded
function isClaudeMdExcluded(filePath, type) {
  if (type !== "User" && type !== "Project" && type !== "Local")
    return !1;
  let patterns = getInitialSettings().claudeMdExcludes;
  if (!patterns || patterns.length === 0)
    return !1;
  let matchOpts = { dot: !0 }, normalizedPath = filePath.replaceAll("\\", "/"), expandedPatterns = resolveExcludePatterns(patterns).filter((p4) => p4.length > 0);
  if (expandedPatterns.length === 0)
    return !1;
  return import_picomatch.default.isMatch(normalizedPath, expandedPatterns, matchOpts);
}
