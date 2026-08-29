// var: startSendMessage
var startSendMessage = (anyProcess, wrappedMessage, strict) => {
  if (!OUTGOING_MESSAGES.has(anyProcess))
    OUTGOING_MESSAGES.set(anyProcess, /* @__PURE__ */ new Set);
  let outgoingMessages = OUTGOING_MESSAGES.get(anyProcess), onMessageSent = createDeferred(), id = strict ? wrappedMessage.id : void 0, outgoingMessage = { onMessageSent, id };
  return outgoingMessages.add(outgoingMessage), { outgoingMessages, outgoingMessage };
}, endSendMessage = ({ outgoingMessages, outgoingMessage }) => {
  outgoingMessages.delete(outgoingMessage), outgoingMessage.onMessageSent.resolve();
}, waitForOutgoingMessages = async (anyProcess, ipcEmitter, wrappedMessage) => {
  while (!hasMessageListeners(anyProcess, ipcEmitter) && OUTGOING_MESSAGES.get(anyProcess)?.size > 0) {
    let outgoingMessages = [...OUTGOING_MESSAGES.get(anyProcess)];
    validateStrictDeadlock(outgoingMessages, wrappedMessage), await Promise.all(outgoingMessages.map(({ onMessageSent }) => onMessageSent));
  }
}, OUTGOING_MESSAGES, hasMessageListeners = (anyProcess, ipcEmitter) => ipcEmitter.listenerCount("message") > getMinListenerCount(anyProcess), getMinListenerCount = (anyProcess) => SUBPROCESS_OPTIONS.has(anyProcess) && !getFdSpecificValue(SUBPROCESS_OPTIONS.get(anyProcess).options.buffer, "ipc") ? 1 : 0;
