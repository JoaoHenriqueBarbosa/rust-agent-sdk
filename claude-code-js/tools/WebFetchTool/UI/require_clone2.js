// var: require_clone2
var require_clone2 = __commonJS((exports) => {
  var CSSOM = {
    CSSStyleSheet: require_CSSStyleSheet().CSSStyleSheet,
    CSSRule: require_CSSRule().CSSRule,
    CSSStyleRule: require_CSSStyleRule().CSSStyleRule,
    CSSGroupingRule: require_CSSGroupingRule().CSSGroupingRule,
    CSSConditionRule: require_CSSConditionRule().CSSConditionRule,
    CSSMediaRule: require_CSSMediaRule().CSSMediaRule,
    CSSSupportsRule: require_CSSSupportsRule().CSSSupportsRule,
    CSSStyleDeclaration: require_CSSStyleDeclaration().CSSStyleDeclaration,
    CSSKeyframeRule: require_CSSKeyframeRule().CSSKeyframeRule,
    CSSKeyframesRule: require_CSSKeyframesRule().CSSKeyframesRule
  };
  CSSOM.clone = function clone(stylesheet) {
    var cloned = new CSSOM.CSSStyleSheet, rules = stylesheet.cssRules;
    if (!rules)
      return cloned;
    for (var i5 = 0, rulesLength = rules.length;i5 < rulesLength; i5++) {
      var rule = rules[i5], ruleClone = cloned.cssRules[i5] = new rule.constructor, style = rule.style;
      if (style) {
        var styleClone = ruleClone.style = new CSSOM.CSSStyleDeclaration;
        for (var j4 = 0, styleLength = style.length;j4 < styleLength; j4++) {
          var name3 = styleClone[j4] = style[j4];
          styleClone[name3] = style[name3], styleClone._importants[name3] = style.getPropertyPriority(name3);
        }
        styleClone.length = style.length;
      }
      if (rule.hasOwnProperty("keyText"))
        ruleClone.keyText = rule.keyText;
      if (rule.hasOwnProperty("selectorText"))
        ruleClone.selectorText = rule.selectorText;
      if (rule.hasOwnProperty("mediaText"))
        ruleClone.mediaText = rule.mediaText;
      if (rule.hasOwnProperty("conditionText"))
        ruleClone.conditionText = rule.conditionText;
      if (rule.hasOwnProperty("cssRules"))
        ruleClone.cssRules = clone(rule).cssRules;
    }
    return cloned;
  };
  exports.clone = CSSOM.clone;
});
