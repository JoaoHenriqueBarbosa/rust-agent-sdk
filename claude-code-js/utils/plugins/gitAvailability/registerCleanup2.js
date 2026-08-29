// function: registerCleanup2
function registerCleanup2() {
  if (cleanupRegistered)
    return;
  let cleanupHandler = () => reset2().catch((e) => {
    logForDebugging2(`Cleanup failed in registerCleanup ${e}`, {
      level: "error"
    });
  });
  process.once("exit", cleanupHandler), process.once("SIGINT", cleanupHandler), process.once("SIGTERM", cleanupHandler), cleanupRegistered = !0;
}
