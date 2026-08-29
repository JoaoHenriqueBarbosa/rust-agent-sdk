// class: LoggerProvider
class LoggerProvider {
  _shutdownOnce;
  _sharedState;
  constructor(config10 = {}) {
    let mergedConfig = {
      resource: config10.resource ?? import_resources.defaultResource(),
      forceFlushTimeoutMillis: config10.forceFlushTimeoutMillis ?? 30000,
      logRecordLimits: {
        attributeCountLimit: config10.logRecordLimits?.attributeCountLimit ?? 128,
        attributeValueLengthLimit: config10.logRecordLimits?.attributeValueLengthLimit ?? 1 / 0
      },
      loggerConfigurator: config10.loggerConfigurator ?? DEFAULT_LOGGER_CONFIGURATOR,
      processors: config10.processors ?? []
    };
    this._sharedState = new LoggerProviderSharedState(mergedConfig.resource, mergedConfig.forceFlushTimeoutMillis, mergedConfig.logRecordLimits, mergedConfig.processors, mergedConfig.loggerConfigurator), this._shutdownOnce = new import_core45.BindOnceFuture(this._shutdown, this);
  }
  getLogger(name3, version5, options2) {
    if (this._shutdownOnce.isCalled)
      return import_api3.diag.warn("A shutdown LoggerProvider cannot provide a Logger"), NOOP_LOGGER2;
    if (!name3)
      import_api3.diag.warn("Logger requested without instrumentation scope name.");
    let loggerName = name3 || DEFAULT_LOGGER_NAME, key2 = `${loggerName}@${version5 || ""}:${options2?.schemaUrl || ""}`;
    if (!this._sharedState.loggers.has(key2))
      this._sharedState.loggers.set(key2, new Logger2({ name: loggerName, version: version5, schemaUrl: options2?.schemaUrl }, this._sharedState));
    return this._sharedState.loggers.get(key2);
  }
  forceFlush() {
    if (this._shutdownOnce.isCalled)
      return import_api3.diag.warn("invalid attempt to force flush after LoggerProvider shutdown"), this._shutdownOnce.promise;
    return this._sharedState.activeProcessor.forceFlush();
  }
  shutdown() {
    if (this._shutdownOnce.isCalled)
      return import_api3.diag.warn("shutdown may only be called once per LoggerProvider"), this._shutdownOnce.promise;
    return this._shutdownOnce.call();
  }
  _shutdown() {
    return this._sharedState.activeProcessor.shutdown();
  }
}
