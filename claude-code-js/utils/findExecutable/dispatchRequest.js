// function: dispatchRequest
function dispatchRequest(config2) {
  if (throwIfCancellationRequested(config2), config2.headers = AxiosHeaders_default.from(config2.headers), config2.data = transformData.call(config2, config2.transformRequest), ["post", "put", "patch"].indexOf(config2.method) !== -1)
    config2.headers.setContentType("application/x-www-form-urlencoded", !1);
  return adapters_default.getAdapter(config2.adapter || defaults_default.adapter, config2)(config2).then(function(response) {
    return throwIfCancellationRequested(config2), response.data = transformData.call(config2, config2.transformResponse, response), response.headers = AxiosHeaders_default.from(response.headers), response;
  }, function(reason) {
    if (!isCancel(reason)) {
      if (throwIfCancellationRequested(config2), reason && reason.response)
        reason.response.data = transformData.call(config2, config2.transformResponse, reason.response), reason.response.headers = AxiosHeaders_default.from(reason.response.headers);
    }
    return Promise.reject(reason);
  });
}
