// var: require_node2
var require_node2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.otperformance = exports.SDK_INFO = exports._globalThis = exports.getStringListFromEnv = exports.getNumberFromEnv = exports.getBooleanFromEnv = exports.getStringFromEnv = void 0;
  var environment_1 = require_environment();
  Object.defineProperty(exports, "getStringFromEnv", { enumerable: !0, get: function() {
    return environment_1.getStringFromEnv;
  } });
  Object.defineProperty(exports, "getBooleanFromEnv", { enumerable: !0, get: function() {
    return environment_1.getBooleanFromEnv;
  } });
  Object.defineProperty(exports, "getNumberFromEnv", { enumerable: !0, get: function() {
    return environment_1.getNumberFromEnv;
  } });
  Object.defineProperty(exports, "getStringListFromEnv", { enumerable: !0, get: function() {
    return environment_1.getStringListFromEnv;
  } });
  var globalThis_1 = require_globalThis();
  Object.defineProperty(exports, "_globalThis", { enumerable: !0, get: function() {
    return globalThis_1._globalThis;
  } });
  var sdk_info_1 = require_sdk_info();
  Object.defineProperty(exports, "SDK_INFO", { enumerable: !0, get: function() {
    return sdk_info_1.SDK_INFO;
  } });
  exports.otperformance = performance;
});
