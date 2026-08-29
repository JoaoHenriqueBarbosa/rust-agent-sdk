// var: init_CanceledError
var init_CanceledError = __esm(() => {
  init_AxiosError();
  CanceledError = class CanceledError extends AxiosError_default {
    constructor(message, config2, request) {
      super(message == null ? "canceled" : message, AxiosError_default.ERR_CANCELED, config2, request);
      this.name = "CanceledError", this.__CANCEL__ = !0;
    }
  };
  CanceledError_default = CanceledError;
});
