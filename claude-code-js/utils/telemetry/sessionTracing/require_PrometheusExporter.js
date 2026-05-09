// var: require_PrometheusExporter
var require_PrometheusExporter = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.PrometheusExporter = void 0;
  var api_1 = require_src7(), core_1 = require_src9(), sdk_metrics_1 = require_src11(), http_1 = __require("http"), PrometheusSerializer_1 = require_PrometheusSerializer(), url_1 = __require("url");

  class PrometheusExporter extends sdk_metrics_1.MetricReader {
    static DEFAULT_OPTIONS = {
      host: void 0,
      port: 9464,
      endpoint: "/metrics",
      prefix: "",
      appendTimestamp: !1,
      withResourceConstantLabels: void 0,
      withoutScopeInfo: !1,
      withoutTargetInfo: !1
    };
    _host;
    _port;
    _baseUrl;
    _endpoint;
    _server;
    _prefix;
    _appendTimestamp;
    _serializer;
    _startServerPromise;
    constructor(config10 = {}, callback = () => {}) {
      super({
        aggregationSelector: (_instrumentType) => {
          return {
            type: sdk_metrics_1.AggregationType.DEFAULT
          };
        },
        aggregationTemporalitySelector: (_instrumentType) => sdk_metrics_1.AggregationTemporality.CUMULATIVE,
        metricProducers: config10.metricProducers
      });
      this._host = config10.host || process.env.OTEL_EXPORTER_PROMETHEUS_HOST || PrometheusExporter.DEFAULT_OPTIONS.host, this._port = config10.port || Number(process.env.OTEL_EXPORTER_PROMETHEUS_PORT) || PrometheusExporter.DEFAULT_OPTIONS.port, this._prefix = config10.prefix || PrometheusExporter.DEFAULT_OPTIONS.prefix, this._appendTimestamp = typeof config10.appendTimestamp === "boolean" ? config10.appendTimestamp : PrometheusExporter.DEFAULT_OPTIONS.appendTimestamp;
      let _withResourceConstantLabels = config10.withResourceConstantLabels || PrometheusExporter.DEFAULT_OPTIONS.withResourceConstantLabels, _withoutScopeInfo = config10.withoutScopeInfo || PrometheusExporter.DEFAULT_OPTIONS.withoutScopeInfo, _withoutTargetInfo = config10.withoutTargetInfo || PrometheusExporter.DEFAULT_OPTIONS.withoutTargetInfo;
      if (this._server = (0, http_1.createServer)(this._requestHandler).unref(), this._serializer = new PrometheusSerializer_1.PrometheusSerializer(this._prefix, this._appendTimestamp, _withResourceConstantLabels, _withoutTargetInfo, _withoutScopeInfo), this._baseUrl = `http://${this._host}:${this._port}/`, this._endpoint = (config10.endpoint || PrometheusExporter.DEFAULT_OPTIONS.endpoint).replace(/^([^/])/, "/$1"), config10.preventServerStart !== !0)
        this.startServer().then(callback, (err2) => {
          api_1.diag.error(err2), callback(err2);
        });
      else if (callback)
        queueMicrotask(callback);
    }
    async onForceFlush() {}
    onShutdown() {
      return this.stopServer();
    }
    stopServer() {
      if (!this._server)
        return api_1.diag.debug("Prometheus stopServer() was called but server was never started."), Promise.resolve();
      else
        return new Promise((resolve26) => {
          this._server.close((err2) => {
            if (!err2)
              api_1.diag.debug("Prometheus exporter was stopped");
            else if (err2.code !== "ERR_SERVER_NOT_RUNNING")
              (0, core_1.globalErrorHandler)(err2);
            resolve26();
          });
        });
    }
    startServer() {
      return this._startServerPromise ??= new Promise((resolve26, reject2) => {
        this._server.once("error", reject2), this._server.listen({
          port: this._port,
          host: this._host
        }, () => {
          api_1.diag.debug(`Prometheus exporter server started: ${this._host}:${this._port}/${this._endpoint}`), resolve26();
        });
      }), this._startServerPromise;
    }
    getMetricsRequestHandler(_request, response7) {
      this._exportMetrics(response7);
    }
    _requestHandler = (request2, response7) => {
      if (request2.url != null && new url_1.URL(request2.url, this._baseUrl).pathname === this._endpoint)
        this._exportMetrics(response7);
      else
        this._notFound(response7);
    };
    _exportMetrics = (response7) => {
      response7.statusCode = 200, response7.setHeader("content-type", "text/plain"), this.collect().then((collectionResult) => {
        let { resourceMetrics, errors: errors8 } = collectionResult;
        if (errors8.length)
          api_1.diag.error("PrometheusExporter: metrics collection errors", ...errors8);
        response7.end(this._serializer.serialize(resourceMetrics));
      }, (err2) => {
        response7.end(`# failed to export metrics: ${err2}`);
      });
    };
    _notFound = (response7) => {
      response7.statusCode = 404, response7.end();
    };
  }
  exports.PrometheusExporter = PrometheusExporter;
});
