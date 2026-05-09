// function: registerExitCleanupHandler
function registerExitCleanupHandler() {
  if (exitHandlerRegistered)
    return;
  process.on("exit", () => {
    cleanupBwrapMountPoints({ force: !0 });
  }), exitHandlerRegistered = !0;
}
