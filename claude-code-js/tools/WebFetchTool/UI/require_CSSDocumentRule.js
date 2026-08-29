// var: require_CSSDocumentRule
var require_CSSDocumentRule = __commonJS((exports) => {
  var CSSOM = {
    CSSRule: require_CSSRule().CSSRule,
    MatcherList: require_MatcherList().MatcherList
  };
  CSSOM.CSSDocumentRule = function() {
    CSSOM.CSSRule.call(this), this.matcher = new CSSOM.MatcherList, this.cssRules = [];
  };
  CSSOM.CSSDocumentRule.prototype = new CSSOM.CSSRule;
  CSSOM.CSSDocumentRule.prototype.constructor = CSSOM.CSSDocumentRule;
  CSSOM.CSSDocumentRule.prototype.type = 10;
  Object.defineProperty(CSSOM.CSSDocumentRule.prototype, "cssText", {
    get: function() {
      var cssTexts = [];
      for (var i5 = 0, length = this.cssRules.length;i5 < length; i5++)
        cssTexts.push(this.cssRules[i5].cssText);
      return "@-moz-document " + this.matcher.matcherText + " {" + cssTexts.join("") + "}";
    }
  });
  exports.CSSDocumentRule = CSSOM.CSSDocumentRule;
});
