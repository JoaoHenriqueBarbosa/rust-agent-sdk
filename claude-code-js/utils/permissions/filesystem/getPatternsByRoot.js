// function: getPatternsByRoot
function getPatternsByRoot(toolPermissionContext, toolType, behavior) {
  let toolName = (() => {
    switch (toolType) {
      case "edit":
        return FILE_EDIT_TOOL_NAME;
      case "read":
        return FILE_READ_TOOL_NAME;
    }
  })(), rules2 = getRuleByContentsForToolName(toolPermissionContext, toolName, behavior), patternsByRoot = /* @__PURE__ */ new Map;
  for (let [pattern, rule] of rules2.entries()) {
    let { relativePattern, root: root3 } = patternWithRoot(pattern, rule.source), patternsForRoot = patternsByRoot.get(root3);
    if (patternsForRoot === void 0)
      patternsForRoot = /* @__PURE__ */ new Map, patternsByRoot.set(root3, patternsForRoot);
    patternsForRoot.set(relativePattern, rule);
  }
  return patternsByRoot;
}
