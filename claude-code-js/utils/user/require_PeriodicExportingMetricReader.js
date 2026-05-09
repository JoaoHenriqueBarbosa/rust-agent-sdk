// var: require_PeriodicExportingMetricReader
var require_PeriodicExportingMetricReader = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.PeriodicExportingMetricReader = void 0;
  var api3 = require_src7(), core_1 = require_src9(), MetricReader_1 = require_MetricReader(), utils_1 = require_utils11();

  class PeriodicExportingMetricReader extends MetricReader_1.MetricReader {
    _interval;
    _exporter;
    _exportInterval;
    _exportTimeout;
    constructor(options2) {
      let { exporter, exportIntervalMillis = 60000, metricProducers } = options2, { exportTimeoutMillis = 30000 } = options2;
      super({
        aggregationSelector: exporter.selectAggregation?.bind(exporter),
        aggregationTemporalitySelector: exporter.selectAggregationTemporality?.bind(exporter),
        metricProducers
      });
      if (exportIntervalMillis <= 0)
        throw Error("exportIntervalMillis must be greater than 0");
      if (exportTimeoutMillis <= 0)
        throw Error("exportTimeoutMillis must be greater than 0");
      if (exportIntervalMillis < exportTimeoutMillis)
        if ("exportIntervalMillis" in options2 && "exportTimeoutMillis" in options2)
          throw Error("exportIntervalMillis must be greater than or equal to exportTimeoutMillis");
        else
          api3.diag.info(`Timeout of ${exportTimeoutMillis} exceeds the interval of ${exportIntervalMillis}. Clamping timeout to interval duration.`), exportTimeoutMillis = exportIntervalMillis;
      this._exportInterval = exportIntervalMillis, this._exportTimeout = exportTimeoutMillis, this._exporter = exporter;
    }
    async _runOnce() {
      try {
        await (0, utils_1.callWithTimeout)(this._doRun(), this._exportTimeout);
      } catch (err2) {
        if (err2 instanceof utils_1.TimeoutError) {
          api3.diag.error("Export took longer than %s milliseconds and timed out.", this._exportTimeout);
          return;
        }
        (0, core_1.globalErrorHandler)(err2);
      }
    }
    async _doRun() {
      let { resourceMetrics, errors: errors8 } = await this.collect({
        timeoutMillis: this._exportTimeout
      });
      if (errors8.length > 0)
        api3.diag.error("PeriodicExportingMetricReader: metrics collection errors", ...errors8);
      if (resourceMetrics.resource.asyncAttributesPending)
        try {
          await resourceMetrics.resource.waitForAsyncAttributes?.();
        } catch (e) {
          api3.diag.debug("Error while resolving async portion of resource: ", e), (0, core_1.globalErrorHandler)(e);
        }
      if (resourceMetrics.scopeMetrics.length === 0)
        return;
      let result = await core_1.internal._export(this._exporter, resourceMetrics);
      if (result.code !== core_1.ExportResultCode.SUCCESS)
        throw Error(`PeriodicExportingMetricReader: metrics export failed (error ${result.error})`);
    }
    onInitialized() {
      if (this._interval = setInterval(() => {
        this._runOnce();
      }, this._exportInterval), typeof this._interval !== "number")
        this._interval.unref();
    }
    async onForceFlush() {
      await this._runOnce(), await this._exporter.forceFlush();
    }
    async onShutdown() {
      if (this._interval)
        clearInterval(this._interval);
      await this.onForceFlush(), await this._exporter.shutdown();
    }
  }
  exports.PeriodicExportingMetricReader = PeriodicExportingMetricReader;
});
