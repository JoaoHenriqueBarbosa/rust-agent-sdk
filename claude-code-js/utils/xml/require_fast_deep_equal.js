// var: require_fast_deep_equal
var require_fast_deep_equal = __commonJS((exports, module) => {
  module.exports = function equal(a2, b) {
    if (a2 === b)
      return !0;
    if (a2 && b && typeof a2 == "object" && typeof b == "object") {
      if (a2.constructor !== b.constructor)
        return !1;
      var length, i5, keys2;
      if (Array.isArray(a2)) {
        if (length = a2.length, length != b.length)
          return !1;
        for (i5 = length;i5-- !== 0; )
          if (!equal(a2[i5], b[i5]))
            return !1;
        return !0;
      }
      if (a2.constructor === RegExp)
        return a2.source === b.source && a2.flags === b.flags;
      if (a2.valueOf !== Object.prototype.valueOf)
        return a2.valueOf() === b.valueOf();
      if (a2.toString !== Object.prototype.toString)
        return a2.toString() === b.toString();
      if (keys2 = Object.keys(a2), length = keys2.length, length !== Object.keys(b).length)
        return !1;
      for (i5 = length;i5-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(b, keys2[i5]))
          return !1;
      for (i5 = length;i5-- !== 0; ) {
        var key2 = keys2[i5];
        if (!equal(a2[key2], b[key2]))
          return !1;
      }
      return !0;
    }
    return a2 !== a2 && b !== b;
  };
});
