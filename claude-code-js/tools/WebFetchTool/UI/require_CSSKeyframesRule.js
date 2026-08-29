// var: require_CSSKeyframesRule
var require_CSSKeyframesRule = __commonJS((exports) => {
  var CSSOM = {
    CSSRule: require_CSSRule().CSSRule
  };
  CSSOM.CSSKeyframesRule = function() {
    CSSOM.CSSRule.call(this), this.name = "", this.cssRules = [];
  };
  CSSOM.CSSKeyframesRule.prototype = new CSSOM.CSSRule;
  CSSOM.CSSKeyframesRule.prototype.constructor = CSSOM.CSSKeyframesRule;
  CSSOM.CSSKeyframesRule.prototype.type = 7;
  Object.defineProperty(CSSOM.CSSKeyframesRule.prototype, "cssText", {
    get: function() {
      var cssTexts = [];
      for (var i5 = 0, length = this.cssRules.length;i5 < length; i5++)
        cssTexts.push("  " + this.cssRules[i5].cssText);
      return "@" + (this._vendorPrefix || "") + "keyframes " + this.name + ` { 
` + cssTexts.join(`
`) + `
}`;
    }
  });
  exports.CSSKeyframesRule = CSSOM.CSSKeyframesRule;
});
