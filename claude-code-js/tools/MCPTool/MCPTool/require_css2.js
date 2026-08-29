// var: require_css2
var require_css2 = __commonJS((exports, module) => {
  var DEFAULT = require_default(), parseStyle = require_parser2(), _ = require_util5();
  function isNull(obj) {
    return obj === void 0 || obj === null;
  }
  function shallowCopyObject(obj) {
    var ret = {};
    for (var i5 in obj)
      ret[i5] = obj[i5];
    return ret;
  }
  function FilterCSS(options2) {
    options2 = shallowCopyObject(options2 || {}), options2.whiteList = options2.whiteList || DEFAULT.whiteList, options2.onAttr = options2.onAttr || DEFAULT.onAttr, options2.onIgnoreAttr = options2.onIgnoreAttr || DEFAULT.onIgnoreAttr, options2.safeAttrValue = options2.safeAttrValue || DEFAULT.safeAttrValue, this.options = options2;
  }
  FilterCSS.prototype.process = function(css) {
    if (css = css || "", css = css.toString(), !css)
      return "";
    var me = this, options2 = me.options, whiteList = options2.whiteList, onAttr = options2.onAttr, onIgnoreAttr = options2.onIgnoreAttr, safeAttrValue = options2.safeAttrValue, retCSS = parseStyle(css, function(sourcePosition, position, name3, value, source) {
      var check3 = whiteList[name3], isWhite = !1;
      if (check3 === !0)
        isWhite = check3;
      else if (typeof check3 === "function")
        isWhite = check3(value);
      else if (check3 instanceof RegExp)
        isWhite = check3.test(value);
      if (isWhite !== !0)
        isWhite = !1;
      if (value = safeAttrValue(name3, value), !value)
        return;
      var opts = {
        position,
        sourcePosition,
        source,
        isWhite
      };
      if (isWhite) {
        var ret = onAttr(name3, value, opts);
        if (isNull(ret))
          return name3 + ":" + value;
        else
          return ret;
      } else {
        var ret = onIgnoreAttr(name3, value, opts);
        if (!isNull(ret))
          return ret;
      }
    });
    return retCSS;
  };
  module.exports = FilterCSS;
});
