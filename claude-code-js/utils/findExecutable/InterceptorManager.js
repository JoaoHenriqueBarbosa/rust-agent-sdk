// class: InterceptorManager
class InterceptorManager {
  constructor() {
    this.handlers = [];
  }
  use(fulfilled, rejected, options) {
    return this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : !1,
      runWhen: options ? options.runWhen : null
    }), this.handlers.length - 1;
  }
  eject(id) {
    if (this.handlers[id])
      this.handlers[id] = null;
  }
  clear() {
    if (this.handlers)
      this.handlers = [];
  }
  forEach(fn) {
    utils_default.forEach(this.handlers, function(h2) {
      if (h2 !== null)
        fn(h2);
    });
  }
}
