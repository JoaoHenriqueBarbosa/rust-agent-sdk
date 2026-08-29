// var: require_logLevelLogger
var require_logLevelLogger = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.createLogLevelDiagLogger = void 0;
  var types_1 = require_types2();
  function createLogLevelDiagLogger(maxLevel, logger34) {
    if (maxLevel < types_1.DiagLogLevel.NONE)
      maxLevel = types_1.DiagLogLevel.NONE;
    else if (maxLevel > types_1.DiagLogLevel.ALL)
      maxLevel = types_1.DiagLogLevel.ALL;
    logger34 = logger34 || {};
    function _filterFunc(funcName, theLevel) {
      let theFunc = logger34[funcName];
      if (typeof theFunc === "function" && maxLevel >= theLevel)
        return theFunc.bind(logger34);
      return function() {};
    }
    return {
      error: _filterFunc("error", types_1.DiagLogLevel.ERROR),
      warn: _filterFunc("warn", types_1.DiagLogLevel.WARN),
      info: _filterFunc("info", types_1.DiagLogLevel.INFO),
      debug: _filterFunc("debug", types_1.DiagLogLevel.DEBUG),
      verbose: _filterFunc("verbose", types_1.DiagLogLevel.VERBOSE)
    };
  }
  exports.createLogLevelDiagLogger = createLogLevelDiagLogger;
});
