// var: require_otlp_network_export_delegate
var require_otlp_network_export_delegate = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.createOtlpNetworkExportDelegate = void 0;
  var bounded_queue_export_promise_handler_1 = require_bounded_queue_export_promise_handler(), otlp_export_delegate_1 = require_otlp_export_delegate();
  function createOtlpNetworkExportDelegate(options2, serializer, transport) {
    return (0, otlp_export_delegate_1.createOtlpExportDelegate)({
      transport,
      serializer,
      promiseHandler: (0, bounded_queue_export_promise_handler_1.createBoundedQueueExportPromiseHandler)(options2)
    }, { timeout: options2.timeoutMillis });
  }
  exports.createOtlpNetworkExportDelegate = createOtlpNetworkExportDelegate;
});
