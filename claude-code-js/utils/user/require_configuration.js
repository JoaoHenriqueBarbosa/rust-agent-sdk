// var: require_configuration
var require_configuration = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.diagLogLevelFromString = void 0;
  var api_1 = require_src7(), logLevelMap = {
    ALL: api_1.DiagLogLevel.ALL,
    VERBOSE: api_1.DiagLogLevel.VERBOSE,
    DEBUG: api_1.DiagLogLevel.DEBUG,
    INFO: api_1.DiagLogLevel.INFO,
    WARN: api_1.DiagLogLevel.WARN,
    ERROR: api_1.DiagLogLevel.ERROR,
    NONE: api_1.DiagLogLevel.NONE
  };
  function diagLogLevelFromString(value) {
    if (value == null)
      return;
    let resolvedLogLevel = logLevelMap[value.toUpperCase()];
    if (resolvedLogLevel == null)
      return api_1.diag.warn(`Unknown log level "${value}", expected one of ${Object.keys(logLevelMap)}, using default`), api_1.DiagLogLevel.INFO;
    return resolvedLogLevel;
  }
  exports.diagLogLevelFromString = diagLogLevelFromString;
});
