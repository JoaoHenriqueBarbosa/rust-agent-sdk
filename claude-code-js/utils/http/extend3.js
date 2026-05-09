// function: extend3
function extend3(namespace) {
  let newDebugger = createDebugger(`${this.namespace}:${namespace}`);
  return newDebugger.log = this.log, newDebugger;
}
