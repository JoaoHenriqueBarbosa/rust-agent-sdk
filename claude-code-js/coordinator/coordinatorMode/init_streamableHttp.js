// var: init_streamableHttp
var init_streamableHttp = __esm(() => {
  init_types();
  init_auth16();
  init_stream8();
  DEFAULT_STREAMABLE_HTTP_RECONNECTION_OPTIONS = {
    initialReconnectionDelay: 1000,
    maxReconnectionDelay: 30000,
    reconnectionDelayGrowFactor: 1.5,
    maxRetries: 2
  };
  StreamableHTTPError = class StreamableHTTPError extends Error {
    constructor(code, message) {
      super(`Streamable HTTP error: ${message}`);
      this.code = code;
    }
  };
});
