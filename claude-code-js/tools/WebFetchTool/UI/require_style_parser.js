// var: require_style_parser
var require_style_parser = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.hyphenate = exports.parse = void 0;
  function parse17(value) {
    let styles5 = [], i5 = 0, parenDepth = 0, quote2 = 0, valueStart = 0, propStart = 0, currentProp = null;
    while (i5 < value.length)
      switch (value.charCodeAt(i5++)) {
        case 40:
          parenDepth++;
          break;
        case 41:
          parenDepth--;
          break;
        case 39:
          if (quote2 === 0)
            quote2 = 39;
          else if (quote2 === 39 && value.charCodeAt(i5 - 1) !== 92)
            quote2 = 0;
          break;
        case 34:
          if (quote2 === 0)
            quote2 = 34;
          else if (quote2 === 34 && value.charCodeAt(i5 - 1) !== 92)
            quote2 = 0;
          break;
        case 58:
          if (!currentProp && parenDepth === 0 && quote2 === 0)
            currentProp = hyphenate(value.substring(propStart, i5 - 1).trim()), valueStart = i5;
          break;
        case 59:
          if (currentProp && valueStart > 0 && parenDepth === 0 && quote2 === 0) {
            let styleVal = value.substring(valueStart, i5 - 1).trim();
            styles5.push(currentProp, styleVal), propStart = i5, valueStart = 0, currentProp = null;
          }
          break;
      }
    if (currentProp && valueStart) {
      let styleVal = value.slice(valueStart).trim();
      styles5.push(currentProp, styleVal);
    }
    return styles5;
  }
  exports.parse = parse17;
  function hyphenate(value) {
    return value.replace(/[a-z][A-Z]/g, (v2) => {
      return v2.charAt(0) + "-" + v2.charAt(1);
    }).toLowerCase();
  }
  exports.hyphenate = hyphenate;
});
