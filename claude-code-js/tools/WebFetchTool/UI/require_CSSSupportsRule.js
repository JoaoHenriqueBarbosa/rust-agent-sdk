// var: require_CSSSupportsRule
var require_CSSSupportsRule = __commonJS((exports) => {
  var CSSOM = {
    CSSRule: require_CSSRule().CSSRule,
    CSSGroupingRule: require_CSSGroupingRule().CSSGroupingRule,
    CSSConditionRule: require_CSSConditionRule().CSSConditionRule
  };
  CSSOM.CSSSupportsRule = function() {
    CSSOM.CSSConditionRule.call(this);
  };
  CSSOM.CSSSupportsRule.prototype = new CSSOM.CSSConditionRule;
  CSSOM.CSSSupportsRule.prototype.constructor = CSSOM.CSSSupportsRule;
  CSSOM.CSSSupportsRule.prototype.type = 12;
  Object.defineProperty(CSSOM.CSSSupportsRule.prototype, "cssText", {
    get: function() {
      var cssTexts = [];
      for (var i5 = 0, length = this.cssRules.length;i5 < length; i5++)
        cssTexts.push(this.cssRules[i5].cssText);
      return "@supports " + this.conditionText + " {" + cssTexts.join("") + "}";
    }
  });
  exports.CSSSupportsRule = CSSOM.CSSSupportsRule;
});
