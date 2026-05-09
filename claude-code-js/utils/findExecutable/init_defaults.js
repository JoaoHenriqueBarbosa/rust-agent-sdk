// var: init_defaults
var init_defaults = __esm(() => {
  init_utils();
  init_AxiosError();
  init_transitional();
  init_toFormData();
  init_toURLEncodedForm();
  init_platform2();
  init_formDataToJSON();
  defaults = {
    transitional: transitional_default,
    adapter: ["xhr", "http", "fetch"],
    transformRequest: [
      function(data, headers) {
        let contentType = headers.getContentType() || "", hasJSONContentType = contentType.indexOf("application/json") > -1, isObjectPayload = utils_default.isObject(data);
        if (isObjectPayload && utils_default.isHTMLForm(data))
          data = new FormData(data);
        if (utils_default.isFormData(data))
          return hasJSONContentType ? JSON.stringify(formDataToJSON_default(data)) : data;
        if (utils_default.isArrayBuffer(data) || utils_default.isBuffer(data) || utils_default.isStream(data) || utils_default.isFile(data) || utils_default.isBlob(data) || utils_default.isReadableStream(data))
          return data;
        if (utils_default.isArrayBufferView(data))
          return data.buffer;
        if (utils_default.isURLSearchParams(data))
          return headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), data.toString();
        let isFileList2;
        if (isObjectPayload) {
          if (contentType.indexOf("application/x-www-form-urlencoded") > -1)
            return toURLEncodedForm(data, this.formSerializer).toString();
          if ((isFileList2 = utils_default.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
            let _FormData = this.env && this.env.FormData;
            return toFormData_default(isFileList2 ? { "files[]": data } : data, _FormData && new _FormData, this.formSerializer);
          }
        }
        if (isObjectPayload || hasJSONContentType)
          return headers.setContentType("application/json", !1), stringifySafely(data);
        return data;
      }
    ],
    transformResponse: [
      function(data) {
        let transitional = this.transitional || defaults.transitional, forcedJSONParsing = transitional && transitional.forcedJSONParsing, JSONRequested = this.responseType === "json";
        if (utils_default.isResponse(data) || utils_default.isReadableStream(data))
          return data;
        if (data && utils_default.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
          let strictJSONParsing = !(transitional && transitional.silentJSONParsing) && JSONRequested;
          try {
            return JSON.parse(data, this.parseReviver);
          } catch (e) {
            if (strictJSONParsing) {
              if (e.name === "SyntaxError")
                throw AxiosError_default.from(e, AxiosError_default.ERR_BAD_RESPONSE, this, null, this.response);
              throw e;
            }
          }
        }
        return data;
      }
    ],
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
      FormData: platform_default.classes.FormData,
      Blob: platform_default.classes.Blob
    },
    validateStatus: function(status) {
      return status >= 200 && status < 300;
    },
    headers: {
      common: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": void 0
      }
    }
  };
  utils_default.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
    defaults.headers[method] = {};
  });
  defaults_default = defaults;
});
