// var: init_AxiosError
var init_AxiosError = __esm(() => {
  init_utils();
  AxiosError = class AxiosError extends Error {
    static from(error41, code, config2, request, response, customProps) {
      let axiosError = new AxiosError(error41.message, code || error41.code, config2, request, response);
      if (axiosError.cause = error41, axiosError.name = error41.name, error41.status != null && axiosError.status == null)
        axiosError.status = error41.status;
      return customProps && Object.assign(axiosError, customProps), axiosError;
    }
    constructor(message, code, config2, request, response) {
      super(message);
      if (Object.defineProperty(this, "message", {
        value: message,
        enumerable: !0,
        writable: !0,
        configurable: !0
      }), this.name = "AxiosError", this.isAxiosError = !0, code && (this.code = code), config2 && (this.config = config2), request && (this.request = request), response)
        this.response = response, this.status = response.status;
    }
    toJSON() {
      return {
        message: this.message,
        name: this.name,
        description: this.description,
        number: this.number,
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        config: utils_default.toJSONObject(this.config),
        code: this.code,
        status: this.status
      };
    }
  };
  AxiosError.ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE";
  AxiosError.ERR_BAD_OPTION = "ERR_BAD_OPTION";
  AxiosError.ECONNABORTED = "ECONNABORTED";
  AxiosError.ETIMEDOUT = "ETIMEDOUT";
  AxiosError.ERR_NETWORK = "ERR_NETWORK";
  AxiosError.ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS";
  AxiosError.ERR_DEPRECATED = "ERR_DEPRECATED";
  AxiosError.ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE";
  AxiosError.ERR_BAD_REQUEST = "ERR_BAD_REQUEST";
  AxiosError.ERR_CANCELED = "ERR_CANCELED";
  AxiosError.ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT";
  AxiosError.ERR_INVALID_URL = "ERR_INVALID_URL";
  AxiosError_default = AxiosError;
});
