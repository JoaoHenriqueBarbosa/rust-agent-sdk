// function: wrapFetchWithStepUpDetection
function wrapFetchWithStepUpDetection(baseFetch, provider5) {
  return async (url3, init2) => {
    let response7 = await baseFetch(url3, init2);
    if (response7.status === 403) {
      let wwwAuth = response7.headers.get("WWW-Authenticate");
      if (wwwAuth?.includes("insufficient_scope")) {
        let match = wwwAuth.match(/scope=(?:"([^"]+)"|([^\s,]+))/), scope = match?.[1] ?? match?.[2];
        if (scope)
          provider5.markStepUpPending(scope);
      }
    }
    return response7;
  };
}
