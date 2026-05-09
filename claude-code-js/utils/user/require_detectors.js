// var: require_detectors
var require_detectors = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.noopDetector = exports.serviceInstanceIdDetector = exports.processDetector = exports.osDetector = exports.hostDetector = exports.envDetector = void 0;
  var EnvDetector_1 = require_EnvDetector();
  Object.defineProperty(exports, "envDetector", { enumerable: !0, get: function() {
    return EnvDetector_1.envDetector;
  } });
  var platform_1 = require_platform2();
  Object.defineProperty(exports, "hostDetector", { enumerable: !0, get: function() {
    return platform_1.hostDetector;
  } });
  Object.defineProperty(exports, "osDetector", { enumerable: !0, get: function() {
    return platform_1.osDetector;
  } });
  Object.defineProperty(exports, "processDetector", { enumerable: !0, get: function() {
    return platform_1.processDetector;
  } });
  Object.defineProperty(exports, "serviceInstanceIdDetector", { enumerable: !0, get: function() {
    return platform_1.serviceInstanceIdDetector;
  } });
  var NoopDetector_1 = require_NoopDetector();
  Object.defineProperty(exports, "noopDetector", { enumerable: !0, get: function() {
    return NoopDetector_1.noopDetector;
  } });
});
