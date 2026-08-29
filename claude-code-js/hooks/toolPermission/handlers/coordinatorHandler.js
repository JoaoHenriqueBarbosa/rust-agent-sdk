// Original: src/hooks/toolPermission/handlers/coordinatorHandler.ts
async function handleCoordinatorPermission(params) {
  let { ctx, updatedInput, suggestions, permissionMode } = params;
  try {
    let hookResult = await ctx.runHooks(permissionMode, suggestions, updatedInput);
    if (hookResult)
      return hookResult;
    let classifierResult = null;
    if (classifierResult)
      return classifierResult;
  } catch (error44) {
    if (error44 instanceof Error)
      logError2(error44);
    else
      logError2(Error(`Automated permission check failed: ${String(error44)}`));
  }
  return null;
}
var init_coordinatorHandler = __esm(() => {
  init_log3();
});
