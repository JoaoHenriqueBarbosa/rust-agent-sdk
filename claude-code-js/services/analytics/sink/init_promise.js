// var: init_promise
var init_promise = __esm(() => {
  nativePromisePrototype = (async () => {})().constructor.prototype, descriptors = ["then", "catch", "finally"].map((property2) => [
    property2,
    Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property2)
  ]);
});
