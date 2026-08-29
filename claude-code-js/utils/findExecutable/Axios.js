// class: Axios
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig || {}, this.interceptors = {
      request: new InterceptorManager_default,
      response: new InterceptorManager_default
    };
  }
  async request(configOrUrl, config2) {
    try {
      return await this._request(configOrUrl, config2);
    } catch (err) {
      if (err instanceof Error) {
        let dummy = {};
        Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = Error();
        let stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
        try {
          if (!err.stack)
            err.stack = stack;
          else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, "")))
            err.stack += `
` + stack;
        } catch (e) {}
      }
      throw err;
    }
  }
  _request(configOrUrl, config2) {
    if (typeof configOrUrl === "string")
      config2 = config2 || {}, config2.url = configOrUrl;
    else
      config2 = configOrUrl || {};
    config2 = mergeConfig(this.defaults, config2);
    let { transitional: transitional2, paramsSerializer, headers } = config2;
    if (transitional2 !== void 0)
      validator_default.assertOptions(transitional2, {
        silentJSONParsing: validators2.transitional(validators2.boolean),
        forcedJSONParsing: validators2.transitional(validators2.boolean),
        clarifyTimeoutError: validators2.transitional(validators2.boolean),
        legacyInterceptorReqResOrdering: validators2.transitional(validators2.boolean)
      }, !1);
    if (paramsSerializer != null)
      if (utils_default.isFunction(paramsSerializer))
        config2.paramsSerializer = {
          serialize: paramsSerializer
        };
      else
        validator_default.assertOptions(paramsSerializer, {
          encode: validators2.function,
          serialize: validators2.function
        }, !0);
    if (config2.allowAbsoluteUrls !== void 0)
      ;
    else if (this.defaults.allowAbsoluteUrls !== void 0)
      config2.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
    else
      config2.allowAbsoluteUrls = !0;
    validator_default.assertOptions(config2, {
      baseUrl: validators2.spelling("baseURL"),
      withXsrfToken: validators2.spelling("withXSRFToken")
    }, !0), config2.method = (config2.method || this.defaults.method || "get").toLowerCase();
    let contextHeaders = headers && utils_default.merge(headers.common, headers[config2.method]);
    headers && utils_default.forEach(["delete", "get", "head", "post", "put", "patch", "common"], (method) => {
      delete headers[method];
    }), config2.headers = AxiosHeaders_default.concat(contextHeaders, headers);
    let requestInterceptorChain = [], synchronousRequestInterceptors = !0;
    this.interceptors.request.forEach(function(interceptor) {
      if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config2) === !1)
        return;
      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
      let transitional3 = config2.transitional || transitional_default;
      if (transitional3 && transitional3.legacyInterceptorReqResOrdering)
        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      else
        requestInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });
    let responseInterceptorChain = [];
    this.interceptors.response.forEach(function(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });
    let promise2, i2 = 0, len;
    if (!synchronousRequestInterceptors) {
      let chain = [dispatchRequest.bind(this), void 0];
      chain.unshift(...requestInterceptorChain), chain.push(...responseInterceptorChain), len = chain.length, promise2 = Promise.resolve(config2);
      while (i2 < len)
        promise2 = promise2.then(chain[i2++], chain[i2++]);
      return promise2;
    }
    len = requestInterceptorChain.length;
    let newConfig = config2;
    while (i2 < len) {
      let onFulfilled = requestInterceptorChain[i2++], onRejected = requestInterceptorChain[i2++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error41) {
        onRejected.call(this, error41);
        break;
      }
    }
    try {
      promise2 = dispatchRequest.call(this, newConfig);
    } catch (error41) {
      return Promise.reject(error41);
    }
    i2 = 0, len = responseInterceptorChain.length;
    while (i2 < len)
      promise2 = promise2.then(responseInterceptorChain[i2++], responseInterceptorChain[i2++]);
    return promise2;
  }
  getUri(config2) {
    config2 = mergeConfig(this.defaults, config2);
    let fullPath = buildFullPath(config2.baseURL, config2.url, config2.allowAbsoluteUrls);
    return buildURL(fullPath, config2.params, config2.paramsSerializer);
  }
}
