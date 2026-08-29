// var: require_global_utils
var require_global_utils = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.unregisterGlobal = exports.getGlobal = exports.registerGlobal = void 0;
  var version_1 = require_version3(), semver_1 = require_semver3(), major = version_1.VERSION.split(".")[0], GLOBAL_OPENTELEMETRY_API_KEY = Symbol.for(`opentelemetry.js.api.${major}`), _global2 = typeof globalThis === "object" ? globalThis : typeof self === "object" ? self : typeof window === "object" ? window : typeof global === "object" ? global : {};
  function registerGlobal(type, instance, diag, allowOverride = !1) {
    var _a3;
    let api2 = _global2[GLOBAL_OPENTELEMETRY_API_KEY] = (_a3 = _global2[GLOBAL_OPENTELEMETRY_API_KEY]) !== null && _a3 !== void 0 ? _a3 : {
      version: version_1.VERSION
    };
    if (!allowOverride && api2[type]) {
      let err2 = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${type}`);
      return diag.error(err2.stack || err2.message), !1;
    }
    if (api2.version !== version_1.VERSION) {
      let err2 = Error(`@opentelemetry/api: Registration of version v${api2.version} for ${type} does not match previously registered API v${version_1.VERSION}`);
      return diag.error(err2.stack || err2.message), !1;
    }
    return api2[type] = instance, diag.debug(`@opentelemetry/api: Registered a global for ${type} v${version_1.VERSION}.`), !0;
  }
  exports.registerGlobal = registerGlobal;
  function getGlobal2(type) {
    var _a3, _b2;
    let globalVersion = (_a3 = _global2[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _a3 === void 0 ? void 0 : _a3.version;
    if (!globalVersion || !(0, semver_1.isCompatible)(globalVersion))
      return;
    return (_b2 = _global2[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _b2 === void 0 ? void 0 : _b2[type];
  }
  exports.getGlobal = getGlobal2;
  function unregisterGlobal(type, diag) {
    diag.debug(`@opentelemetry/api: Unregistering a global for ${type} v${version_1.VERSION}.`);
    let api2 = _global2[GLOBAL_OPENTELEMETRY_API_KEY];
    if (api2)
      delete api2[type];
  }
  exports.unregisterGlobal = unregisterGlobal;
});
