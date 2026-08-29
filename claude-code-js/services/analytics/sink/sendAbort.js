// var: sendAbort
var sendAbort = (subprocess, message) => {
  return validateConnection("cancelSignal", !1, subprocess.connected), sendOneMessage({
    anyProcess: subprocess,
    methodName: "cancelSignal",
    isSubprocess: !1,
    wrappedMessage: { type: GRACEFUL_CANCEL_TYPE, message },
    message
  });
}, getCancelSignal = async ({ anyProcess, channel, isSubprocess, ipc }) => {
  return await startIpc({
    anyProcess,
    channel,
    isSubprocess,
    ipc
  }), cancelController.signal;
}, startIpc = async ({ anyProcess, channel, isSubprocess, ipc }) => {
  if (cancelListening)
    return;
  if (cancelListening = !0, !ipc) {
    throwOnMissingParent();
    return;
  }
  if (channel === null) {
    abortOnDisconnect();
    return;
  }
  getIpcEmitter(anyProcess, channel, isSubprocess), await scheduler2.yield();
}, cancelListening = !1, handleAbort = (wrappedMessage) => {
  if (wrappedMessage?.type !== GRACEFUL_CANCEL_TYPE)
    return !1;
  return cancelController.abort(wrappedMessage.message), !0;
}, GRACEFUL_CANCEL_TYPE = "execa:ipc:cancel", abortOnDisconnect = () => {
  cancelController.abort(getAbortDisconnectError());
}, cancelController;
