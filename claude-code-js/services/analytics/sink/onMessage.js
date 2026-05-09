// var: onMessage
var onMessage = async ({ anyProcess, channel, isSubprocess, ipcEmitter }, wrappedMessage) => {
  if (handleStrictResponse(wrappedMessage) || handleAbort(wrappedMessage))
    return;
  if (!INCOMING_MESSAGES.has(anyProcess))
    INCOMING_MESSAGES.set(anyProcess, []);
  let incomingMessages = INCOMING_MESSAGES.get(anyProcess);
  if (incomingMessages.push(wrappedMessage), incomingMessages.length > 1)
    return;
  while (incomingMessages.length > 0) {
    await waitForOutgoingMessages(anyProcess, ipcEmitter, wrappedMessage), await scheduler.yield();
    let message = await handleStrictRequest({
      wrappedMessage: incomingMessages[0],
      anyProcess,
      channel,
      isSubprocess,
      ipcEmitter
    });
    incomingMessages.shift(), ipcEmitter.emit("message", message), ipcEmitter.emit("message:done");
  }
}, onDisconnect = async ({ anyProcess, channel, isSubprocess, ipcEmitter, boundOnMessage }) => {
  abortOnDisconnect();
  let incomingMessages = INCOMING_MESSAGES.get(anyProcess);
  while (incomingMessages?.length > 0)
    await once2(ipcEmitter, "message:done");
  anyProcess.removeListener("message", boundOnMessage), redoAddedReferences(channel, isSubprocess), ipcEmitter.connected = !1, ipcEmitter.emit("disconnect");
}, INCOMING_MESSAGES;
