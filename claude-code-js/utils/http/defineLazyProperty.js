// function: defineLazyProperty
function defineLazyProperty(object2, propertyName, valueGetter) {
  let define2 = (value) => Object.defineProperty(object2, propertyName, { value, enumerable: !0, writable: !0 });
  return Object.defineProperty(object2, propertyName, {
    configurable: !0,
    enumerable: !0,
    get() {
      let result = valueGetter();
      return define2(result), result;
    },
    set(value) {
      define2(value);
    }
  }), object2;
}
