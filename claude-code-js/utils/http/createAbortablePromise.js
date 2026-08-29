// function: createAbortablePromise
function createAbortablePromise(buildPromise, options) {
  let { cleanupBeforeAbort, abortSignal, abortErrorMsg } = options ?? {};
  return new Promise((resolve9, reject) => {
    function rejectOnAbort() {
      reject(new AbortError2(abortErrorMsg ?? "The operation was aborted."));
    }
    function removeListeners() {
      abortSignal?.removeEventListener("abort", onAbort);
    }
    function onAbort() {
      cleanupBeforeAbort?.(), removeListeners(), rejectOnAbort();
    }
    if (abortSignal?.aborted)
      return rejectOnAbort();
    try {
      buildPromise((x3) => {
        removeListeners(), resolve9(x3);
      }, (x3) => {
        removeListeners(), reject(x3);
      });
    } catch (err) {
      reject(err);
    }
    abortSignal?.addEventListener("abort", onAbort);
  });
}
