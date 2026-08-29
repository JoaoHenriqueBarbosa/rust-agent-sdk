// var: require_CSSConditionRule
var require_CSSConditionRule = __commonJS((exports) => {
  var CSSOM = {
    CSSRule: require_CSSRule().CSSRule,
    CSSGroupingRule: require_CSSGroupingRule().CSSGroupingRule
  };
  CSSOM.CSSConditionRule = function() {
    CSSOM.CSSGroupingRule.call(this), this.cssRules = [];
  };
  CSSOM.CSSConditionRule.prototype = new CSSOM.CSSGroupingRule;
  CSSOM.CSSConditionRule.prototype.constructor = CSSOM.CSSConditionRule;
  CSSOM.CSSConditionRule.prototype.conditionText = "";
  CSSOM.CSSConditionRule.prototype.cssText = "";
  exports.CSSConditionRule = CSSOM.CSSConditionRule;
});
