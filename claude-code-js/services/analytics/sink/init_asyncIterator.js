// var: init_asyncIterator
var init_asyncIterator = __esm(() => {
  a = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {}).prototype);
  n = Symbol();
  Object.defineProperty(i, "name", { value: "next" });
  Object.defineProperty(o, "name", { value: "return" });
  u = Object.create(a, {
    next: {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: i
    },
    return: {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: o
    }
  });
});
