// var: require_global_error_handler
var require_global_error_handler = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.globalErrorHandler = exports.setGlobalErrorHandler = void 0;
  var logging_error_handler_1 = require_logging_error_handler(), delegateHandler = (0, logging_error_handler_1.loggingErrorHandler)();
  function setGlobalErrorHandler(handler) {
    delegateHandler = handler;
  }
  exports.setGlobalErrorHandler = setGlobalErrorHandler;
  function globalErrorHandler(ex) {
    try {
      delegateHandler(ex);
    } catch {}
  }
  exports.globalErrorHandler = globalErrorHandler;
});
