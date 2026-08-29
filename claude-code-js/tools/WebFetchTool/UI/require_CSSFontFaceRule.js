// var: require_CSSFontFaceRule
var require_CSSFontFaceRule = __commonJS((exports) => {
  var CSSOM = {
    CSSStyleDeclaration: require_CSSStyleDeclaration().CSSStyleDeclaration,
    CSSRule: require_CSSRule().CSSRule
  };
  CSSOM.CSSFontFaceRule = function() {
    CSSOM.CSSRule.call(this), this.style = new CSSOM.CSSStyleDeclaration, this.style.parentRule = this;
  };
  CSSOM.CSSFontFaceRule.prototype = new CSSOM.CSSRule;
  CSSOM.CSSFontFaceRule.prototype.constructor = CSSOM.CSSFontFaceRule;
  CSSOM.CSSFontFaceRule.prototype.type = 5;
  Object.defineProperty(CSSOM.CSSFontFaceRule.prototype, "cssText", {
    get: function() {
      return "@font-face {" + this.style.cssText + "}";
    }
  });
  exports.CSSFontFaceRule = CSSOM.CSSFontFaceRule;
});
