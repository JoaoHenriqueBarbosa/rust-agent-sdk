// var: require_ComponentLogger
var require_ComponentLogger = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.DiagComponentLogger = void 0;
  var global_utils_1 = require_global_utils();

  class DiagComponentLogger {
    constructor(props) {
      this._namespace = props.namespace || "DiagComponentLogger";
    }
    debug(...args) {
      return logProxy("debug", this._namespace, args);
    }
    error(...args) {
      return logProxy("error", this._namespace, args);
    }
    info(...args) {
      return logProxy("info", this._namespace, args);
    }
    warn(...args) {
      return logProxy("warn", this._namespace, args);
    }
    verbose(...args) {
      return logProxy("verbose", this._namespace, args);
    }
  }
  exports.DiagComponentLogger = DiagComponentLogger;
  function logProxy(funcName, namespace, args) {
    let logger34 = (0, global_utils_1.getGlobal)("diag");
    if (!logger34)
      return;
    return logger34[funcName](namespace, ...args);
  }
});
