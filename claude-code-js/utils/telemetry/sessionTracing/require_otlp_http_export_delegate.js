// var: require_otlp_http_export_delegate
var require_otlp_http_export_delegate = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.createOtlpHttpExportDelegate = void 0;
  var otlp_export_delegate_1 = require_otlp_export_delegate(), http_exporter_transport_1 = require_http_exporter_transport(), bounded_queue_export_promise_handler_1 = require_bounded_queue_export_promise_handler(), retrying_transport_1 = require_retrying_transport();
  function createOtlpHttpExportDelegate(options2, serializer) {
    return (0, otlp_export_delegate_1.createOtlpExportDelegate)({
      transport: (0, retrying_transport_1.createRetryingTransport)({
        transport: (0, http_exporter_transport_1.createHttpExporterTransport)(options2)
      }),
      serializer,
      promiseHandler: (0, bounded_queue_export_promise_handler_1.createBoundedQueueExportPromiseHandler)(options2)
    }, { timeout: options2.timeoutMillis });
  }
  exports.createOtlpHttpExportDelegate = createOtlpHttpExportDelegate;
});
