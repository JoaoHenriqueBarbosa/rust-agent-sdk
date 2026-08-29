// var: normalizeForceKillAfterDelay
var normalizeForceKillAfterDelay = (forceKillAfterDelay) => {
  if (forceKillAfterDelay === !1)
    return forceKillAfterDelay;
  if (forceKillAfterDelay === !0)
    return DEFAULT_FORCE_KILL_TIMEOUT;
  if (!Number.isFinite(forceKillAfterDelay) || forceKillAfterDelay < 0)
    throw TypeError(`Expected the \`forceKillAfterDelay\` option to be a non-negative integer, got \`${forceKillAfterDelay}\` (${typeof forceKillAfterDelay})`);
  return forceKillAfterDelay;
}, DEFAULT_FORCE_KILL_TIMEOUT = 5000, subprocessKill = ({ kill, options: { forceKillAfterDelay, killSignal }, onInternalError, context, controller }, signalOrError, errorArgument) => {
  let { signal, error: error41 } = parseKillArguments(signalOrError, errorArgument, killSignal);
  emitKillError(error41, onInternalError);
  let killResult = kill(signal);
  return setKillTimeout({
    kill,
    signal,
    forceKillAfterDelay,
    killSignal,
    killResult,
    context,
    controller
  }), killResult;
}, parseKillArguments = (signalOrError, errorArgument, killSignal) => {
  let [signal = killSignal, error41] = isErrorInstance(signalOrError) ? [void 0, signalOrError] : [signalOrError, errorArgument];
  if (typeof signal !== "string" && !Number.isInteger(signal))
    throw TypeError(`The first argument must be an error instance or a signal name string/integer: ${String(signal)}`);
  if (error41 !== void 0 && !isErrorInstance(error41))
    throw TypeError(`The second argument is optional. If specified, it must be an error instance: ${error41}`);
  return { signal: normalizeSignalArgument(signal), error: error41 };
}, emitKillError = (error41, onInternalError) => {
  if (error41 !== void 0)
    onInternalError.reject(error41);
}, setKillTimeout = async ({ kill, signal, forceKillAfterDelay, killSignal, killResult, context, controller }) => {
  if (signal === killSignal && killResult)
    killOnTimeout({
      kill,
      forceKillAfterDelay,
      context,
      controllerSignal: controller.signal
    });
}, killOnTimeout = async ({ kill, forceKillAfterDelay, context, controllerSignal }) => {
  if (forceKillAfterDelay === !1)
    return;
  try {
    if (await setTimeout2(forceKillAfterDelay, void 0, { signal: controllerSignal }), kill("SIGKILL"))
      context.isForcefullyTerminated ??= !0;
  } catch {}
};
