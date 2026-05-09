// var: require_CSSValue
var require_CSSValue = __commonJS((exports) => {
  var CSSOM = {};
  CSSOM.CSSValue = function() {};
  CSSOM.CSSValue.prototype = {
    constructor: CSSOM.CSSValue,
    set cssText(text2) {
      var name3 = this._getConstructorName();
      throw Error('DOMException: property "cssText" of "' + name3 + '" is readonly and can not be replaced with "' + text2 + '"!');
    },
    get cssText() {
      var name3 = this._getConstructorName();
      throw Error('getter "cssText" of "' + name3 + '" is not implemented!');
    },
    _getConstructorName: function() {
      var s2 = this.constructor.toString(), c3 = s2.match(/function\s([^\(]+)/), name3 = c3[1];
      return name3;
    }
  };
  exports.CSSValue = CSSOM.CSSValue;
});
