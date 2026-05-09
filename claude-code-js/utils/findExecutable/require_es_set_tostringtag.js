// var: require_es_set_tostringtag
var require_es_set_tostringtag = __commonJS((exports, module) => {
  var GetIntrinsic = require_get_intrinsic(), $defineProperty = GetIntrinsic("%Object.defineProperty%", !0), hasToStringTag = require_shams2()(), hasOwn2 = require_hasown(), $TypeError = require_type(), toStringTag2 = hasToStringTag ? Symbol.toStringTag : null;
  module.exports = function(object2, value) {
    var overrideIfSet = arguments.length > 2 && !!arguments[2] && arguments[2].force, nonConfigurable = arguments.length > 2 && !!arguments[2] && arguments[2].nonConfigurable;
    if (typeof overrideIfSet < "u" && typeof overrideIfSet !== "boolean" || typeof nonConfigurable < "u" && typeof nonConfigurable !== "boolean")
      throw new $TypeError("if provided, the `overrideIfSet` and `nonConfigurable` options must be booleans");
    if (toStringTag2 && (overrideIfSet || !hasOwn2(object2, toStringTag2)))
      if ($defineProperty)
        $defineProperty(object2, toStringTag2, {
          configurable: !nonConfigurable,
          enumerable: !1,
          value,
          writable: !1
        });
      else
        object2[toStringTag2] = value;
  };
});
