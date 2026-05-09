// var: init_lazy_json
var init_lazy_json = __esm(() => {
  StringWrapper.prototype = Object.create(String.prototype, {
    constructor: {
      value: StringWrapper,
      enumerable: !1,
      writable: !0,
      configurable: !0
    }
  });
  Object.setPrototypeOf(StringWrapper, String);
});
