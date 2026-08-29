// var: require_MetricStorage
var require_MetricStorage = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.MetricStorage = void 0;
  var InstrumentDescriptor_1 = require_InstrumentDescriptor();

  class MetricStorage {
    _instrumentDescriptor;
    constructor(instrumentDescriptor) {
      this._instrumentDescriptor = instrumentDescriptor;
    }
    getInstrumentDescriptor() {
      return this._instrumentDescriptor;
    }
    updateDescription(description) {
      this._instrumentDescriptor = (0, InstrumentDescriptor_1.createInstrumentDescriptor)(this._instrumentDescriptor.name, this._instrumentDescriptor.type, {
        description,
        valueType: this._instrumentDescriptor.valueType,
        unit: this._instrumentDescriptor.unit,
        advice: this._instrumentDescriptor.advice
      });
    }
  }
  exports.MetricStorage = MetricStorage;
});
