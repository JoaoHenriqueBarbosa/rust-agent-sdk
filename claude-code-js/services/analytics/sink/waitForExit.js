// var: waitForExit
var waitForExit = async (subprocess, context) => {
  let [exitCode, signal] = await waitForExitOrError(subprocess);
  return context.isForcefullyTerminated ??= !1, [exitCode, signal];
}, waitForExitOrError = async (subprocess) => {
  let [spawnPayload, exitPayload] = await Promise.allSettled([
    once4(subprocess, "spawn"),
    once4(subprocess, "exit")
  ]);
  if (spawnPayload.status === "rejected")
    return [];
  return exitPayload.status === "rejected" ? waitForSubprocessExit(subprocess) : exitPayload.value;
}, waitForSubprocessExit = async (subprocess) => {
  try {
    return await once4(subprocess, "exit");
  } catch {
    return waitForSubprocessExit(subprocess);
  }
}, waitForSuccessfulExit = async (exitPromise) => {
  let [exitCode, signal] = await exitPromise;
  if (!isSubprocessErrorExit(exitCode, signal) && isFailedExit(exitCode, signal))
    throw new DiscardedError;
  return [exitCode, signal];
}, isSubprocessErrorExit = (exitCode, signal) => exitCode === void 0 && signal === void 0, isFailedExit = (exitCode, signal) => exitCode !== 0 || signal !== null;
