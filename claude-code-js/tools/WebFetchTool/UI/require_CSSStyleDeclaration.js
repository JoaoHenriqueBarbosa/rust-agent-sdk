// var: require_CSSStyleDeclaration
var require_CSSStyleDeclaration = __commonJS((exports) => {
  var CSSOM = {};
  CSSOM.CSSStyleDeclaration = function() {
    this.length = 0, this.parentRule = null, this._importants = {};
  };
  CSSOM.CSSStyleDeclaration.prototype = {
    constructor: CSSOM.CSSStyleDeclaration,
    getPropertyValue: function(name3) {
      return this[name3] || "";
    },
    setProperty: function(name3, value, priority) {
      if (this[name3]) {
        var index = Array.prototype.indexOf.call(this, name3);
        if (index < 0)
          this[this.length] = name3, this.length++;
      } else
        this[this.length] = name3, this.length++;
      this[name3] = value + "", this._importants[name3] = priority;
    },
    removeProperty: function(name3) {
      if (!(name3 in this))
        return "";
      var index = Array.prototype.indexOf.call(this, name3);
      if (index < 0)
        return "";
      var prevValue = this[name3];
      return this[name3] = "", Array.prototype.splice.call(this, index, 1), prevValue;
    },
    getPropertyCSSValue: function() {},
    getPropertyPriority: function(name3) {
      return this._importants[name3] || "";
    },
    getPropertyShorthand: function() {},
    isPropertyImplicit: function() {},
    get cssText() {
      var properties = [];
      for (var i5 = 0, length = this.length;i5 < length; ++i5) {
        var name3 = this[i5], value = this.getPropertyValue(name3), priority = this.getPropertyPriority(name3);
        if (priority)
          priority = " !" + priority;
        properties[i5] = name3 + ": " + value + priority + ";";
      }
      return properties.join(" ");
    },
    set cssText(text2) {
      var i5, name3;
      for (i5 = this.length;i5--; )
        name3 = this[i5], this[name3] = "";
      Array.prototype.splice.call(this, 0, this.length), this._importants = {};
      var dummyRule = CSSOM.parse("#bogus{" + text2 + "}").cssRules[0].style, length = dummyRule.length;
      for (i5 = 0;i5 < length; ++i5)
        name3 = dummyRule[i5], this.setProperty(dummyRule[i5], dummyRule.getPropertyValue(name3), dummyRule.getPropertyPriority(name3));
    }
  };
  exports.CSSStyleDeclaration = CSSOM.CSSStyleDeclaration;
  CSSOM.parse = require_parse8().parse;
});
