// var: init_errors10
var init_errors10 = __esm(() => {
  OAuthError = class OAuthError extends Error {
    constructor(message, errorUri) {
      super(message);
      this.errorUri = errorUri, this.name = this.constructor.name;
    }
    toResponseObject() {
      let response7 = {
        error: this.errorCode,
        error_description: this.message
      };
      if (this.errorUri)
        response7.error_uri = this.errorUri;
      return response7;
    }
    get errorCode() {
      return this.constructor.errorCode;
    }
  };
  InvalidRequestError = class InvalidRequestError extends OAuthError {
  };
  InvalidRequestError.errorCode = "invalid_request";
  InvalidClientError = class InvalidClientError extends OAuthError {
  };
  InvalidClientError.errorCode = "invalid_client";
  InvalidGrantError = class InvalidGrantError extends OAuthError {
  };
  InvalidGrantError.errorCode = "invalid_grant";
  UnauthorizedClientError = class UnauthorizedClientError extends OAuthError {
  };
  UnauthorizedClientError.errorCode = "unauthorized_client";
  UnsupportedGrantTypeError = class UnsupportedGrantTypeError extends OAuthError {
  };
  UnsupportedGrantTypeError.errorCode = "unsupported_grant_type";
  InvalidScopeError = class InvalidScopeError extends OAuthError {
  };
  InvalidScopeError.errorCode = "invalid_scope";
  AccessDeniedError = class AccessDeniedError extends OAuthError {
  };
  AccessDeniedError.errorCode = "access_denied";
  ServerError2 = class ServerError2 extends OAuthError {
  };
  ServerError2.errorCode = "server_error";
  TemporarilyUnavailableError = class TemporarilyUnavailableError extends OAuthError {
  };
  TemporarilyUnavailableError.errorCode = "temporarily_unavailable";
  UnsupportedResponseTypeError = class UnsupportedResponseTypeError extends OAuthError {
  };
  UnsupportedResponseTypeError.errorCode = "unsupported_response_type";
  UnsupportedTokenTypeError = class UnsupportedTokenTypeError extends OAuthError {
  };
  UnsupportedTokenTypeError.errorCode = "unsupported_token_type";
  InvalidTokenError = class InvalidTokenError extends OAuthError {
  };
  InvalidTokenError.errorCode = "invalid_token";
  MethodNotAllowedError = class MethodNotAllowedError extends OAuthError {
  };
  MethodNotAllowedError.errorCode = "method_not_allowed";
  TooManyRequestsError = class TooManyRequestsError extends OAuthError {
  };
  TooManyRequestsError.errorCode = "too_many_requests";
  InvalidClientMetadataError = class InvalidClientMetadataError extends OAuthError {
  };
  InvalidClientMetadataError.errorCode = "invalid_client_metadata";
  InsufficientScopeError = class InsufficientScopeError extends OAuthError {
  };
  InsufficientScopeError.errorCode = "insufficient_scope";
  InvalidTargetError = class InvalidTargetError extends OAuthError {
  };
  InvalidTargetError.errorCode = "invalid_target";
  OAUTH_ERRORS = {
    [InvalidRequestError.errorCode]: InvalidRequestError,
    [InvalidClientError.errorCode]: InvalidClientError,
    [InvalidGrantError.errorCode]: InvalidGrantError,
    [UnauthorizedClientError.errorCode]: UnauthorizedClientError,
    [UnsupportedGrantTypeError.errorCode]: UnsupportedGrantTypeError,
    [InvalidScopeError.errorCode]: InvalidScopeError,
    [AccessDeniedError.errorCode]: AccessDeniedError,
    [ServerError2.errorCode]: ServerError2,
    [TemporarilyUnavailableError.errorCode]: TemporarilyUnavailableError,
    [UnsupportedResponseTypeError.errorCode]: UnsupportedResponseTypeError,
    [UnsupportedTokenTypeError.errorCode]: UnsupportedTokenTypeError,
    [InvalidTokenError.errorCode]: InvalidTokenError,
    [MethodNotAllowedError.errorCode]: MethodNotAllowedError,
    [TooManyRequestsError.errorCode]: TooManyRequestsError,
    [InvalidClientMetadataError.errorCode]: InvalidClientMetadataError,
    [InsufficientScopeError.errorCode]: InsufficientScopeError,
    [InvalidTargetError.errorCode]: InvalidTargetError
  };
});
