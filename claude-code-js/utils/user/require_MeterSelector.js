// var: require_MeterSelector
var require_MeterSelector = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.MeterSelector = void 0;
  var Predicate_1 = require_Predicate();

  class MeterSelector {
    _nameFilter;
    _versionFilter;
    _schemaUrlFilter;
    constructor(criteria) {
      this._nameFilter = new Predicate_1.ExactPredicate(criteria?.name), this._versionFilter = new Predicate_1.ExactPredicate(criteria?.version), this._schemaUrlFilter = new Predicate_1.ExactPredicate(criteria?.schemaUrl);
    }
    getNameFilter() {
      return this._nameFilter;
    }
    getVersionFilter() {
      return this._versionFilter;
    }
    getSchemaUrlFilter() {
      return this._schemaUrlFilter;
    }
  }
  exports.MeterSelector = MeterSelector;
});
