// var: require_CSSMediaRule
var require_CSSMediaRule = __commonJS((exports) => {
  var CSSOM = {
    CSSRule: require_CSSRule().CSSRule,
    CSSGroupingRule: require_CSSGroupingRule().CSSGroupingRule,
    CSSConditionRule: require_CSSConditionRule().CSSConditionRule,
    MediaList: require_MediaList().MediaList
  };
  CSSOM.CSSMediaRule = function() {
    CSSOM.CSSConditionRule.call(this), this.media = new CSSOM.MediaList;
  };
  CSSOM.CSSMediaRule.prototype = new CSSOM.CSSConditionRule;
  CSSOM.CSSMediaRule.prototype.constructor = CSSOM.CSSMediaRule;
  CSSOM.CSSMediaRule.prototype.type = 4;
  Object.defineProperties(CSSOM.CSSMediaRule.prototype, {
    conditionText: {
      get: function() {
        return this.media.mediaText;
      },
      set: function(value) {
        this.media.mediaText = value;
      },
      configurable: !0,
      enumerable: !0
    },
    cssText: {
      get: function() {
        var cssTexts = [];
        for (var i5 = 0, length = this.cssRules.length;i5 < length; i5++)
          cssTexts.push(this.cssRules[i5].cssText);
        return "@media " + this.media.mediaText + " {" + cssTexts.join("") + "}";
      },
      configurable: !0,
      enumerable: !0
    }
  });
  exports.CSSMediaRule = CSSOM.CSSMediaRule;
});
