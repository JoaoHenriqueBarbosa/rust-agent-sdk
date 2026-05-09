// var: require_consoleLogger
var require_consoleLogger = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.DiagConsoleLogger = exports._originalConsoleMethods = void 0;
  var consoleMap = [
    { n: "error", c: "error" },
    { n: "warn", c: "warn" },
    { n: "info", c: "info" },
    { n: "debug", c: "debug" },
    { n: "verbose", c: "trace" }
  ];
  exports._originalConsoleMethods = {};
  if (typeof console < "u") {
    let keys2 = [
      "error",
      "warn",
      "info",
      "debug",
      "trace",
      "log"
    ];
    for (let key2 of keys2)
      if (typeof console[key2] === "function")
        exports._originalConsoleMethods[key2] = console[key2];
  }

  class DiagConsoleLogger {
    constructor() {
      function _consoleFunc(funcName) {
        return function(...args) {
          let theFunc = exports._originalConsoleMethods[funcName];
          if (typeof theFunc !== "function")
            theFunc = exports._originalConsoleMethods.log;
          if (typeof theFunc !== "function" && console) {
            if (theFunc = console[funcName], typeof theFunc !== "function")
              theFunc = console.log;
          }
          if (typeof theFunc === "function")
            return theFunc.apply(console, args);
        };
      }
      for (let i5 = 0;i5 < consoleMap.length; i5++)
        this[consoleMap[i5].n] = _consoleFunc(consoleMap[i5].c);
    }
  }
  exports.DiagConsoleLogger = DiagConsoleLogger;
});
