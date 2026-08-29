// var: require_NoopTracerProvider
var require_NoopTracerProvider = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.NoopTracerProvider = void 0;
  var NoopTracer_1 = require_NoopTracer();

  class NoopTracerProvider {
    getTracer(_name, _version, _options) {
      return new NoopTracer_1.NoopTracer;
    }
  }
  exports.NoopTracerProvider = NoopTracerProvider;
});
