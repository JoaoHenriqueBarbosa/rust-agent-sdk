// var: sendMessage
var sendMessage = ({ anyProcess, channel, isSubprocess, ipc }, message, { strict = !1 } = {}) => {
  return validateIpcMethod({
    methodName: "sendMessage",
    isSubprocess,
    ipc,
    isConnected: anyProcess.connected
  }), sendMessageAsync({
    anyProcess,
    channel,
    methodName: "sendMessage",
    isSubprocess,
    message,
    strict
  });
}, sendMessageAsync = async ({ anyProcess, channel, methodName, isSubprocess, message, strict }) => {
  let wrappedMessage = handleSendStrict({
    anyProcess,
    channel,
    isSubprocess,
    message,
    strict
  }), outgoingMessagesState = startSendMessage(anyProcess, wrappedMessage, strict);
  try {
    await sendOneMessage({
      anyProcess,
      methodName,
      isSubprocess,
      wrappedMessage,
      message
    });
  } catch (error41) {
    throw disconnect(anyProcess), error41;
  } finally {
    endSendMessage(outgoingMessagesState);
  }
}, sendOneMessage = async ({ anyProcess, methodName, isSubprocess, wrappedMessage, message }) => {
  let sendMethod = getSendMethod(anyProcess);
  try {
    await Promise.all([
      waitForStrictResponse(wrappedMessage, anyProcess, isSubprocess),
      sendMethod(wrappedMessage)
    ]);
  } catch (error41) {
    throw handleEpipeError({ error: error41, methodName, isSubprocess }), handleSerializationError({
      error: error41,
      methodName,
      isSubprocess,
      message
    }), error41;
  }
}, getSendMethod = (anyProcess) => {
  if (PROCESS_SEND_METHODS.has(anyProcess))
    return PROCESS_SEND_METHODS.get(anyProcess);
  let sendMethod = promisify2(anyProcess.send.bind(anyProcess));
  return PROCESS_SEND_METHODS.set(anyProcess, sendMethod), sendMethod;
}, PROCESS_SEND_METHODS;
