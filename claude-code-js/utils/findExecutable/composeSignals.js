// var: composeSignals
var composeSignals = (signals2, timeout) => {
  let { length } = signals2 = signals2 ? signals2.filter(Boolean) : [];
  if (timeout || length) {
    let controller = new AbortController, aborted3, onabort = function(reason) {
      if (!aborted3) {
        aborted3 = !0, unsubscribe();
        let err = reason instanceof Error ? reason : this.reason;
        controller.abort(err instanceof AxiosError_default ? err : new CanceledError_default(err instanceof Error ? err.message : err));
      }
    }, timer = timeout && setTimeout(() => {
      timer = null, onabort(new AxiosError_default(`timeout of ${timeout}ms exceeded`, AxiosError_default.ETIMEDOUT));
    }, timeout), unsubscribe = () => {
      if (signals2)
        timer && clearTimeout(timer), timer = null, signals2.forEach((signal2) => {
          signal2.unsubscribe ? signal2.unsubscribe(onabort) : signal2.removeEventListener("abort", onabort);
        }), signals2 = null;
    };
    signals2.forEach((signal2) => signal2.addEventListener("abort", onabort));
    let { signal } = controller;
    return signal.unsubscribe = () => utils_default.asap(unsubscribe), signal;
  }
}, composeSignals_default;
