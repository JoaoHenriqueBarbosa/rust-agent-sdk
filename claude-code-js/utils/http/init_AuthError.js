// var: init_AuthError
var init_AuthError = __esm(() => {
  /*! @azure/msal-common v16.4.1 2026-04-01 */
  AuthError = class AuthError extends Error {
    constructor(errorCode, errorMessage2, suberror) {
      let message = errorMessage2 || (errorCode ? getDefaultErrorMessage(errorCode) : ""), errorString = message ? `${errorCode}: ${message}` : errorCode;
      super(errorString);
      Object.setPrototypeOf(this, AuthError.prototype), this.errorCode = errorCode || "", this.errorMessage = message || "", this.subError = suberror || "", this.name = "AuthError";
    }
    setCorrelationId(correlationId) {
      this.correlationId = correlationId;
    }
  };
});
