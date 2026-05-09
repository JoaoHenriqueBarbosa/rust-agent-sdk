// class: ConsoleLogRecordExporter
class ConsoleLogRecordExporter {
  export(logs2, resultCallback) {
    this._sendLogRecords(logs2, resultCallback);
  }
  shutdown() {
    return Promise.resolve();
  }
  _exportInfo(logRecord) {
    return {
      resource: {
        attributes: logRecord.resource.attributes
      },
      instrumentationScope: logRecord.instrumentationScope,
      timestamp: import_core46.hrTimeToMicroseconds(logRecord.hrTime),
      traceId: logRecord.spanContext?.traceId,
      spanId: logRecord.spanContext?.spanId,
      traceFlags: logRecord.spanContext?.traceFlags,
      severityText: logRecord.severityText,
      severityNumber: logRecord.severityNumber,
      eventName: logRecord.eventName,
      body: logRecord.body,
      attributes: logRecord.attributes
    };
  }
  _sendLogRecords(logRecords, done) {
    for (let logRecord of logRecords)
      console.dir(this._exportInfo(logRecord), { depth: 3 });
    done?.({ code: import_core46.ExportResultCode.SUCCESS });
  }
}
