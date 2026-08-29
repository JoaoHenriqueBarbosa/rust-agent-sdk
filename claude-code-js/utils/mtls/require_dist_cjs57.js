// var: require_dist_cjs57
var require_dist_cjs57 = __commonJS((exports) => {
  var booleanSelector = (obj, key, type) => {
    if (!(key in obj))
      return;
    if (obj[key] === "true")
      return !0;
    if (obj[key] === "false")
      return !1;
    throw Error(`Cannot load ${type} "${key}". Expected "true" or "false", got ${obj[key]}.`);
  }, numberSelector = (obj, key, type) => {
    if (!(key in obj))
      return;
    let numberValue = parseInt(obj[key], 10);
    if (Number.isNaN(numberValue))
      throw TypeError(`Cannot load ${type} '${key}'. Expected number, got '${obj[key]}'.`);
    return numberValue;
  };
  exports.SelectorType = void 0;
  (function(SelectorType) {
    SelectorType.ENV = "env", SelectorType.CONFIG = "shared config entry";
  })(exports.SelectorType || (exports.SelectorType = {}));
  exports.booleanSelector = booleanSelector;
  exports.numberSelector = numberSelector;
});
