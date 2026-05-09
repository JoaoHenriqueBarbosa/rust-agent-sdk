// var: getIpcEmitter
var getIpcEmitter = (anyProcess, channel, isSubprocess) => {
  if (IPC_EMITTERS.has(anyProcess))
    return IPC_EMITTERS.get(anyProcess);
  let ipcEmitter = new EventEmitter;
  return ipcEmitter.connected = !0, IPC_EMITTERS.set(anyProcess, ipcEmitter), forwardEvents({
    ipcEmitter,
    anyProcess,
    channel,
    isSubprocess
  }), ipcEmitter;
}, IPC_EMITTERS, forwardEvents = ({ ipcEmitter, anyProcess, channel, isSubprocess }) => {
  let boundOnMessage = onMessage.bind(void 0, {
    anyProcess,
    channel,
    isSubprocess,
    ipcEmitter
  });
  anyProcess.on("message", boundOnMessage), anyProcess.once("disconnect", onDisconnect.bind(void 0, {
    anyProcess,
    channel,
    isSubprocess,
    ipcEmitter,
    boundOnMessage
  })), undoAddedReferences(channel, isSubprocess);
}, isConnected = (anyProcess) => {
  let ipcEmitter = IPC_EMITTERS.get(anyProcess);
  return ipcEmitter === void 0 ? anyProcess.channel !== null : ipcEmitter.connected;
};
