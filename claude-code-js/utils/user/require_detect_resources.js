// var: require_detect_resources
var require_detect_resources = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.detectResources = void 0;
  var api_1 = require_src7(), ResourceImpl_1 = require_ResourceImpl(), detectResources = (config10 = {}) => {
    return (config10.detectors || []).map((d) => {
      try {
        let resource = (0, ResourceImpl_1.resourceFromDetectedResource)(d.detect(config10));
        return api_1.diag.debug(`${d.constructor.name} found resource.`, resource), resource;
      } catch (e) {
        return api_1.diag.debug(`${d.constructor.name} failed: ${e.message}`), (0, ResourceImpl_1.emptyResource)();
      }
    }).reduce((acc, resource) => acc.merge(resource), (0, ResourceImpl_1.emptyResource)());
  };
  exports.detectResources = detectResources;
});
