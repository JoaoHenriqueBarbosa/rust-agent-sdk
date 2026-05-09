// var: safeWaitForSubprocessStdin
var safeWaitForSubprocessStdin = async (subprocessStdin) => {
  if (subprocessStdin === void 0)
    return;
  try {
    await waitForSubprocessStdin(subprocessStdin);
  } catch {}
}, safeWaitForSubprocessStdout = async (subprocessStdout) => {
  if (subprocessStdout === void 0)
    return;
  try {
    await waitForSubprocessStdout(subprocessStdout);
  } catch {}
}, waitForSubprocessStdin = async (subprocessStdin) => {
  await finished6(subprocessStdin, { cleanup: !0, readable: !1, writable: !0 });
}, waitForSubprocessStdout = async (subprocessStdout) => {
  await finished6(subprocessStdout, { cleanup: !0, readable: !0, writable: !1 });
}, waitForSubprocess = async (subprocess, error41) => {
  if (await subprocess, error41)
    throw error41;
}, destroyOtherStream = (stream, isOpen, error41) => {
  if (error41 && !isStreamAbort(error41))
    stream.destroy(error41);
  else if (isOpen)
    stream.destroy();
};
