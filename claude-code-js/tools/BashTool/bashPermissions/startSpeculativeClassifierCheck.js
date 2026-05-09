// function: startSpeculativeClassifierCheck
function startSpeculativeClassifierCheck(command12, toolPermissionContext, signal, isNonInteractiveSession) {
  if (!isClassifierPermissionsEnabled())
    return !1;
  if (toolPermissionContext.mode === "bypassPermissions")
    return !1;
  let allowDescriptions = getBashPromptAllowDescriptions(toolPermissionContext);
  if (allowDescriptions.length === 0)
    return !1;
  let cwd2 = getCwd(), promise3 = classifyBashCommand(command12, cwd2, allowDescriptions, "allow", signal, isNonInteractiveSession);
  return promise3.catch(() => {}), speculativeChecks.set(command12, promise3), !0;
}
