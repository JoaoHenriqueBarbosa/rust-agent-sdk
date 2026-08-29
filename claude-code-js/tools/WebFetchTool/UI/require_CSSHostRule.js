// var: require_CSSHostRule
var require_CSSHostRule = __commonJS((exports) => {
  var CSSOM = {
    CSSRule: require_CSSRule().CSSRule
  };
  CSSOM.CSSHostRule = function() {
    CSSOM.CSSRule.call(this), this.cssRules = [];
  };
  CSSOM.CSSHostRule.prototype = new CSSOM.CSSRule;
  CSSOM.CSSHostRule.prototype.constructor = CSSOM.CSSHostRule;
  CSSOM.CSSHostRule.prototype.type = 1001;
  Object.defineProperty(CSSOM.CSSHostRule.prototype, "cssText", {
    get: function() {
      var cssTexts = [];
      for (var i5 = 0, length = this.cssRules.length;i5 < length; i5++)
        cssTexts.push(this.cssRules[i5].cssText);
      return "@host {" + cssTexts.join("") + "}";
    }
  });
  exports.CSSHostRule = CSSOM.CSSHostRule;
});
