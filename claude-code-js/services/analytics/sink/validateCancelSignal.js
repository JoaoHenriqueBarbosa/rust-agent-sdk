// var: validateCancelSignal
var validateCancelSignal = ({ cancelSignal }) => {
  if (cancelSignal !== void 0 && Object.prototype.toString.call(cancelSignal) !== "[object AbortSignal]")
    throw Error(`The \`cancelSignal\` option must be an AbortSignal: ${String(cancelSignal)}`);
}, throwOnCancel = ({ subprocess, cancelSignal, gracefulCancel, context, controller }) => cancelSignal === void 0 || gracefulCancel ? [] : [terminateOnCancel(subprocess, cancelSignal, context, controller)], terminateOnCancel = async (subprocess, cancelSignal, context, { signal }) => {
  throw await onAbortedSignal(cancelSignal, signal), context.terminationReason ??= "cancel", subprocess.kill(), cancelSignal.reason;
};
