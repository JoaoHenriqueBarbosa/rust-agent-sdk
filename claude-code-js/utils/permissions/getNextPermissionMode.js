// Original: src/utils/permissions/getNextPermissionMode.ts
function canCycleToAuto(_ctx) {
  return !1;
}
function getNextPermissionMode(toolPermissionContext, _teamContext) {
  switch (toolPermissionContext.mode) {
    case "default":
      return "acceptEdits";
    case "acceptEdits":
      return "plan";
    case "plan":
      if (toolPermissionContext.isBypassPermissionsModeAvailable)
        return "bypassPermissions";
      if (canCycleToAuto(toolPermissionContext))
        return "auto";
      return "default";
    case "bypassPermissions":
      if (canCycleToAuto(toolPermissionContext))
        return "auto";
      return "default";
    case "dontAsk":
      return "default";
    default:
      return "default";
  }
}
function cyclePermissionMode(toolPermissionContext, teamContext) {
  let nextMode = getNextPermissionMode(toolPermissionContext, teamContext);
  return {
    nextMode,
    context: transitionPermissionMode(toolPermissionContext.mode, nextMode, toolPermissionContext)
  };
}
var init_getNextPermissionMode = __esm(() => {
  init_permissionSetup();
});
