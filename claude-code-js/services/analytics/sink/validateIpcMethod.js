// var: validateIpcMethod
var validateIpcMethod = ({ methodName, isSubprocess, ipc, isConnected }) => {
  validateIpcOption(methodName, isSubprocess, ipc), validateConnection(methodName, isSubprocess, isConnected);
}, validateIpcOption = (methodName, isSubprocess, ipc) => {
  if (!ipc)
    throw Error(`${getMethodName(methodName, isSubprocess)} can only be used if the \`ipc\` option is \`true\`.`);
}, validateConnection = (methodName, isSubprocess, isConnected) => {
  if (!isConnected)
    throw Error(`${getMethodName(methodName, isSubprocess)} cannot be used: the ${getOtherProcessName(isSubprocess)} has already exited or disconnected.`);
}, throwOnEarlyDisconnect = (isSubprocess) => {
  throw Error(`${getMethodName("getOneMessage", isSubprocess)} could not complete: the ${getOtherProcessName(isSubprocess)} exited or disconnected.`);
}, throwOnStrictDeadlockError = (isSubprocess) => {
  throw Error(`${getMethodName("sendMessage", isSubprocess)} failed: the ${getOtherProcessName(isSubprocess)} is sending a message too, instead of listening to incoming messages.
This can be fixed by both sending a message and listening to incoming messages at the same time:

const [receivedMessage] = await Promise.all([
	${getMethodName("getOneMessage", isSubprocess)},
	${getMethodName("sendMessage", isSubprocess, "message, {strict: true}")},
]);`);
}, getStrictResponseError = (error41, isSubprocess) => Error(`${getMethodName("sendMessage", isSubprocess)} failed when sending an acknowledgment response to the ${getOtherProcessName(isSubprocess)}.`, { cause: error41 }), throwOnMissingStrict = (isSubprocess) => {
  throw Error(`${getMethodName("sendMessage", isSubprocess)} failed: the ${getOtherProcessName(isSubprocess)} is not listening to incoming messages.`);
}, throwOnStrictDisconnect = (isSubprocess) => {
  throw Error(`${getMethodName("sendMessage", isSubprocess)} failed: the ${getOtherProcessName(isSubprocess)} exited without listening to incoming messages.`);
}, getAbortDisconnectError = () => Error(`\`cancelSignal\` aborted: the ${getOtherProcessName(!0)} disconnected.`), throwOnMissingParent = () => {
  throw Error("`getCancelSignal()` cannot be used without setting the `cancelSignal` subprocess option.");
}, handleEpipeError = ({ error: error41, methodName, isSubprocess }) => {
  if (error41.code === "EPIPE")
    throw Error(`${getMethodName(methodName, isSubprocess)} cannot be used: the ${getOtherProcessName(isSubprocess)} is disconnecting.`, { cause: error41 });
}, handleSerializationError = ({ error: error41, methodName, isSubprocess, message }) => {
  if (isSerializationError(error41))
    throw Error(`${getMethodName(methodName, isSubprocess)}'s argument type is invalid: the message cannot be serialized: ${String(message)}.`, { cause: error41 });
}, isSerializationError = ({ code, message }) => SERIALIZATION_ERROR_CODES.has(code) || SERIALIZATION_ERROR_MESSAGES.some((serializationErrorMessage) => message.includes(serializationErrorMessage)), SERIALIZATION_ERROR_CODES, SERIALIZATION_ERROR_MESSAGES, getMethodName = (methodName, isSubprocess, parameters = "") => methodName === "cancelSignal" ? "`cancelSignal`'s `controller.abort()`" : `${getNamespaceName(isSubprocess)}${methodName}(${parameters})`, getNamespaceName = (isSubprocess) => isSubprocess ? "" : "subprocess.", getOtherProcessName = (isSubprocess) => isSubprocess ? "parent process" : "subprocess", disconnect = (anyProcess) => {
  if (anyProcess.connected)
    anyProcess.disconnect();
};
