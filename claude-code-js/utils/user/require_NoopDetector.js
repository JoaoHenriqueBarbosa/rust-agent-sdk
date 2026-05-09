// var: require_NoopDetector
var require_NoopDetector = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.noopDetector = exports.NoopDetector = void 0;

  class NoopDetector {
    detect() {
      return {
        attributes: {}
      };
    }
  }
  exports.NoopDetector = NoopDetector;
  exports.noopDetector = new NoopDetector;
});
