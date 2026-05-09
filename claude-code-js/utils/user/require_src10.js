// var: require_src10
var require_src10 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.defaultServiceName = exports.emptyResource = exports.defaultResource = exports.resourceFromAttributes = exports.serviceInstanceIdDetector = exports.processDetector = exports.osDetector = exports.hostDetector = exports.envDetector = exports.detectResources = void 0;
  var detect_resources_1 = require_detect_resources();
  Object.defineProperty(exports, "detectResources", { enumerable: !0, get: function() {
    return detect_resources_1.detectResources;
  } });
  var detectors_1 = require_detectors();
  Object.defineProperty(exports, "envDetector", { enumerable: !0, get: function() {
    return detectors_1.envDetector;
  } });
  Object.defineProperty(exports, "hostDetector", { enumerable: !0, get: function() {
    return detectors_1.hostDetector;
  } });
  Object.defineProperty(exports, "osDetector", { enumerable: !0, get: function() {
    return detectors_1.osDetector;
  } });
  Object.defineProperty(exports, "processDetector", { enumerable: !0, get: function() {
    return detectors_1.processDetector;
  } });
  Object.defineProperty(exports, "serviceInstanceIdDetector", { enumerable: !0, get: function() {
    return detectors_1.serviceInstanceIdDetector;
  } });
  var ResourceImpl_1 = require_ResourceImpl();
  Object.defineProperty(exports, "resourceFromAttributes", { enumerable: !0, get: function() {
    return ResourceImpl_1.resourceFromAttributes;
  } });
  Object.defineProperty(exports, "defaultResource", { enumerable: !0, get: function() {
    return ResourceImpl_1.defaultResource;
  } });
  Object.defineProperty(exports, "emptyResource", { enumerable: !0, get: function() {
    return ResourceImpl_1.emptyResource;
  } });
  var default_service_name_1 = require_default_service_name();
  Object.defineProperty(exports, "defaultServiceName", { enumerable: !0, get: function() {
    return default_service_name_1.defaultServiceName;
  } });
});
