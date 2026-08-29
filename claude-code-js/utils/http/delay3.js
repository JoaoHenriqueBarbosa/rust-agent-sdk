// function: delay3
function delay3(delayInMs, value, options) {
  return new Promise((resolve9, reject) => {
    let timer = void 0, onAborted = void 0, rejectOnAbort = () => {
      return reject(new AbortError3(options?.abortErrorMsg ? options?.abortErrorMsg : StandardAbortMessage2));
    }, removeListeners = () => {
      if (options?.abortSignal && onAborted)
        options.abortSignal.removeEventListener("abort", onAborted);
    };
    if (onAborted = () => {
      if (timer)
        clearTimeout(timer);
      return removeListeners(), rejectOnAbort();
    }, options?.abortSignal && options.abortSignal.aborted)
      return rejectOnAbort();
    if (timer = setTimeout(() => {
      removeListeners(), resolve9(value);
    }, delayInMs), options?.abortSignal)
      options.abortSignal.addEventListener("abort", onAborted);
  });
}
