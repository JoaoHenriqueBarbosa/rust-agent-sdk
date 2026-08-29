// var: handleSendStrict
var handleSendStrict = ({ anyProcess, channel, isSubprocess, message, strict }) => {
  if (!strict)
    return message;
  let ipcEmitter = getIpcEmitter(anyProcess, channel, isSubprocess), hasListeners = hasMessageListeners(anyProcess, ipcEmitter);
  return {
    id: count++,
    type: REQUEST_TYPE,
    message,
    hasListeners
  };
}, count = 0n, validateStrictDeadlock = (outgoingMessages, wrappedMessage) => {
  if (wrappedMessage?.type !== REQUEST_TYPE || wrappedMessage.hasListeners)
    return;
  for (let { id } of outgoingMessages)
    if (id !== void 0)
      STRICT_RESPONSES[id].resolve({ isDeadlock: !0, hasListeners: !1 });
}, handleStrictRequest = async ({ wrappedMessage, anyProcess, channel, isSubprocess, ipcEmitter }) => {
  if (wrappedMessage?.type !== REQUEST_TYPE || !anyProcess.connected)
    return wrappedMessage;
  let { id, message } = wrappedMessage, response = { id, type: RESPONSE_TYPE, message: hasMessageListeners(anyProcess, ipcEmitter) };
  try {
    await sendMessage({
      anyProcess,
      channel,
      isSubprocess,
      ipc: !0
    }, response);
  } catch (error41) {
    ipcEmitter.emit("strict:error", error41);
  }
  return message;
}, handleStrictResponse = (wrappedMessage) => {
  if (wrappedMessage?.type !== RESPONSE_TYPE)
    return !1;
  let { id, message: hasListeners } = wrappedMessage;
  return STRICT_RESPONSES[id]?.resolve({ isDeadlock: !1, hasListeners }), !0;
}, waitForStrictResponse = async (wrappedMessage, anyProcess, isSubprocess) => {
  if (wrappedMessage?.type !== REQUEST_TYPE)
    return;
  let deferred = createDeferred();
  STRICT_RESPONSES[wrappedMessage.id] = deferred;
  let controller = new AbortController;
  try {
    let { isDeadlock, hasListeners } = await Promise.race([
      deferred,
      throwOnDisconnect(anyProcess, isSubprocess, controller)
    ]);
    if (isDeadlock)
      throwOnStrictDeadlockError(isSubprocess);
    if (!hasListeners)
      throwOnMissingStrict(isSubprocess);
  } finally {
    controller.abort(), delete STRICT_RESPONSES[wrappedMessage.id];
  }
}, STRICT_RESPONSES, throwOnDisconnect = async (anyProcess, isSubprocess, { signal }) => {
  incrementMaxListeners(anyProcess, 1, signal), await once3(anyProcess, "disconnect", { signal }), throwOnStrictDisconnect(isSubprocess);
}, REQUEST_TYPE = "execa:ipc:request", RESPONSE_TYPE = "execa:ipc:response";
