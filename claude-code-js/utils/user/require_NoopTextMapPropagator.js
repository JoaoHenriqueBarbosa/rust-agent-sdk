// var: require_NoopTextMapPropagator
var require_NoopTextMapPropagator = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.NoopTextMapPropagator = void 0;

  class NoopTextMapPropagator {
    inject(_context, _carrier) {}
    extract(context3, _carrier) {
      return context3;
    }
    fields() {
      return [];
    }
  }
  exports.NoopTextMapPropagator = NoopTextMapPropagator;
});
