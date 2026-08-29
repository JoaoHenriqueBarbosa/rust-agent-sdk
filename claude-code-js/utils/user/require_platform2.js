// var: require_platform2
var require_platform2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.serviceInstanceIdDetector = exports.processDetector = exports.osDetector = exports.hostDetector = void 0;
  var node_1 = require_node3();
  Object.defineProperty(exports, "hostDetector", { enumerable: !0, get: function() {
    return node_1.hostDetector;
  } });
  Object.defineProperty(exports, "osDetector", { enumerable: !0, get: function() {
    return node_1.osDetector;
  } });
  Object.defineProperty(exports, "processDetector", { enumerable: !0, get: function() {
    return node_1.processDetector;
  } });
  Object.defineProperty(exports, "serviceInstanceIdDetector", { enumerable: !0, get: function() {
    return node_1.serviceInstanceIdDetector;
  } });
});
