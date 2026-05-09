// var: require_util8
var require_util8 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.validateAndNormalizeHeaders = void 0;
  var api_1 = require_src7();
  function validateAndNormalizeHeaders(partialHeaders) {
    let headers = {};
    return Object.entries(partialHeaders ?? {}).forEach(([key2, value]) => {
      if (typeof value < "u")
        headers[key2] = String(value);
      else
        api_1.diag.warn(`Header "${key2}" has invalid value (${value}) and will be ignored`);
    }), headers;
  }
  exports.validateAndNormalizeHeaders = validateAndNormalizeHeaders;
});
