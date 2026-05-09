// function: shouldDeferLspTool
function shouldDeferLspTool(tool) {
  if (!("isLsp" in tool) || !tool.isLsp)
    return !1;
  let status2 = getInitializationStatus();
  return status2.status === "pending" || status2.status === "not-started";
}
