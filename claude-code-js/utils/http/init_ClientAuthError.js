// var: init_ClientAuthError
var init_ClientAuthError = __esm(() => {
  init_AuthError();
  /*! @azure/msal-common v16.4.1 2026-04-01 */
  ClientAuthError = class ClientAuthError extends AuthError {
    constructor(errorCode, additionalMessage) {
      super(errorCode, additionalMessage);
      this.name = "ClientAuthError", Object.setPrototypeOf(this, ClientAuthError.prototype);
    }
  };
});
