// var: require_otlp_export_delegate
var require_otlp_export_delegate = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.createOtlpExportDelegate = void 0;
  var core_1 = require_src9(), types_1 = require_types5(), logging_response_handler_1 = require_logging_response_handler(), api_1 = require_src7();

  class OTLPExportDelegate {
    _diagLogger;
    _transport;
    _serializer;
    _responseHandler;
    _promiseQueue;
    _timeout;
    constructor(transport, serializer, responseHandler, promiseQueue, timeout) {
      this._transport = transport, this._serializer = serializer, this._responseHandler = responseHandler, this._promiseQueue = promiseQueue, this._timeout = timeout, this._diagLogger = api_1.diag.createComponentLogger({
        namespace: "OTLPExportDelegate"
      });
    }
    export(internalRepresentation, resultCallback) {
      if (this._diagLogger.debug("items to be sent", internalRepresentation), this._promiseQueue.hasReachedLimit()) {
        resultCallback({
          code: core_1.ExportResultCode.FAILED,
          error: Error("Concurrent export limit reached")
        });
        return;
      }
      let serializedRequest = this._serializer.serializeRequest(internalRepresentation);
      if (serializedRequest == null) {
        resultCallback({
          code: core_1.ExportResultCode.FAILED,
          error: Error("Nothing to send")
        });
        return;
      }
      this._promiseQueue.pushPromise(this._transport.send(serializedRequest, this._timeout).then((response7) => {
        if (response7.status === "success") {
          if (response7.data != null)
            try {
              this._responseHandler.handleResponse(this._serializer.deserializeResponse(response7.data));
            } catch (e) {
              this._diagLogger.warn("Export succeeded but could not deserialize response - is the response specification compliant?", e, response7.data);
            }
          resultCallback({
            code: core_1.ExportResultCode.SUCCESS
          });
          return;
        } else if (response7.status === "failure" && response7.error) {
          resultCallback({
            code: core_1.ExportResultCode.FAILED,
            error: response7.error
          });
          return;
        } else if (response7.status === "retryable")
          resultCallback({
            code: core_1.ExportResultCode.FAILED,
            error: response7.error ?? new types_1.OTLPExporterError("Export failed with retryable status")
          });
        else
          resultCallback({
            code: core_1.ExportResultCode.FAILED,
            error: new types_1.OTLPExporterError("Export failed with unknown error")
          });
      }, (reason) => resultCallback({
        code: core_1.ExportResultCode.FAILED,
        error: reason
      })));
    }
    forceFlush() {
      return this._promiseQueue.awaitAll();
    }
    async shutdown() {
      this._diagLogger.debug("shutdown started"), await this.forceFlush(), this._transport.shutdown();
    }
  }
  function createOtlpExportDelegate(components, settings) {
    return new OTLPExportDelegate(components.transport, components.serializer, (0, logging_response_handler_1.createLoggingPartialSuccessResponseHandler)(), components.promiseHandler, settings.timeout);
  }
  exports.createOtlpExportDelegate = createOtlpExportDelegate;
});
