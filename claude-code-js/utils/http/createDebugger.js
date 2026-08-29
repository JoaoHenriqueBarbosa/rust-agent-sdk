// function: createDebugger
function createDebugger(namespace) {
  let newDebugger = Object.assign(debug, {
    enabled: enabled(namespace),
    destroy,
    log: debugObj.log,
    namespace,
    extend: extend3
  });
  function debug(...args) {
    if (!newDebugger.enabled)
      return;
    if (args.length > 0)
      args[0] = `${namespace} ${args[0]}`;
    newDebugger.log(...args);
  }
  return debuggers.push(newDebugger), newDebugger;
}
