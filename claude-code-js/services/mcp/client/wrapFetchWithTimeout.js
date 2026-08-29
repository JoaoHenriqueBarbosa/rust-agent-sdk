// function: wrapFetchWithTimeout
function wrapFetchWithTimeout(baseFetch) {
  return async (url3, init2) => {
    if ((init2?.method ?? "GET").toUpperCase() === "GET")
      return baseFetch(url3, init2);
    let headers = new Headers(init2?.headers);
    if (!headers.has("accept"))
      headers.set("accept", MCP_STREAMABLE_HTTP_ACCEPT);
    let controller = new AbortController, timer = setTimeout((c3) => c3.abort(new DOMException("The operation timed out.", "TimeoutError")), MCP_REQUEST_TIMEOUT_MS, controller);
    timer.unref?.();
    let parentSignal = init2?.signal, abort7 = () => controller.abort(parentSignal?.reason);
    if (parentSignal?.addEventListener("abort", abort7), parentSignal?.aborted)
      controller.abort(parentSignal.reason);
    let cleanup = () => {
      clearTimeout(timer), parentSignal?.removeEventListener("abort", abort7);
    };
    try {
      let response7 = await baseFetch(url3, {
        ...init2,
        headers,
        signal: controller.signal
      });
      return cleanup(), response7;
    } catch (error44) {
      throw cleanup(), error44;
    }
  };
}
