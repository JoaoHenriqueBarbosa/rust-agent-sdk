// var: CredentialUnavailableErrorName
var CredentialUnavailableErrorName = "CredentialUnavailableError", CredentialUnavailableError, AuthenticationErrorName = "AuthenticationError", AuthenticationError2, AggregateAuthenticationErrorName = "AggregateAuthenticationError", AggregateAuthenticationError, AuthenticationRequiredError;
var init_errors7 = __esm(() => {
  CredentialUnavailableError = class CredentialUnavailableError extends Error {
    constructor(message, options) {
      super(message, options);
      this.name = CredentialUnavailableErrorName;
    }
  };
  AuthenticationError2 = class AuthenticationError2 extends Error {
    statusCode;
    errorResponse;
    constructor(statusCode, errorBody, options) {
      let errorResponse = {
        error: "unknown",
        errorDescription: "An unknown error occurred and no additional details are available."
      };
      if (isErrorResponse(errorBody))
        errorResponse = convertOAuthErrorResponseToErrorResponse(errorBody);
      else if (typeof errorBody === "string")
        try {
          let oauthErrorResponse = JSON.parse(errorBody);
          errorResponse = convertOAuthErrorResponseToErrorResponse(oauthErrorResponse);
        } catch (e) {
          if (statusCode === 400)
            errorResponse = {
              error: "invalid_request",
              errorDescription: `The service indicated that the request was invalid.

${errorBody}`
            };
          else
            errorResponse = {
              error: "unknown_error",
              errorDescription: `An unknown error has occurred. Response body:

${errorBody}`
            };
        }
      else
        errorResponse = {
          error: "unknown_error",
          errorDescription: "An unknown error occurred and no additional details are available."
        };
      super(`${errorResponse.error} Status code: ${statusCode}
More details:
${errorResponse.errorDescription},`, options);
      this.statusCode = statusCode, this.errorResponse = errorResponse, this.name = AuthenticationErrorName;
    }
  };
  AggregateAuthenticationError = class AggregateAuthenticationError extends Error {
    errors;
    constructor(errors6, errorMessage2) {
      let errorDetail = errors6.join(`
`);
      super(`${errorMessage2}
${errorDetail}`);
      this.errors = errors6, this.name = AggregateAuthenticationErrorName;
    }
  };
  AuthenticationRequiredError = class AuthenticationRequiredError extends Error {
    scopes;
    getTokenOptions;
    constructor(options) {
      super(options.message, options.cause ? { cause: options.cause } : void 0);
      this.scopes = options.scopes, this.getTokenOptions = options.getTokenOptions, this.name = "AuthenticationRequiredError";
    }
  };
});
