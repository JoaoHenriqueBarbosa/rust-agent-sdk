// var: require_executable_response
var require_executable_response = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.InvalidSubjectTokenError = exports.InvalidMessageFieldError = exports.InvalidCodeFieldError = exports.InvalidTokenTypeFieldError = exports.InvalidExpirationTimeFieldError = exports.InvalidSuccessFieldError = exports.InvalidVersionFieldError = exports.ExecutableResponseError = exports.ExecutableResponse = void 0;
  var SAML_SUBJECT_TOKEN_TYPE = "urn:ietf:params:oauth:token-type:saml2", OIDC_SUBJECT_TOKEN_TYPE1 = "urn:ietf:params:oauth:token-type:id_token", OIDC_SUBJECT_TOKEN_TYPE2 = "urn:ietf:params:oauth:token-type:jwt";

  class ExecutableResponse {
    constructor(responseJson) {
      if (!responseJson.version)
        throw new InvalidVersionFieldError("Executable response must contain a 'version' field.");
      if (responseJson.success === void 0)
        throw new InvalidSuccessFieldError("Executable response must contain a 'success' field.");
      if (this.version = responseJson.version, this.success = responseJson.success, this.success) {
        if (this.expirationTime = responseJson.expiration_time, this.tokenType = responseJson.token_type, this.tokenType !== SAML_SUBJECT_TOKEN_TYPE && this.tokenType !== OIDC_SUBJECT_TOKEN_TYPE1 && this.tokenType !== OIDC_SUBJECT_TOKEN_TYPE2)
          throw new InvalidTokenTypeFieldError(`Executable response must contain a 'token_type' field when successful and it must be one of ${OIDC_SUBJECT_TOKEN_TYPE1}, ${OIDC_SUBJECT_TOKEN_TYPE2}, or ${SAML_SUBJECT_TOKEN_TYPE}.`);
        if (this.tokenType === SAML_SUBJECT_TOKEN_TYPE) {
          if (!responseJson.saml_response)
            throw new InvalidSubjectTokenError(`Executable response must contain a 'saml_response' field when token_type=${SAML_SUBJECT_TOKEN_TYPE}.`);
          this.subjectToken = responseJson.saml_response;
        } else {
          if (!responseJson.id_token)
            throw new InvalidSubjectTokenError(`Executable response must contain a 'id_token' field when token_type=${OIDC_SUBJECT_TOKEN_TYPE1} or ${OIDC_SUBJECT_TOKEN_TYPE2}.`);
          this.subjectToken = responseJson.id_token;
        }
      } else {
        if (!responseJson.code)
          throw new InvalidCodeFieldError("Executable response must contain a 'code' field when unsuccessful.");
        if (!responseJson.message)
          throw new InvalidMessageFieldError("Executable response must contain a 'message' field when unsuccessful.");
        this.errorCode = responseJson.code, this.errorMessage = responseJson.message;
      }
    }
    isValid() {
      return !this.isExpired() && this.success;
    }
    isExpired() {
      return this.expirationTime !== void 0 && this.expirationTime < Math.round(Date.now() / 1000);
    }
  }
  exports.ExecutableResponse = ExecutableResponse;

  class ExecutableResponseError extends Error {
    constructor(message) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
    }
  }
  exports.ExecutableResponseError = ExecutableResponseError;

  class InvalidVersionFieldError extends ExecutableResponseError {
  }
  exports.InvalidVersionFieldError = InvalidVersionFieldError;

  class InvalidSuccessFieldError extends ExecutableResponseError {
  }
  exports.InvalidSuccessFieldError = InvalidSuccessFieldError;

  class InvalidExpirationTimeFieldError extends ExecutableResponseError {
  }
  exports.InvalidExpirationTimeFieldError = InvalidExpirationTimeFieldError;

  class InvalidTokenTypeFieldError extends ExecutableResponseError {
  }
  exports.InvalidTokenTypeFieldError = InvalidTokenTypeFieldError;

  class InvalidCodeFieldError extends ExecutableResponseError {
  }
  exports.InvalidCodeFieldError = InvalidCodeFieldError;

  class InvalidMessageFieldError extends ExecutableResponseError {
  }
  exports.InvalidMessageFieldError = InvalidMessageFieldError;

  class InvalidSubjectTokenError extends ExecutableResponseError {
  }
  exports.InvalidSubjectTokenError = InvalidSubjectTokenError;
});
