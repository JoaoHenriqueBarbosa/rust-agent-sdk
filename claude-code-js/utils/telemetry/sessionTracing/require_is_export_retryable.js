// var: require_is_export_retryable
var require_is_export_retryable = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.parseRetryAfterToMills = exports.isExportHTTPErrorRetryable = void 0;
  function isExportHTTPErrorRetryable(statusCode) {
    return statusCode === 429 || statusCode === 502 || statusCode === 503 || statusCode === 504;
  }
  exports.isExportHTTPErrorRetryable = isExportHTTPErrorRetryable;
  function parseRetryAfterToMills(retryAfter) {
    if (retryAfter == null)
      return;
    let seconds = Number.parseInt(retryAfter, 10);
    if (Number.isInteger(seconds))
      return seconds > 0 ? seconds * 1000 : -1;
    let delay4 = new Date(retryAfter).getTime() - Date.now();
    if (delay4 >= 0)
      return delay4;
    return 0;
  }
  exports.parseRetryAfterToMills = parseRetryAfterToMills;
});
