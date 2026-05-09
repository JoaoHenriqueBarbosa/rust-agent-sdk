// var: require_trace
var require_trace = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.TraceAPI = void 0;
  var global_utils_1 = require_global_utils(), ProxyTracerProvider_1 = require_ProxyTracerProvider(), spancontext_utils_1 = require_spancontext_utils(), context_utils_1 = require_context_utils(), diag_1 = require_diag(), API_NAME = "trace";

  class TraceAPI {
    constructor() {
      this._proxyTracerProvider = new ProxyTracerProvider_1.ProxyTracerProvider, this.wrapSpanContext = spancontext_utils_1.wrapSpanContext, this.isSpanContextValid = spancontext_utils_1.isSpanContextValid, this.deleteSpan = context_utils_1.deleteSpan, this.getSpan = context_utils_1.getSpan, this.getActiveSpan = context_utils_1.getActiveSpan, this.getSpanContext = context_utils_1.getSpanContext, this.setSpan = context_utils_1.setSpan, this.setSpanContext = context_utils_1.setSpanContext;
    }
    static getInstance() {
      if (!this._instance)
        this._instance = new TraceAPI;
      return this._instance;
    }
    setGlobalTracerProvider(provider5) {
      let success2 = (0, global_utils_1.registerGlobal)(API_NAME, this._proxyTracerProvider, diag_1.DiagAPI.instance());
      if (success2)
        this._proxyTracerProvider.setDelegate(provider5);
      return success2;
    }
    getTracerProvider() {
      return (0, global_utils_1.getGlobal)(API_NAME) || this._proxyTracerProvider;
    }
    getTracer(name3, version5) {
      return this.getTracerProvider().getTracer(name3, version5);
    }
    disable() {
      (0, global_utils_1.unregisterGlobal)(API_NAME, diag_1.DiagAPI.instance()), this._proxyTracerProvider = new ProxyTracerProvider_1.ProxyTracerProvider;
    }
  }
  exports.TraceAPI = TraceAPI;
});
