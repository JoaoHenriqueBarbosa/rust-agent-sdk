// var: require_ProxyTracerProvider
var require_ProxyTracerProvider = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.ProxyTracerProvider = void 0;
  var ProxyTracer_1 = require_ProxyTracer(), NoopTracerProvider_1 = require_NoopTracerProvider(), NOOP_TRACER_PROVIDER = new NoopTracerProvider_1.NoopTracerProvider;

  class ProxyTracerProvider {
    getTracer(name3, version5, options2) {
      var _a3;
      return (_a3 = this.getDelegateTracer(name3, version5, options2)) !== null && _a3 !== void 0 ? _a3 : new ProxyTracer_1.ProxyTracer(this, name3, version5, options2);
    }
    getDelegate() {
      var _a3;
      return (_a3 = this._delegate) !== null && _a3 !== void 0 ? _a3 : NOOP_TRACER_PROVIDER;
    }
    setDelegate(delegate) {
      this._delegate = delegate;
    }
    getDelegateTracer(name3, version5, options2) {
      var _a3;
      return (_a3 = this._delegate) === null || _a3 === void 0 ? void 0 : _a3.getTracer(name3, version5, options2);
    }
  }
  exports.ProxyTracerProvider = ProxyTracerProvider;
});
