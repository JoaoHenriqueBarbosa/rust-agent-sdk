// var: validateGracefulCancel
var validateGracefulCancel = ({ gracefulCancel, cancelSignal, ipc, serialization }) => {
  if (!gracefulCancel)
    return;
  if (cancelSignal === void 0)
    throw Error("The `cancelSignal` option must be defined when setting the `gracefulCancel` option.");
  if (!ipc)
    throw Error("The `ipc` option cannot be false when setting the `gracefulCancel` option.");
  if (serialization === "json")
    throw Error("The `serialization` option cannot be 'json' when setting the `gracefulCancel` option.");
}, throwOnGracefulCancel = ({
  subprocess,
  cancelSignal,
  gracefulCancel,
  forceKillAfterDelay,
  context,
  controller
}) => gracefulCancel ? [sendOnAbort({
  subprocess,
  cancelSignal,
  forceKillAfterDelay,
  context,
  controller
})] : [], sendOnAbort = async ({ subprocess, cancelSignal, forceKillAfterDelay, context, controller: { signal } }) => {
  await onAbortedSignal(cancelSignal, signal);
  let reason = getReason(cancelSignal);
  throw await sendAbort(subprocess, reason), killOnTimeout({
    kill: subprocess.kill,
    forceKillAfterDelay,
    context,
    controllerSignal: signal
  }), context.terminationReason ??= "gracefulCancel", cancelSignal.reason;
}, getReason = ({ reason }) => {
  if (!(reason instanceof DOMException))
    return reason;
  let error41 = Error(reason.message);
  return Object.defineProperty(error41, "stack", {
    value: reason.stack,
    enumerable: !1,
    configurable: !0,
    writable: !0
  }), error41;
};
