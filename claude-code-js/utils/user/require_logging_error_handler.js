// var: require_logging_error_handler
var require_logging_error_handler = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.loggingErrorHandler = void 0;
  var api_1 = require_src7();
  function loggingErrorHandler() {
    return (ex) => {
      api_1.diag.error(stringifyException(ex));
    };
  }
  exports.loggingErrorHandler = loggingErrorHandler;
  function stringifyException(ex) {
    if (typeof ex === "string")
      return ex;
    else
      return JSON.stringify(flattenException(ex));
  }
  function flattenException(ex) {
    let result = {}, current = ex;
    while (current !== null)
      Object.getOwnPropertyNames(current).forEach((propertyName) => {
        if (result[propertyName])
          return;
        let value = current[propertyName];
        if (value)
          result[propertyName] = String(value);
      }), current = Object.getPrototypeOf(current);
    return result;
  }
});
