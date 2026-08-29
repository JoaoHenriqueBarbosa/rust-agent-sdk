// var: init_debug2
var init_debug2 = __esm(() => {
  init_log6();
  debugEnvVariable = typeof process < "u" && process.env && process.env.DEBUG || void 0, enabledNamespaces = [], skippedNamespaces = [], debuggers = [];
  if (debugEnvVariable)
    enable(debugEnvVariable);
  debugObj = Object.assign((namespace) => {
    return createDebugger(namespace);
  }, {
    enable,
    enabled,
    disable,
    log: log2
  });
  debug_default = debugObj;
});
