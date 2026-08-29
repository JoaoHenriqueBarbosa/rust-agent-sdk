// var: require_convert_legacy_http_options
var require_convert_legacy_http_options = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.convertLegacyHeaders = void 0;
  var shared_configuration_1 = require_shared_configuration();
  function convertLegacyHeaders(config10) {
    if (typeof config10.headers === "function")
      return config10.headers;
    return (0, shared_configuration_1.wrapStaticHeadersInFunction)(config10.headers);
  }
  exports.convertLegacyHeaders = convertLegacyHeaders;
});
