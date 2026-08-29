// var: init_sse
var init_sse = __esm(() => {
  init_dist9();
  init_types();
  init_auth16();
  SseError = class SseError extends Error {
    constructor(code, message, event) {
      super(`SSE error: ${message}`);
      this.code = code, this.event = event;
    }
  };
});
