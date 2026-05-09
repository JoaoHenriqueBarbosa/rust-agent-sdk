// var: resolveConfig_default
var resolveConfig_default = (config2) => {
  let newConfig = mergeConfig({}, config2), { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
  if (newConfig.headers = headers = AxiosHeaders_default.from(headers), newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config2.params, config2.paramsSerializer), auth)
    headers.set("Authorization", "Basic " + btoa((auth.username || "") + ":" + (auth.password ? unescape(encodeURIComponent(auth.password)) : "")));
  if (utils_default.isFormData(data)) {
    if (platform_default.hasStandardBrowserEnv || platform_default.hasStandardBrowserWebWorkerEnv)
      headers.setContentType(void 0);
    else if (utils_default.isFunction(data.getHeaders)) {
      let formHeaders = data.getHeaders(), allowedHeaders = ["content-type", "content-length"];
      Object.entries(formHeaders).forEach(([key, val]) => {
        if (allowedHeaders.includes(key.toLowerCase()))
          headers.set(key, val);
      });
    }
  }
  if (platform_default.hasStandardBrowserEnv) {
    if (withXSRFToken && utils_default.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig)), withXSRFToken || withXSRFToken !== !1 && isURLSameOrigin_default(newConfig.url)) {
      let xsrfValue = xsrfHeaderName && xsrfCookieName && cookies_default.read(xsrfCookieName);
      if (xsrfValue)
        headers.set(xsrfHeaderName, xsrfValue);
    }
  }
  return newConfig;
};
