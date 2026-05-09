// var: require_NoopContextManager
var require_NoopContextManager = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.NoopContextManager = void 0;
  var context_1 = require_context();

  class NoopContextManager {
    active() {
      return context_1.ROOT_CONTEXT;
    }
    with(_context, fn, thisArg, ...args) {
      return fn.call(thisArg, ...args);
    }
    bind(_context, target) {
      return target;
    }
    enable() {
      return this;
    }
    disable() {
      return this;
    }
  }
  exports.NoopContextManager = NoopContextManager;
});
