// function: createLoggerContext
function createLoggerContext(options) {
  let registeredLoggers = /* @__PURE__ */ new Set, logLevelFromEnv = typeof process < "u" && process.env && process.env[options.logLevelEnvVarName] || void 0, logLevel, clientLogger = debug_default(options.namespace);
  clientLogger.log = (...args) => {
    debug_default.log(...args);
  };
  function contextSetLogLevel(level) {
    if (level && !isTypeSpecRuntimeLogLevel(level))
      throw Error(`Unknown log level '${level}'. Acceptable values: ${TYPESPEC_RUNTIME_LOG_LEVELS.join(",")}`);
    logLevel = level;
    let enabledNamespaces2 = [];
    for (let logger8 of registeredLoggers)
      if (shouldEnable(logger8))
        enabledNamespaces2.push(logger8.namespace);
    debug_default.enable(enabledNamespaces2.join(","));
  }
  if (logLevelFromEnv)
    if (isTypeSpecRuntimeLogLevel(logLevelFromEnv))
      contextSetLogLevel(logLevelFromEnv);
    else
      console.error(`${options.logLevelEnvVarName} set to unknown log level '${logLevelFromEnv}'; logging is not enabled. Acceptable values: ${TYPESPEC_RUNTIME_LOG_LEVELS.join(", ")}.`);
  function shouldEnable(logger8) {
    return Boolean(logLevel && levelMap[logger8.level] <= levelMap[logLevel]);
  }
  function createLogger(parent, level) {
    let logger8 = Object.assign(parent.extend(level), {
      level
    });
    if (patchLogMethod(parent, logger8), shouldEnable(logger8)) {
      let enabledNamespaces2 = debug_default.disable();
      debug_default.enable(enabledNamespaces2 + "," + logger8.namespace);
    }
    return registeredLoggers.add(logger8), logger8;
  }
  function contextGetLogLevel() {
    return logLevel;
  }
  function contextCreateClientLogger(namespace) {
    let clientRootLogger = clientLogger.extend(namespace);
    return patchLogMethod(clientLogger, clientRootLogger), {
      error: createLogger(clientRootLogger, "error"),
      warning: createLogger(clientRootLogger, "warning"),
      info: createLogger(clientRootLogger, "info"),
      verbose: createLogger(clientRootLogger, "verbose")
    };
  }
  return {
    setLogLevel: contextSetLogLevel,
    getLogLevel: contextGetLogLevel,
    createClientLogger: contextCreateClientLogger,
    logger: clientLogger
  };
}
