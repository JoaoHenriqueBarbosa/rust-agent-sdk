// var: init_ServerError
var init_ServerError = __esm(() => {
  init_AuthError();
  /*! @azure/msal-common v16.4.1 2026-04-01 */
  ServerError = class ServerError extends AuthError {
    constructor(errorCode, errorMessage2, subError, errorNo, status) {
      super(errorCode, errorMessage2, subError);
      this.name = "ServerError", this.errorNo = errorNo, this.status = status, Object.setPrototypeOf(this, ServerError.prototype);
    }
  };
});
