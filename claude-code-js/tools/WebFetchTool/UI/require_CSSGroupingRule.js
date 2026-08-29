// var: require_CSSGroupingRule
var require_CSSGroupingRule = __commonJS((exports) => {
  var CSSOM = {
    CSSRule: require_CSSRule().CSSRule
  };
  CSSOM.CSSGroupingRule = function() {
    CSSOM.CSSRule.call(this), this.cssRules = [];
  };
  CSSOM.CSSGroupingRule.prototype = new CSSOM.CSSRule;
  CSSOM.CSSGroupingRule.prototype.constructor = CSSOM.CSSGroupingRule;
  CSSOM.CSSGroupingRule.prototype.insertRule = function(rule, index) {
    if (index < 0 || index > this.cssRules.length)
      throw RangeError("INDEX_SIZE_ERR");
    var cssRule = CSSOM.parse(rule).cssRules[0];
    return cssRule.parentRule = this, this.cssRules.splice(index, 0, cssRule), index;
  };
  CSSOM.CSSGroupingRule.prototype.deleteRule = function(index) {
    if (index < 0 || index >= this.cssRules.length)
      throw RangeError("INDEX_SIZE_ERR");
    this.cssRules.splice(index, 1)[0].parentRule = null;
  };
  exports.CSSGroupingRule = CSSOM.CSSGroupingRule;
});
