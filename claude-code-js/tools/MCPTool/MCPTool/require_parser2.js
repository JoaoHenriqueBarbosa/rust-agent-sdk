// var: require_parser2
var require_parser2 = __commonJS((exports, module) => {
  var _ = require_util5();
  function parseStyle(css, onAttr) {
    if (css = _.trimRight(css), css[css.length - 1] !== ";")
      css += ";";
    var cssLength = css.length, isParenthesisOpen = !1, lastPos = 0, i5 = 0, retCSS = "";
    function addNewAttr() {
      if (!isParenthesisOpen) {
        var source = _.trim(css.slice(lastPos, i5)), j5 = source.indexOf(":");
        if (j5 !== -1) {
          var name3 = _.trim(source.slice(0, j5)), value = _.trim(source.slice(j5 + 1));
          if (name3) {
            var ret = onAttr(lastPos, retCSS.length, name3, value, source);
            if (ret)
              retCSS += ret + "; ";
          }
        }
      }
      lastPos = i5 + 1;
    }
    for (;i5 < cssLength; i5++) {
      var c3 = css[i5];
      if (c3 === "/" && css[i5 + 1] === "*") {
        var j4 = css.indexOf("*/", i5 + 2);
        if (j4 === -1)
          break;
        i5 = j4 + 1, lastPos = i5 + 1, isParenthesisOpen = !1;
      } else if (c3 === "(")
        isParenthesisOpen = !0;
      else if (c3 === ")")
        isParenthesisOpen = !1;
      else if (c3 === ";")
        if (isParenthesisOpen)
          ;
        else
          addNewAttr();
      else if (c3 === `
`)
        addNewAttr();
    }
    return _.trim(retCSS);
  }
  module.exports = parseStyle;
});
