// var: require_InstrumentSelector
var require_InstrumentSelector = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.InstrumentSelector = void 0;
  var Predicate_1 = require_Predicate();

  class InstrumentSelector {
    _nameFilter;
    _type;
    _unitFilter;
    constructor(criteria) {
      this._nameFilter = new Predicate_1.PatternPredicate(criteria?.name ?? "*"), this._type = criteria?.type, this._unitFilter = new Predicate_1.ExactPredicate(criteria?.unit);
    }
    getType() {
      return this._type;
    }
    getNameFilter() {
      return this._nameFilter;
    }
    getUnitFilter() {
      return this._unitFilter;
    }
  }
  exports.InstrumentSelector = InstrumentSelector;
});
