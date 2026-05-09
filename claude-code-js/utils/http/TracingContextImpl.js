// class: TracingContextImpl
class TracingContextImpl {
  _contextMap;
  constructor(initialContext) {
    this._contextMap = initialContext instanceof TracingContextImpl ? new Map(initialContext._contextMap) : /* @__PURE__ */ new Map;
  }
  setValue(key, value) {
    let newContext = new TracingContextImpl(this);
    return newContext._contextMap.set(key, value), newContext;
  }
  getValue(key) {
    return this._contextMap.get(key);
  }
  deleteValue(key) {
    let newContext = new TracingContextImpl(this);
    return newContext._contextMap.delete(key), newContext;
  }
}
