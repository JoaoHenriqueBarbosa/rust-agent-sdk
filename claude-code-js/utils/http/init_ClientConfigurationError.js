// var: init_ClientConfigurationError
var init_ClientConfigurationError = __esm(() => {
  init_AuthError();
  /*! @azure/msal-common v16.4.1 2026-04-01 */
  ClientConfigurationError = class ClientConfigurationError extends AuthError {
    constructor(errorCode) {
      super(errorCode);
      this.name = "ClientConfigurationError", Object.setPrototypeOf(this, ClientConfigurationError.prototype);
    }
  };
});
