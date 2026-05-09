// function: defineLazy
function defineLazy(object, key, getter) {
  Object.defineProperty(object, key, {
    get() {
      {
        let value = getter();
        return object[key] = value, value;
      }
      throw Error("cached value already set");
    },
    set(v) {
      Object.defineProperty(object, key, {
        value: v
      });
    },
    configurable: !0
  });
}
