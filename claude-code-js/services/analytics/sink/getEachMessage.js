// var: getEachMessage
var getEachMessage = ({ anyProcess, channel, isSubprocess, ipc }, { reference = !0 } = {}) => loopOnMessages({
  anyProcess,
  channel,
  isSubprocess,
  ipc,
  shouldAwait: !isSubprocess,
  reference
}), loopOnMessages = ({ anyProcess, channel, isSubprocess, ipc, shouldAwait, reference }) => {
  validateIpcMethod({
    methodName: "getEachMessage",
    isSubprocess,
    ipc,
    isConnected: isConnected(anyProcess)
  }), addReference(channel, reference);
  let ipcEmitter = getIpcEmitter(anyProcess, channel, isSubprocess), controller = new AbortController, state = {};
  return stopOnDisconnect(anyProcess, ipcEmitter, controller), abortOnStrictError({
    ipcEmitter,
    isSubprocess,
    controller,
    state
  }), iterateOnMessages({
    anyProcess,
    channel,
    ipcEmitter,
    isSubprocess,
    shouldAwait,
    controller,
    state,
    reference
  });
}, stopOnDisconnect = async (anyProcess, ipcEmitter, controller) => {
  try {
    await once6(ipcEmitter, "disconnect", { signal: controller.signal }), controller.abort();
  } catch {}
}, abortOnStrictError = async ({ ipcEmitter, isSubprocess, controller, state }) => {
  try {
    let [error41] = await once6(ipcEmitter, "strict:error", { signal: controller.signal });
    state.error = getStrictResponseError(error41, isSubprocess), controller.abort();
  } catch {}
}, iterateOnMessages = async function* ({ anyProcess, channel, ipcEmitter, isSubprocess, shouldAwait, controller, state, reference }) {
  try {
    for await (let [message] of on3(ipcEmitter, "message", { signal: controller.signal }))
      throwIfStrictError(state), yield message;
  } catch {
    throwIfStrictError(state);
  } finally {
    if (controller.abort(), removeReference(channel, reference), !isSubprocess)
      disconnect(anyProcess);
    if (shouldAwait)
      await anyProcess;
  }
}, throwIfStrictError = ({ error: error41 }) => {
  if (error41)
    throw error41;
};
