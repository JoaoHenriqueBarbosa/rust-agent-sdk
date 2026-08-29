// class: Logger
class Logger {
  constructor(loggerOptions, packageName, packageVersion) {
    this.level = LogLevel.Info;
    let defaultLoggerCallback = () => {
      return;
    }, setLoggerOptions = loggerOptions || Logger.createDefaultLoggerOptions();
    this.localCallback = setLoggerOptions.loggerCallback || defaultLoggerCallback, this.piiLoggingEnabled = setLoggerOptions.piiLoggingEnabled || !1, this.level = typeof setLoggerOptions.logLevel === "number" ? setLoggerOptions.logLevel : LogLevel.Info, this.packageName = packageName || "", this.packageVersion = packageVersion || "";
  }
  static createDefaultLoggerOptions() {
    return {
      loggerCallback: () => {},
      piiLoggingEnabled: !1,
      logLevel: LogLevel.Info
    };
  }
  clone(packageName, packageVersion) {
    return new Logger({
      loggerCallback: this.localCallback,
      piiLoggingEnabled: this.piiLoggingEnabled,
      logLevel: this.level
    }, packageName, packageVersion);
  }
  logMessage(logMessage, options) {
    let correlationId = options.correlationId;
    if (isHashedString(logMessage)) {
      let loggedMessage = {
        hash: logMessage,
        level: options.logLevel,
        containsPii: options.containsPii || !1,
        milliseconds: 0
      };
      addLogToCache(correlationId, loggedMessage);
    }
    if (options.logLevel > this.level || !this.piiLoggingEnabled && options.containsPii)
      return;
    let log3 = `${`[${(/* @__PURE__ */ new Date()).toUTCString()}] : [${correlationId}]`} : ${this.packageName}@${this.packageVersion} : ${LogLevel[options.logLevel]} - ${logMessage}`;
    this.executeCallback(options.logLevel, log3, options.containsPii || !1);
  }
  executeCallback(level, message, containsPii) {
    if (this.localCallback)
      this.localCallback(level, message, containsPii);
  }
  error(message, correlationId) {
    this.logMessage(message, {
      logLevel: LogLevel.Error,
      containsPii: !1,
      correlationId
    });
  }
  errorPii(message, correlationId) {
    this.logMessage(message, {
      logLevel: LogLevel.Error,
      containsPii: !0,
      correlationId
    });
  }
  warning(message, correlationId) {
    this.logMessage(message, {
      logLevel: LogLevel.Warning,
      containsPii: !1,
      correlationId
    });
  }
  warningPii(message, correlationId) {
    this.logMessage(message, {
      logLevel: LogLevel.Warning,
      containsPii: !0,
      correlationId
    });
  }
  info(message, correlationId) {
    this.logMessage(message, {
      logLevel: LogLevel.Info,
      containsPii: !1,
      correlationId
    });
  }
  infoPii(message, correlationId) {
    this.logMessage(message, {
      logLevel: LogLevel.Info,
      containsPii: !0,
      correlationId
    });
  }
  verbose(message, correlationId) {
    this.logMessage(message, {
      logLevel: LogLevel.Verbose,
      containsPii: !1,
      correlationId
    });
  }
  verbosePii(message, correlationId) {
    this.logMessage(message, {
      logLevel: LogLevel.Verbose,
      containsPii: !0,
      correlationId
    });
  }
  trace(message, correlationId) {
    this.logMessage(message, {
      logLevel: LogLevel.Trace,
      containsPii: !1,
      correlationId
    });
  }
  tracePii(message, correlationId) {
    this.logMessage(message, {
      logLevel: LogLevel.Trace,
      containsPii: !0,
      correlationId
    });
  }
  isPiiLoggingEnabled() {
    return this.piiLoggingEnabled || !1;
  }
}
