// class: BatchLogRecordProcessorBase
class BatchLogRecordProcessorBase {
  _maxExportBatchSize;
  _maxQueueSize;
  _scheduledDelayMillis;
  _exportTimeoutMillis;
  _exporter;
  _isExporting = !1;
  _finishedLogRecords = [];
  _timer;
  _shutdownOnce;
  constructor(exporter, config10) {
    if (this._exporter = exporter, this._maxExportBatchSize = config10?.maxExportBatchSize ?? 512, this._maxQueueSize = config10?.maxQueueSize ?? 2048, this._scheduledDelayMillis = config10?.scheduledDelayMillis ?? 5000, this._exportTimeoutMillis = config10?.exportTimeoutMillis ?? 30000, this._shutdownOnce = new import_core47.BindOnceFuture(this._shutdown, this), this._maxExportBatchSize > this._maxQueueSize)
      import_api4.diag.warn("BatchLogRecordProcessor: maxExportBatchSize must be smaller or equal to maxQueueSize, setting maxExportBatchSize to match maxQueueSize"), this._maxExportBatchSize = this._maxQueueSize;
  }
  onEmit(logRecord) {
    if (this._shutdownOnce.isCalled)
      return;
    this._addToBuffer(logRecord);
  }
  forceFlush() {
    if (this._shutdownOnce.isCalled)
      return this._shutdownOnce.promise;
    return this._flushAll();
  }
  shutdown() {
    return this._shutdownOnce.call();
  }
  async _shutdown() {
    this.onShutdown(), await this._flushAll(), await this._exporter.shutdown();
  }
  _addToBuffer(logRecord) {
    if (this._finishedLogRecords.length >= this._maxQueueSize)
      return;
    this._finishedLogRecords.push(logRecord), this._maybeStartTimer();
  }
  _flushAll() {
    return new Promise((resolve26, reject2) => {
      let promises = [], batchCount = Math.ceil(this._finishedLogRecords.length / this._maxExportBatchSize);
      for (let i5 = 0;i5 < batchCount; i5++)
        promises.push(this._flushOneBatch());
      Promise.all(promises).then(() => {
        resolve26();
      }).catch(reject2);
    });
  }
  _flushOneBatch() {
    if (this._clearTimer(), this._finishedLogRecords.length === 0)
      return Promise.resolve();
    return import_core47.callWithTimeout(this._export(this._finishedLogRecords.splice(0, this._maxExportBatchSize)), this._exportTimeoutMillis);
  }
  _maybeStartTimer() {
    if (this._isExporting)
      return;
    let flush = () => {
      this._isExporting = !0, this._flushOneBatch().then(() => {
        if (this._isExporting = !1, this._finishedLogRecords.length > 0)
          this._clearTimer(), this._maybeStartTimer();
      }).catch((e) => {
        this._isExporting = !1, import_core47.globalErrorHandler(e);
      });
    };
    if (this._finishedLogRecords.length >= this._maxExportBatchSize)
      return flush();
    if (this._timer !== void 0)
      return;
    if (this._timer = setTimeout(() => flush(), this._scheduledDelayMillis), typeof this._timer !== "number")
      this._timer.unref();
  }
  _clearTimer() {
    if (this._timer !== void 0)
      clearTimeout(this._timer), this._timer = void 0;
  }
  _export(logRecords) {
    let doExport = () => import_core47.internal._export(this._exporter, logRecords).then((result) => {
      if (result.code !== import_core47.ExportResultCode.SUCCESS)
        import_core47.globalErrorHandler(result.error ?? Error(`BatchLogRecordProcessor: log record export failed (status ${result})`));
    }).catch(import_core47.globalErrorHandler), pendingResources = [];
    for (let i5 = 0;i5 < logRecords.length; i5++) {
      let resource = logRecords[i5].resource;
      if (resource.asyncAttributesPending && typeof resource.waitForAsyncAttributes === "function")
        pendingResources.push(resource.waitForAsyncAttributes());
    }
    if (pendingResources.length === 0)
      return doExport();
    else
      return Promise.all(pendingResources).then(doExport, import_core47.globalErrorHandler);
  }
}
