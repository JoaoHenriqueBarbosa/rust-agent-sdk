// var: require_OTLPExporterBase
var require_OTLPExporterBase = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.OTLPExporterBase = void 0;

  class OTLPExporterBase {
    _delegate;
    constructor(delegate) {
      this._delegate = delegate;
    }
    export(items, resultCallback) {
      this._delegate.export(items, resultCallback);
    }
    forceFlush() {
      return this._delegate.forceFlush();
    }
    shutdown() {
      return this._delegate.shutdown();
    }
  }
  exports.OTLPExporterBase = OTLPExporterBase;
});
