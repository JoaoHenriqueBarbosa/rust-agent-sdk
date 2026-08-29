// var: init__defineProperty
var init__defineProperty = __esm(() => {
  init__getNative();
  defineProperty = function() {
    try {
      var func = _getNative_default(Object, "defineProperty");
      return func({}, "", {}), func;
    } catch (e) {}
  }(), _defineProperty_default = defineProperty;
});
