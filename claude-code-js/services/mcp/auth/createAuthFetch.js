// function: createAuthFetch
function createAuthFetch() {
  return async (url3, init2) => {
    let timeoutSignal = AbortSignal.timeout(AUTH_REQUEST_TIMEOUT_MS), isPost = init2?.method?.toUpperCase() === "POST";
    if (!init2?.signal) {
      let response7 = await fetch(url3, { ...init2, signal: timeoutSignal });
      return isPost ? normalizeOAuthErrorBody(response7) : response7;
    }
    let controller = new AbortController, abort7 = () => controller.abort();
    init2.signal.addEventListener("abort", abort7), timeoutSignal.addEventListener("abort", abort7);
    let cleanup = () => {
      init2.signal?.removeEventListener("abort", abort7), timeoutSignal.removeEventListener("abort", abort7);
    };
    if (init2.signal.aborted)
      controller.abort();
    try {
      let response7 = await fetch(url3, { ...init2, signal: controller.signal });
      return cleanup(), isPost ? normalizeOAuthErrorBody(response7) : response7;
    } catch (error44) {
      throw cleanup(), error44;
    }
  };
}
