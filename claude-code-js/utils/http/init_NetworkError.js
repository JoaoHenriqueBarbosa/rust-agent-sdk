// var: init_NetworkError
var init_NetworkError = __esm(() => {
  init_AuthError();
  /*! @azure/msal-common v16.4.1 2026-04-01 */
  NetworkError = class NetworkError extends AuthError {
    constructor(error43, httpStatus, responseHeaders) {
      super(error43.errorCode, error43.errorMessage, error43.subError);
      Object.setPrototypeOf(this, NetworkError.prototype), this.name = "NetworkError", this.error = error43, this.httpStatus = httpStatus, this.responseHeaders = responseHeaders;
    }
  };
});
