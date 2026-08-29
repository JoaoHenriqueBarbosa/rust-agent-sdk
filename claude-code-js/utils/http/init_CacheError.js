// var: init_CacheError
var init_CacheError = __esm(() => {
  init_CacheErrorCodes();
  init_AuthError();
  /*! @azure/msal-common v16.4.1 2026-04-01 */
  CacheError = class CacheError extends Error {
    constructor(errorCode, errorMessage2) {
      let message = errorMessage2 || getDefaultErrorMessage(errorCode);
      super(message);
      Object.setPrototypeOf(this, CacheError.prototype), this.name = "CacheError", this.errorCode = errorCode, this.errorMessage = message;
    }
  };
});
