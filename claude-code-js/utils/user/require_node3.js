// var: require_node3
var require_node3 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.serviceInstanceIdDetector = exports.processDetector = exports.osDetector = exports.hostDetector = void 0;
  var HostDetector_1 = require_HostDetector();
  Object.defineProperty(exports, "hostDetector", { enumerable: !0, get: function() {
    return HostDetector_1.hostDetector;
  } });
  var OSDetector_1 = require_OSDetector();
  Object.defineProperty(exports, "osDetector", { enumerable: !0, get: function() {
    return OSDetector_1.osDetector;
  } });
  var ProcessDetector_1 = require_ProcessDetector();
  Object.defineProperty(exports, "processDetector", { enumerable: !0, get: function() {
    return ProcessDetector_1.processDetector;
  } });
  var ServiceInstanceIdDetector_1 = require_ServiceInstanceIdDetector();
  Object.defineProperty(exports, "serviceInstanceIdDetector", { enumerable: !0, get: function() {
    return ServiceInstanceIdDetector_1.serviceInstanceIdDetector;
  } });
});
