// var: require_logging_response_handler
var require_logging_response_handler = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.createLoggingPartialSuccessResponseHandler = void 0;
  var api_1 = require_src7();
  function isPartialSuccessResponse(response7) {
    return Object.prototype.hasOwnProperty.call(response7, "partialSuccess");
  }
  function createLoggingPartialSuccessResponseHandler() {
    return {
      handleResponse(response7) {
        if (response7 == null || !isPartialSuccessResponse(response7) || response7.partialSuccess == null || Object.keys(response7.partialSuccess).length === 0)
          return;
        api_1.diag.warn("Received Partial Success response:", JSON.stringify(response7.partialSuccess));
      }
    };
  }
  exports.createLoggingPartialSuccessResponseHandler = createLoggingPartialSuccessResponseHandler;
});
