// var: init_restError
var init_restError = __esm(() => {
  init_error6();
  init_inspect();
  init_sanitizer();
  errorSanitizer = new Sanitizer;
  RestError = class RestError extends Error {
    static REQUEST_SEND_ERROR = "REQUEST_SEND_ERROR";
    static PARSE_ERROR = "PARSE_ERROR";
    code;
    statusCode;
    request;
    response;
    details;
    constructor(message, options = {}) {
      super(message);
      this.name = "RestError", this.code = options.code, this.statusCode = options.statusCode, Object.defineProperty(this, "request", { value: options.request, enumerable: !1 }), Object.defineProperty(this, "response", { value: options.response, enumerable: !1 });
      let agent = this.request?.agent ? {
        maxFreeSockets: this.request.agent.maxFreeSockets,
        maxSockets: this.request.agent.maxSockets
      } : void 0;
      Object.defineProperty(this, custom2, {
        value: () => {
          return `RestError: ${this.message} 
 ${errorSanitizer.sanitize({
            ...this,
            request: { ...this.request, agent },
            response: this.response
          })}`;
        },
        enumerable: !1
      }), Object.setPrototypeOf(this, RestError.prototype);
    }
  };
});
