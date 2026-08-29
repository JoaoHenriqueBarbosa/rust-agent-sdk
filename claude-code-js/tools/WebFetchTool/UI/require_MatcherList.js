// var: require_MatcherList
var require_MatcherList = __commonJS((exports) => {
  var CSSOM = {};
  CSSOM.MatcherList = function() {
    this.length = 0;
  };
  CSSOM.MatcherList.prototype = {
    constructor: CSSOM.MatcherList,
    get matcherText() {
      return Array.prototype.join.call(this, ", ");
    },
    set matcherText(value) {
      var values3 = value.split(","), length = this.length = values3.length;
      for (var i5 = 0;i5 < length; i5++)
        this[i5] = values3[i5].trim();
    },
    appendMatcher: function(matcher) {
      if (Array.prototype.indexOf.call(this, matcher) === -1)
        this[this.length] = matcher, this.length++;
    },
    deleteMatcher: function(matcher) {
      var index = Array.prototype.indexOf.call(this, matcher);
      if (index !== -1)
        Array.prototype.splice.call(this, index, 1);
    }
  };
  exports.MatcherList = CSSOM.MatcherList;
});
