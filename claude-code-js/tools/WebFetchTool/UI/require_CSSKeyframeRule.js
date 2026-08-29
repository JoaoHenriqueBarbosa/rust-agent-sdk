// var: require_CSSKeyframeRule
var require_CSSKeyframeRule = __commonJS((exports) => {
  var CSSOM = {
    CSSRule: require_CSSRule().CSSRule,
    CSSStyleDeclaration: require_CSSStyleDeclaration().CSSStyleDeclaration
  };
  CSSOM.CSSKeyframeRule = function() {
    CSSOM.CSSRule.call(this), this.keyText = "", this.style = new CSSOM.CSSStyleDeclaration, this.style.parentRule = this;
  };
  CSSOM.CSSKeyframeRule.prototype = new CSSOM.CSSRule;
  CSSOM.CSSKeyframeRule.prototype.constructor = CSSOM.CSSKeyframeRule;
  CSSOM.CSSKeyframeRule.prototype.type = 8;
  Object.defineProperty(CSSOM.CSSKeyframeRule.prototype, "cssText", {
    get: function() {
      return this.keyText + " {" + this.style.cssText + "} ";
    }
  });
  exports.CSSKeyframeRule = CSSOM.CSSKeyframeRule;
});
