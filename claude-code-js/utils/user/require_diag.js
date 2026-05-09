// var: require_diag
var require_diag = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.DiagAPI = void 0;
  var ComponentLogger_1 = require_ComponentLogger(), logLevelLogger_1 = require_logLevelLogger(), types_1 = require_types2(), global_utils_1 = require_global_utils(), API_NAME = "diag";

  class DiagAPI {
    static instance() {
      if (!this._instance)
        this._instance = new DiagAPI;
      return this._instance;
    }
    constructor() {
      function _logProxy(funcName) {
        return function(...args) {
          let logger34 = (0, global_utils_1.getGlobal)("diag");
          if (!logger34)
            return;
          return logger34[funcName](...args);
        };
      }
      let self2 = this, setLogger = (logger34, optionsOrLogLevel = { logLevel: types_1.DiagLogLevel.INFO }) => {
        var _a3, _b2, _c54;
        if (logger34 === self2) {
          let err2 = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
          return self2.error((_a3 = err2.stack) !== null && _a3 !== void 0 ? _a3 : err2.message), !1;
        }
        if (typeof optionsOrLogLevel === "number")
          optionsOrLogLevel = {
            logLevel: optionsOrLogLevel
          };
        let oldLogger = (0, global_utils_1.getGlobal)("diag"), newLogger = (0, logLevelLogger_1.createLogLevelDiagLogger)((_b2 = optionsOrLogLevel.logLevel) !== null && _b2 !== void 0 ? _b2 : types_1.DiagLogLevel.INFO, logger34);
        if (oldLogger && !optionsOrLogLevel.suppressOverrideMessage) {
          let stack = (_c54 = Error().stack) !== null && _c54 !== void 0 ? _c54 : "<failed to generate stacktrace>";
          oldLogger.warn(`Current logger will be overwritten from ${stack}`), newLogger.warn(`Current logger will overwrite one already registered from ${stack}`);
        }
        return (0, global_utils_1.registerGlobal)("diag", newLogger, self2, !0);
      };
      self2.setLogger = setLogger, self2.disable = () => {
        (0, global_utils_1.unregisterGlobal)(API_NAME, self2);
      }, self2.createComponentLogger = (options2) => {
        return new ComponentLogger_1.DiagComponentLogger(options2);
      }, self2.verbose = _logProxy("verbose"), self2.debug = _logProxy("debug"), self2.info = _logProxy("info"), self2.warn = _logProxy("warn"), self2.error = _logProxy("error");
    }
  }
  exports.DiagAPI = DiagAPI;
});
