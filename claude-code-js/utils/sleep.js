// Original: src/utils/sleep.ts
function sleep3(ms, signal, opts) {
  return new Promise((resolve9, reject) => {
    if (signal?.aborted) {
      if (opts?.throwOnAbort || opts?.abortError)
        reject(opts.abortError?.() ?? Error("aborted"));
      else
        resolve9();
      return;
    }
    let timer = setTimeout((signal2, onAbort2, resolve10) => {
      signal2?.removeEventListener("abort", onAbort2), resolve10();
    }, ms, signal, onAbort, resolve9);
    function onAbort() {
      if (clearTimeout(timer), opts?.throwOnAbort || opts?.abortError)
        reject(opts.abortError?.() ?? Error("aborted"));
      else
        resolve9();
    }
    if (signal?.addEventListener("abort", onAbort, { once: !0 }), opts?.unref)
      timer.unref();
  });
}
