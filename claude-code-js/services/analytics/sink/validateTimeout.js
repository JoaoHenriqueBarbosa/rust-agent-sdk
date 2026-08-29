// var: validateTimeout
var validateTimeout = ({ timeout }) => {
  if (timeout !== void 0 && (!Number.isFinite(timeout) || timeout < 0))
    throw TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
}, throwOnTimeout = (subprocess, timeout, context, controller) => timeout === 0 || timeout === void 0 ? [] : [killAfterTimeout(subprocess, timeout, context, controller)], killAfterTimeout = async (subprocess, timeout, context, { signal }) => {
  throw await setTimeout3(timeout, void 0, { signal }), context.terminationReason ??= "timeout", subprocess.kill(), new DiscardedError;
};
