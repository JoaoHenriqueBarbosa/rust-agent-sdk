// class: LoggerProviderSharedState
class LoggerProviderSharedState {
  loggers = /* @__PURE__ */ new Map;
  activeProcessor;
  registeredLogRecordProcessors = [];
  resource;
  forceFlushTimeoutMillis;
  logRecordLimits;
  processors;
  _loggerConfigurator;
  _loggerConfigs = /* @__PURE__ */ new Map;
  constructor(resource, forceFlushTimeoutMillis, logRecordLimits, processors, loggerConfigurator) {
    if (this.resource = resource, this.forceFlushTimeoutMillis = forceFlushTimeoutMillis, this.logRecordLimits = logRecordLimits, this.processors = processors, processors.length > 0)
      this.registeredLogRecordProcessors = processors, this.activeProcessor = new MultiLogRecordProcessor(this.registeredLogRecordProcessors, this.forceFlushTimeoutMillis);
    else
      this.activeProcessor = new NoopLogRecordProcessor;
    this._loggerConfigurator = loggerConfigurator ?? DEFAULT_LOGGER_CONFIGURATOR;
  }
  getLoggerConfig(instrumentationScope) {
    let key2 = getInstrumentationScopeKey(instrumentationScope), config10 = this._loggerConfigs.get(key2);
    if (config10)
      return config10;
    return config10 = this._loggerConfigurator(instrumentationScope), this._loggerConfigs.set(key2, config10), config10;
  }
}
