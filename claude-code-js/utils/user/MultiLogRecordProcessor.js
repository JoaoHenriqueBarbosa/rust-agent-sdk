// class: MultiLogRecordProcessor
class MultiLogRecordProcessor {
  processors;
  forceFlushTimeoutMillis;
  constructor(processors, forceFlushTimeoutMillis) {
    this.processors = processors, this.forceFlushTimeoutMillis = forceFlushTimeoutMillis;
  }
  async forceFlush() {
    let timeout = this.forceFlushTimeoutMillis;
    await Promise.all(this.processors.map((processor) => import_core44.callWithTimeout(processor.forceFlush(), timeout)));
  }
  onEmit(logRecord, context4) {
    this.processors.forEach((processors) => processors.onEmit(logRecord, context4));
  }
  async shutdown() {
    await Promise.all(this.processors.map((processor) => processor.shutdown()));
  }
}
