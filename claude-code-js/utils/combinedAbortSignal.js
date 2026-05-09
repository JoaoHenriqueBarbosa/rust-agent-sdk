// Original: src/utils/combinedAbortSignal.ts
function createCombinedAbortSignal(signal, opts) {
  let { signalB, timeoutMs } = opts ?? {}, combined = createAbortController();
  if (signal?.aborted || signalB?.aborted)
    return combined.abort(), { signal: combined.signal, cleanup: () => {} };
  let timer, abortCombined = () => {
    if (timer !== void 0)
      clearTimeout(timer);
    combined.abort();
  };
  if (timeoutMs !== void 0)
    timer = setTimeout(abortCombined, timeoutMs), timer.unref?.();
  signal?.addEventListener("abort", abortCombined), signalB?.addEventListener("abort", abortCombined);
  let cleanup = () => {
    if (timer !== void 0)
      clearTimeout(timer);
    signal?.removeEventListener("abort", abortCombined), signalB?.removeEventListener("abort", abortCombined);
  };
  return { signal: combined.signal, cleanup };
}
var init_combinedAbortSignal = __esm(() => {
  init_abortController();
});
