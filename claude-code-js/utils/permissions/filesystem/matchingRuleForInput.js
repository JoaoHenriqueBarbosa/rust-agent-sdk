// function: matchingRuleForInput
function matchingRuleForInput(path25, toolPermissionContext, toolType, behavior) {
  let fileAbsolutePath = expandPath(path25);
  if (getPlatform() === "windows" && fileAbsolutePath.includes("\\"))
    fileAbsolutePath = windowsPathToPosixPath(fileAbsolutePath);
  let patternsByRoot = getPatternsByRoot(toolPermissionContext, toolType, behavior);
  for (let [root3, patternMap] of patternsByRoot.entries()) {
    let patterns = Array.from(patternMap.keys()).map((pattern) => {
      let adjustedPattern = pattern;
      if (adjustedPattern.endsWith("/**"))
        adjustedPattern = adjustedPattern.slice(0, -3);
      return adjustedPattern;
    }), ig = import_ignore5.default().add(patterns), relativePathStr = relativePath(root3 ?? getCwd(), fileAbsolutePath ?? getCwd());
    if (relativePathStr.startsWith(`..${DIR_SEP}`))
      continue;
    if (!relativePathStr)
      continue;
    let igResult = ig.test(relativePathStr);
    if (igResult.ignored && igResult.rule) {
      let originalPattern = igResult.rule.pattern, withWildcard = originalPattern + "/**";
      if (patternMap.has(withWildcard))
        return patternMap.get(withWildcard) ?? null;
      return patternMap.get(originalPattern) ?? null;
    }
  }
  return null;
}
