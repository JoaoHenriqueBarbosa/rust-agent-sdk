// var: require_log2
var require_log2 = __commonJS((exports, module) => {
  var forge = require_forge();
  require_util3();
  module.exports = forge.log = forge.log || {};
  forge.log.levels = [
    "none",
    "error",
    "warning",
    "info",
    "debug",
    "verbose",
    "max"
  ];
  var sLevelInfo = {}, sLoggers = [], sConsoleLogger = null;
  forge.log.LEVEL_LOCKED = 2;
  forge.log.NO_LEVEL_CHECK = 4;
  forge.log.INTERPOLATE = 8;
  for (i5 = 0;i5 < forge.log.levels.length; ++i5)
    level = forge.log.levels[i5], sLevelInfo[level] = {
      index: i5,
      name: level.toUpperCase()
    };
  var level, i5;
  forge.log.logMessage = function(message) {
    var messageLevelIndex = sLevelInfo[message.level].index;
    for (var i6 = 0;i6 < sLoggers.length; ++i6) {
      var logger35 = sLoggers[i6];
      if (logger35.flags & forge.log.NO_LEVEL_CHECK)
        logger35.f(message);
      else {
        var loggerLevelIndex = sLevelInfo[logger35.level].index;
        if (messageLevelIndex <= loggerLevelIndex)
          logger35.f(logger35, message);
      }
    }
  };
  forge.log.prepareStandard = function(message) {
    if (!("standard" in message))
      message.standard = sLevelInfo[message.level].name + " [" + message.category + "] " + message.message;
  };
  forge.log.prepareFull = function(message) {
    if (!("full" in message)) {
      var args = [message.message];
      args = args.concat([]), message.full = forge.util.format.apply(this, args);
    }
  };
  forge.log.prepareStandardFull = function(message) {
    if (!("standardFull" in message))
      forge.log.prepareStandard(message), message.standardFull = message.standard;
  };
  levels = ["error", "warning", "info", "debug", "verbose"];
  for (i5 = 0;i5 < levels.length; ++i5)
    (function(level2) {
      forge.log[level2] = function(category, message) {
        var args = Array.prototype.slice.call(arguments).slice(2), msg = {
          timestamp: /* @__PURE__ */ new Date,
          level: level2,
          category,
          message,
          arguments: args
        };
        forge.log.logMessage(msg);
      };
    })(levels[i5]);
  var levels, i5;
  forge.log.makeLogger = function(logFunction) {
    var logger35 = {
      flags: 0,
      f: logFunction
    };
    return forge.log.setLevel(logger35, "none"), logger35;
  };
  forge.log.setLevel = function(logger35, level2) {
    var rval = !1;
    if (logger35 && !(logger35.flags & forge.log.LEVEL_LOCKED))
      for (var i6 = 0;i6 < forge.log.levels.length; ++i6) {
        var aValidLevel = forge.log.levels[i6];
        if (level2 == aValidLevel) {
          logger35.level = level2, rval = !0;
          break;
        }
      }
    return rval;
  };
  forge.log.lock = function(logger35, lock3) {
    if (typeof lock3 > "u" || lock3)
      logger35.flags |= forge.log.LEVEL_LOCKED;
    else
      logger35.flags &= ~forge.log.LEVEL_LOCKED;
  };
  forge.log.addLogger = function(logger35) {
    sLoggers.push(logger35);
  };
  if (typeof console < "u" && "log" in console) {
    if (console.error && console.warn && console.info && console.debug)
      levelHandlers = {
        error: console.error,
        warning: console.warn,
        info: console.info,
        debug: console.debug,
        verbose: console.debug
      }, f = function(logger35, message) {
        forge.log.prepareStandard(message);
        var handler = levelHandlers[message.level], args = [message.standard];
        args = args.concat(message.arguments.slice()), handler.apply(console, args);
      }, logger34 = forge.log.makeLogger(f);
    else
      f = function(logger35, message) {
        forge.log.prepareStandardFull(message), console.log(message.standardFull);
      }, logger34 = forge.log.makeLogger(f);
    forge.log.setLevel(logger34, "debug"), forge.log.addLogger(logger34), sConsoleLogger = logger34;
  } else
    console = {
      log: function() {}
    };
  var logger34, levelHandlers, f;
  if (sConsoleLogger !== null && typeof window < "u" && window.location) {
    if (query = new URL(window.location.href).searchParams, query.has("console.level"))
      forge.log.setLevel(sConsoleLogger, query.get("console.level").slice(-1)[0]);
    if (query.has("console.lock")) {
      if (lock2 = query.get("console.lock").slice(-1)[0], lock2 == "true")
        forge.log.lock(sConsoleLogger);
    }
  }
  var query, lock2;
  forge.log.consoleLogger = sConsoleLogger;
});
