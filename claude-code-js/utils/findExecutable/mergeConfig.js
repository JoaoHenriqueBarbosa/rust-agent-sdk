// function: mergeConfig
function mergeConfig(config1, config2) {
  config2 = config2 || {};
  let config3 = {};
  function getMergedValue(target, source, prop, caseless) {
    if (utils_default.isPlainObject(target) && utils_default.isPlainObject(source))
      return utils_default.merge.call({ caseless }, target, source);
    else if (utils_default.isPlainObject(source))
      return utils_default.merge({}, source);
    else if (utils_default.isArray(source))
      return source.slice();
    return source;
  }
  function mergeDeepProperties(a2, b, prop, caseless) {
    if (!utils_default.isUndefined(b))
      return getMergedValue(a2, b, prop, caseless);
    else if (!utils_default.isUndefined(a2))
      return getMergedValue(void 0, a2, prop, caseless);
  }
  function valueFromConfig2(a2, b) {
    if (!utils_default.isUndefined(b))
      return getMergedValue(void 0, b);
  }
  function defaultToConfig2(a2, b) {
    if (!utils_default.isUndefined(b))
      return getMergedValue(void 0, b);
    else if (!utils_default.isUndefined(a2))
      return getMergedValue(void 0, a2);
  }
  function mergeDirectKeys(a2, b, prop) {
    if (prop in config2)
      return getMergedValue(a2, b);
    else if (prop in config1)
      return getMergedValue(void 0, a2);
  }
  let mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a2, b, prop) => mergeDeepProperties(headersToObject(a2), headersToObject(b), prop, !0)
  };
  return utils_default.forEach(Object.keys({ ...config1, ...config2 }), function(prop) {
    if (prop === "__proto__" || prop === "constructor" || prop === "prototype")
      return;
    let merge3 = utils_default.hasOwnProp(mergeMap, prop) ? mergeMap[prop] : mergeDeepProperties, configValue = merge3(config1[prop], config2[prop], prop);
    utils_default.isUndefined(configValue) && merge3 !== mergeDirectKeys || (config3[prop] = configValue);
  }), config3;
}
