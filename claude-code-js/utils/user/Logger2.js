// class: Logger2
class Logger2 {
  instrumentationScope;
  _sharedState;
  _loggerConfig;
  constructor(instrumentationScope, sharedState) {
    this.instrumentationScope = instrumentationScope, this._sharedState = sharedState, this._loggerConfig = this._sharedState.getLoggerConfig(this.instrumentationScope);
  }
  emit(logRecord) {
    let loggerConfig = this._loggerConfig, currentContext = logRecord.context || import_api2.context.active(), recordSeverity = logRecord.severityNumber ?? SeverityNumber.UNSPECIFIED;
    if (recordSeverity !== SeverityNumber.UNSPECIFIED && recordSeverity < loggerConfig.minimumSeverity)
      return;
    if (loggerConfig.traceBased) {
      let spanContext = import_api2.trace.getSpanContext(currentContext);
      if (spanContext && import_api2.isSpanContextValid(spanContext)) {
        if ((spanContext.traceFlags & import_api2.TraceFlags.SAMPLED) !== import_api2.TraceFlags.SAMPLED)
          return;
      }
    }
    let logRecordInstance = new LogRecordImpl(this._sharedState, this.instrumentationScope, {
      context: currentContext,
      ...logRecord
    });
    this._sharedState.activeProcessor.onEmit(logRecordInstance, currentContext), logRecordInstance._makeReadonly();
  }
}
