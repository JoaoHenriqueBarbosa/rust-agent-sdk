// var: require_context
var require_context = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.ROOT_CONTEXT = exports.createContextKey = void 0;
  function createContextKey(description) {
    return Symbol.for(description);
  }
  exports.createContextKey = createContextKey;

  class BaseContext {
    constructor(parentContext) {
      let self2 = this;
      self2._currentContext = parentContext ? new Map(parentContext) : /* @__PURE__ */ new Map, self2.getValue = (key2) => self2._currentContext.get(key2), self2.setValue = (key2, value) => {
        let context3 = new BaseContext(self2._currentContext);
        return context3._currentContext.set(key2, value), context3;
      }, self2.deleteValue = (key2) => {
        let context3 = new BaseContext(self2._currentContext);
        return context3._currentContext.delete(key2), context3;
      };
    }
  }
  exports.ROOT_CONTEXT = new BaseContext;
});
