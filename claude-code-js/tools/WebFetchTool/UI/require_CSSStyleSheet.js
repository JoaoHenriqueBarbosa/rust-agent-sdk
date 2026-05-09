// var: require_CSSStyleSheet
var require_CSSStyleSheet = __commonJS((exports) => {
  var CSSOM = {
    StyleSheet: require_StyleSheet().StyleSheet,
    CSSStyleRule: require_CSSStyleRule().CSSStyleRule
  };
  CSSOM.CSSStyleSheet = function() {
    CSSOM.StyleSheet.call(this), this.cssRules = [];
  };
  CSSOM.CSSStyleSheet.prototype = new CSSOM.StyleSheet;
  CSSOM.CSSStyleSheet.prototype.constructor = CSSOM.CSSStyleSheet;
  CSSOM.CSSStyleSheet.prototype.insertRule = function(rule, index) {
    if (index < 0 || index > this.cssRules.length)
      throw RangeError("INDEX_SIZE_ERR");
    var cssRule = CSSOM.parse(rule).cssRules[0];
    return cssRule.parentStyleSheet = this, this.cssRules.splice(index, 0, cssRule), index;
  };
  CSSOM.CSSStyleSheet.prototype.deleteRule = function(index) {
    if (index < 0 || index >= this.cssRules.length)
      throw RangeError("INDEX_SIZE_ERR");
    this.cssRules.splice(index, 1);
  };
  CSSOM.CSSStyleSheet.prototype.toString = function() {
    var result = "", rules = this.cssRules;
    for (var i5 = 0;i5 < rules.length; i5++)
      result += rules[i5].cssText + `
`;
    return result;
  };
  exports.CSSStyleSheet = CSSOM.CSSStyleSheet;
  CSSOM.parse = require_parse8().parse;
});
