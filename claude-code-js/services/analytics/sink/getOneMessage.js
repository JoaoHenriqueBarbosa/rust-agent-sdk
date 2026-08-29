// var: getOneMessage
var getOneMessage = ({ anyProcess, channel, isSubprocess, ipc }, { reference = !0, filter } = {}) => {
  return validateIpcMethod({
    methodName: "getOneMessage",
    isSubprocess,
    ipc,
    isConnected: isConnected(anyProcess)
  }), getOneMessageAsync({
    anyProcess,
    channel,
    isSubprocess,
    filter,
    reference
  });
}, getOneMessageAsync = async ({ anyProcess, channel, isSubprocess, filter, reference }) => {
  addReference(channel, reference);
  let ipcEmitter = getIpcEmitter(anyProcess, channel, isSubprocess), controller = new AbortController;
  try {
    return await Promise.race([
      getMessage(ipcEmitter, filter, controller),
      throwOnDisconnect2(ipcEmitter, isSubprocess, controller),
      throwOnStrictError(ipcEmitter, isSubprocess, controller)
    ]);
  } catch (error41) {
    throw disconnect(anyProcess), error41;
  } finally {
    controller.abort(), removeReference(channel, reference);
  }
}, getMessage = async (ipcEmitter, filter, { signal }) => {
  if (filter === void 0) {
    let [message] = await once5(ipcEmitter, "message", { signal });
    return message;
  }
  for await (let [message] of on2(ipcEmitter, "message", { signal }))
    if (filter(message))
      return message;
}, throwOnDisconnect2 = async (ipcEmitter, isSubprocess, { signal }) => {
  await once5(ipcEmitter, "disconnect", { signal }), throwOnEarlyDisconnect(isSubprocess);
}, throwOnStrictError = async (ipcEmitter, isSubprocess, { signal }) => {
  let [error41] = await once5(ipcEmitter, "strict:error", { signal });
  throw getStrictResponseError(error41, isSubprocess);
};
