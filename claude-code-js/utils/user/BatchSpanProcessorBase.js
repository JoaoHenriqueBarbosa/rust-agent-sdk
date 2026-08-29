// class: BatchSpanProcessorBase
class BatchSpanProcessorBase {
  _maxExportBatchSize;
  _maxQueueSize;
  _scheduledDelayMillis;
  _exportTimeoutMillis;
  _exporter;
  _isExporting = !1;
  _finishedSpans = [];
  _timer;
  _shutdownOnce;
  _droppedSpansCount = 0;
  constructor(exporter, config10) {
    if (this._exporter = exporter, this._maxExportBatchSize = typeof config10?.maxExportBatchSize === "number" ? config10.maxExportBatchSize : import_core52.getNumberFromEnv("OTEL_BSP_MAX_EXPORT_BATCH_SIZE") ?? 512, this._maxQueueSize = typeof config10?.maxQueueSize === "number" ? config10.maxQueueSize : import_core52.getNumberFromEnv("OTEL_BSP_MAX_QUEUE_SIZE") ?? 2048, this._scheduledDelayMillis = typeof config10?.scheduledDelayMillis === "number" ? config10.scheduledDelayMillis : import_core52.getNumberFromEnv("OTEL_BSP_SCHEDULE_DELAY") ?? 5000, this._exportTimeoutMillis = typeof config10?.exportTimeoutMillis === "number" ? config10.exportTimeoutMillis : import_core52.getNumberFromEnv("OTEL_BSP_EXPORT_TIMEOUT") ?? 30000, this._shutdownOnce = new import_core52.BindOnceFuture(this._shutdown, this), this._maxExportBatchSize > this._maxQueueSize)
      import_api9.diag.warn("BatchSpanProcessor: maxExportBatchSize must be smaller or equal to maxQueueSize, setting maxExportBatchSize to match maxQueueSize"), this._maxExportBatchSize = this._maxQueueSize;
  }
  forceFlush() {
    if (this._shutdownOnce.isCalled)
      return this._shutdownOnce.promise;
    return this._flushAll();
  }
  onStart(_span, _parentContext) {}
  onEnd(span) {
    if (this._shutdownOnce.isCalled)
      return;
    if ((span.spanContext().traceFlags & import_api9.TraceFlags.SAMPLED) === 0)
      return;
    this._addToBuffer(span);
  }
  shutdown() {
    return this._shutdownOnce.call();
  }
  _shutdown() {
    return Promise.resolve().then(() => {
      return this.onShutdown();
    }).then(() => {
      return this._flushAll();
    }).then(() => {
      return this._exporter.shutdown();
    });
  }
  _addToBuffer(span) {
    if (this._finishedSpans.length >= this._maxQueueSize) {
      if (this._droppedSpansCount === 0)
        import_api9.diag.debug("maxQueueSize reached, dropping spans");
      this._droppedSpansCount++;
      return;
    }
    if (this._droppedSpansCount > 0)
      import_api9.diag.warn(`Dropped ${this._droppedSpansCount} spans because maxQueueSize reached`), this._droppedSpansCount = 0;
    this._finishedSpans.push(span), this._maybeStartTimer();
  }
  _flushAll() {
    return new Promise((resolve26, reject2) => {
      let promises = [], count3 = Math.ceil(this._finishedSpans.length / this._maxExportBatchSize);
      for (let i5 = 0, j4 = count3;i5 < j4; i5++)
        promises.push(this._flushOneBatch());
      Promise.all(promises).then(() => {
        resolve26();
      }).catch(reject2);
    });
  }
  _flushOneBatch() {
    if (this._clearTimer(), this._finishedSpans.length === 0)
      return Promise.resolve();
    return new Promise((resolve26, reject2) => {
      let timer = setTimeout(() => {
        reject2(Error("Timeout"));
      }, this._exportTimeoutMillis);
      import_api9.context.with(import_core52.suppressTracing(import_api9.context.active()), () => {
        let spans;
        if (this._finishedSpans.length <= this._maxExportBatchSize)
          spans = this._finishedSpans, this._finishedSpans = [];
        else
          spans = this._finishedSpans.splice(0, this._maxExportBatchSize);
        let doExport = () => this._exporter.export(spans, (result) => {
          if (clearTimeout(timer), result.code === import_core52.ExportResultCode.SUCCESS)
            resolve26();
          else
            reject2(result.error ?? Error("BatchSpanProcessor: span export failed"));
        }), pendingResources = null;
        for (let i5 = 0, len = spans.length;i5 < len; i5++) {
          let span = spans[i5];
          if (span.resource.asyncAttributesPending && span.resource.waitForAsyncAttributes)
            pendingResources ??= [], pendingResources.push(span.resource.waitForAsyncAttributes());
        }
        if (pendingResources === null)
          doExport();
        else
          Promise.all(pendingResources).then(doExport, (err2) => {
            import_core52.globalErrorHandler(err2), reject2(err2);
          });
      });
    });
  }
  _maybeStartTimer() {
    if (this._isExporting)
      return;
    let flush = () => {
      this._isExporting = !0, this._flushOneBatch().finally(() => {
        if (this._isExporting = !1, this._finishedSpans.length > 0)
          this._clearTimer(), this._maybeStartTimer();
      }).catch((e) => {
        this._isExporting = !1, import_core52.globalErrorHandler(e);
      });
    };
    if (this._finishedSpans.length >= this._maxExportBatchSize)
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
}
