// var: require_sdk_info
var require_sdk_info = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.SDK_INFO = void 0;
  var version_1 = require_version4(), semantic_conventions_1 = require_src8(), semconv_1 = require_semconv();
  exports.SDK_INFO = {
    [semantic_conventions_1.ATTR_TELEMETRY_SDK_NAME]: "opentelemetry",
    [semconv_1.ATTR_PROCESS_RUNTIME_NAME]: "node",
    [semantic_conventions_1.ATTR_TELEMETRY_SDK_LANGUAGE]: semantic_conventions_1.TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS,
    [semantic_conventions_1.ATTR_TELEMETRY_SDK_VERSION]: version_1.VERSION
  };
});
