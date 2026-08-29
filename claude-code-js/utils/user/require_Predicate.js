// var: require_Predicate
var require_Predicate = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.ExactPredicate = exports.PatternPredicate = void 0;
  var ESCAPE = /[\^$\\.+?()[\]{}|]/g;

  class PatternPredicate {
    _matchAll;
    _regexp;
    constructor(pattern) {
      if (pattern === "*")
        this._matchAll = !0, this._regexp = /.*/;
      else
        this._matchAll = !1, this._regexp = new RegExp(PatternPredicate.escapePattern(pattern));
    }
    match(str2) {
      if (this._matchAll)
        return !0;
      return this._regexp.test(str2);
    }
    static escapePattern(pattern) {
      return `^${pattern.replace(ESCAPE, "\\$&").replace("*", ".*")}$`;
    }
    static hasWildcard(pattern) {
      return pattern.includes("*");
    }
  }
  exports.PatternPredicate = PatternPredicate;

  class ExactPredicate {
    _matchAll;
    _pattern;
    constructor(pattern) {
      this._matchAll = pattern === void 0, this._pattern = pattern;
    }
    match(str2) {
      if (this._matchAll)
        return !0;
      if (str2 === this._pattern)
        return !0;
      return !1;
    }
  }
  exports.ExactPredicate = ExactPredicate;
});
