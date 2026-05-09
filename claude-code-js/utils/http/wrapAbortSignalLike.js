// function: wrapAbortSignalLike
function wrapAbortSignalLike(abortSignalLike) {
  if (abortSignalLike instanceof AbortSignal)
    return { abortSignal: abortSignalLike };
  if (abortSignalLike.aborted)
    return { abortSignal: AbortSignal.abort(abortSignalLike.reason) };
  let controller = new AbortController, needsCleanup = !0;
  function cleanup() {
    if (needsCleanup)
      abortSignalLike.removeEventListener("abort", listener), needsCleanup = !1;
  }
  function listener() {
    controller.abort(abortSignalLike.reason), cleanup();
  }
  return abortSignalLike.addEventListener("abort", listener), { abortSignal: controller.signal, cleanup };
}
