// var: init_xhr
var init_xhr = __esm(() => {
  init_utils();
  init_settle();
  init_transitional();
  init_AxiosError();
  init_CanceledError();
  init_platform2();
  init_AxiosHeaders();
  init_progressEventReducer();
  init_resolveConfig();
  isXHRAdapterSupported = typeof XMLHttpRequest < "u", xhr_default = isXHRAdapterSupported && function(config2) {
    return new Promise(function(resolve7, reject) {
      let _config = resolveConfig_default(config2), requestData = _config.data, requestHeaders = AxiosHeaders_default.from(_config.headers).normalize(), { responseType, onUploadProgress, onDownloadProgress } = _config, onCanceled, uploadThrottled, downloadThrottled, flushUpload, flushDownload;
      function done() {
        flushUpload && flushUpload(), flushDownload && flushDownload(), _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled), _config.signal && _config.signal.removeEventListener("abort", onCanceled);
      }
      let request = new XMLHttpRequest;
      request.open(_config.method.toUpperCase(), _config.url, !0), request.timeout = _config.timeout;
      function onloadend() {
        if (!request)
          return;
        let responseHeaders = AxiosHeaders_default.from("getAllResponseHeaders" in request && request.getAllResponseHeaders()), response = {
          data: !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config: config2,
          request
        };
        settle(function(value) {
          resolve7(value), done();
        }, function(err) {
          reject(err), done();
        }, response), request = null;
      }
      if ("onloadend" in request)
        request.onloadend = onloadend;
      else
        request.onreadystatechange = function() {
          if (!request || request.readyState !== 4)
            return;
          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0))
            return;
          setTimeout(onloadend);
        };
      if (request.onabort = function() {
        if (!request)
          return;
        reject(new AxiosError_default("Request aborted", AxiosError_default.ECONNABORTED, config2, request)), request = null;
      }, request.onerror = function(event) {
        let msg = event && event.message ? event.message : "Network Error", err = new AxiosError_default(msg, AxiosError_default.ERR_NETWORK, config2, request);
        err.event = event || null, reject(err), request = null;
      }, request.ontimeout = function() {
        let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded", transitional = _config.transitional || transitional_default;
        if (_config.timeoutErrorMessage)
          timeoutErrorMessage = _config.timeoutErrorMessage;
        reject(new AxiosError_default(timeoutErrorMessage, transitional.clarifyTimeoutError ? AxiosError_default.ETIMEDOUT : AxiosError_default.ECONNABORTED, config2, request)), request = null;
      }, requestData === void 0 && requestHeaders.setContentType(null), "setRequestHeader" in request)
        utils_default.forEach(requestHeaders.toJSON(), function(val, key) {
          request.setRequestHeader(key, val);
        });
      if (!utils_default.isUndefined(_config.withCredentials))
        request.withCredentials = !!_config.withCredentials;
      if (responseType && responseType !== "json")
        request.responseType = _config.responseType;
      if (onDownloadProgress)
        [downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, !0), request.addEventListener("progress", downloadThrottled);
      if (onUploadProgress && request.upload)
        [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress), request.upload.addEventListener("progress", uploadThrottled), request.upload.addEventListener("loadend", flushUpload);
      if (_config.cancelToken || _config.signal) {
        if (onCanceled = (cancel) => {
          if (!request)
            return;
          reject(!cancel || cancel.type ? new CanceledError_default(null, config2, request) : cancel), request.abort(), request = null;
        }, _config.cancelToken && _config.cancelToken.subscribe(onCanceled), _config.signal)
          _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
      }
      let protocol = parseProtocol(_config.url);
      if (protocol && platform_default.protocols.indexOf(protocol) === -1) {
        reject(new AxiosError_default("Unsupported protocol " + protocol + ":", AxiosError_default.ERR_BAD_REQUEST, config2));
        return;
      }
      request.send(requestData || null);
    });
  };
});
