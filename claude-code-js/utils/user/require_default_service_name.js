// var: require_default_service_name
var require_default_service_name = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports._clearDefaultServiceNameCache = exports.defaultServiceName = void 0;
  var serviceName;
  function defaultServiceName() {
    if (serviceName === void 0)
      try {
        let argv0 = globalThis.process.argv0;
        serviceName = argv0 ? `unknown_service:${argv0}` : "unknown_service";
      } catch {
        serviceName = "unknown_service";
      }
    return serviceName;
  }
  exports.defaultServiceName = defaultServiceName;
  function _clearDefaultServiceNameCache() {
    serviceName = void 0;
  }
  exports._clearDefaultServiceNameCache = _clearDefaultServiceNameCache;
});
