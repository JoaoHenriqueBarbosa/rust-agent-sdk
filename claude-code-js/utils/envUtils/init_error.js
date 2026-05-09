// var: init_error
var init_error = __esm(() => {
  AnthropicError = class AnthropicError extends Error {
  };
  APIError = class APIError extends AnthropicError {
    constructor(status, error, message, headers) {
      super(`${APIError.makeMessage(status, error, message)}`);
      this.status = status, this.headers = headers, this.requestID = headers?.get("request-id"), this.error = error;
    }
    static makeMessage(status, error, message) {
      let msg = error?.message ? typeof error.message === "string" ? error.message : JSON.stringify(error.message) : error ? JSON.stringify(error) : message;
      if (status && msg)
        return `${status} ${msg}`;
      if (status)
        return `${status} status code (no body)`;
      if (msg)
        return msg;
      return "(no status code or body)";
    }
    static generate(status, errorResponse, message, headers) {
      if (!status || !headers)
        return new APIConnectionError({ message, cause: castToError(errorResponse) });
      let error = errorResponse;
      if (status === 400)
        return new BadRequestError(status, error, message, headers);
      if (status === 401)
        return new AuthenticationError(status, error, message, headers);
      if (status === 403)
        return new PermissionDeniedError(status, error, message, headers);
      if (status === 404)
        return new NotFoundError(status, error, message, headers);
      if (status === 409)
        return new ConflictError(status, error, message, headers);
      if (status === 422)
        return new UnprocessableEntityError(status, error, message, headers);
      if (status === 429)
        return new RateLimitError(status, error, message, headers);
      if (status >= 500)
        return new InternalServerError(status, error, message, headers);
      return new APIError(status, error, message, headers);
    }
  };
  APIUserAbortError = class APIUserAbortError extends APIError {
    constructor({ message } = {}) {
      super(void 0, void 0, message || "Request was aborted.", void 0);
    }
  };
  APIConnectionError = class APIConnectionError extends APIError {
    constructor({ message, cause }) {
      super(void 0, void 0, message || "Connection error.", void 0);
      if (cause)
        this.cause = cause;
    }
  };
  APIConnectionTimeoutError = class APIConnectionTimeoutError extends APIConnectionError {
    constructor({ message } = {}) {
      super({ message: message ?? "Request timed out." });
    }
  };
  BadRequestError = class BadRequestError extends APIError {
  };
  AuthenticationError = class AuthenticationError extends APIError {
  };
  PermissionDeniedError = class PermissionDeniedError extends APIError {
  };
  NotFoundError = class NotFoundError extends APIError {
  };
  ConflictError = class ConflictError extends APIError {
  };
  UnprocessableEntityError = class UnprocessableEntityError extends APIError {
  };
  RateLimitError = class RateLimitError extends APIError {
  };
  InternalServerError = class InternalServerError extends APIError {
  };
});
