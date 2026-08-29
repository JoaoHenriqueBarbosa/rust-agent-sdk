// var: require_ProxyTracer
var require_ProxyTracer = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.ProxyTracer = void 0;
  var NoopTracer_1 = require_NoopTracer(), NOOP_TRACER = new NoopTracer_1.NoopTracer;

  class ProxyTracer {
    constructor(provider5, name3, version5, options2) {
      this._provider = provider5, this.name = name3, this.version = version5, this.options = options2;
    }
    startSpan(name3, options2, context3) {
      return this._getTracer().startSpan(name3, options2, context3);
    }
    startActiveSpan(_name, _options, _context, _fn) {
      let tracer = this._getTracer();
      return Reflect.apply(tracer.startActiveSpan, tracer, arguments);
    }
    _getTracer() {
      if (this._delegate)
        return this._delegate;
      let tracer = this._provider.getDelegateTracer(this.name, this.version, this.options);
      if (!tracer)
        return NOOP_TRACER;
      return this._delegate = tracer, this._delegate;
    }
  }
  exports.ProxyTracer = ProxyTracer;
});
