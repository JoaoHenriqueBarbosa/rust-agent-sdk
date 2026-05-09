// function: getFileReadIgnorePatterns
function getFileReadIgnorePatterns(toolPermissionContext) {
  let patternsByRoot = getPatternsByRoot(toolPermissionContext, "read", "deny"), result = /* @__PURE__ */ new Map;
  for (let [patternRoot, patternMap] of patternsByRoot.entries())
    result.set(patternRoot, Array.from(patternMap.keys()));
  return result;
}
