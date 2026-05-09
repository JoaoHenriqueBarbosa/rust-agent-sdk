// var: require_ObservableResult
var require_ObservableResult = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.BatchObservableResultImpl = exports.ObservableResultImpl = void 0;
  var api_1 = require_src7(), HashMap_1 = require_HashMap(), Instruments_1 = require_Instruments();

  class ObservableResultImpl {
    _buffer = new HashMap_1.AttributeHashMap;
    _instrumentName;
    _valueType;
    constructor(instrumentName, valueType) {
      this._instrumentName = instrumentName, this._valueType = valueType;
    }
    observe(value, attributes = {}) {
      if (typeof value !== "number") {
        api_1.diag.warn(`non-number value provided to metric ${this._instrumentName}: ${value}`);
        return;
      }
      if (this._valueType === api_1.ValueType.INT && !Number.isInteger(value)) {
        if (api_1.diag.warn(`INT value type cannot accept a floating-point value for ${this._instrumentName}, ignoring the fractional digits.`), value = Math.trunc(value), !Number.isInteger(value))
          return;
      }
      this._buffer.set(attributes, value);
    }
  }
  exports.ObservableResultImpl = ObservableResultImpl;

  class BatchObservableResultImpl {
    _buffer = /* @__PURE__ */ new Map;
    observe(metric, value, attributes = {}) {
      if (!(0, Instruments_1.isObservableInstrument)(metric))
        return;
      let map8 = this._buffer.get(metric);
      if (map8 == null)
        map8 = new HashMap_1.AttributeHashMap, this._buffer.set(metric, map8);
      if (typeof value !== "number") {
        api_1.diag.warn(`non-number value provided to metric ${metric._descriptor.name}: ${value}`);
        return;
      }
      if (metric._descriptor.valueType === api_1.ValueType.INT && !Number.isInteger(value)) {
        if (api_1.diag.warn(`INT value type cannot accept a floating-point value for ${metric._descriptor.name}, ignoring the fractional digits.`), value = Math.trunc(value), !Number.isInteger(value))
          return;
      }
      map8.set(attributes, value);
    }
  }
  exports.BatchObservableResultImpl = BatchObservableResultImpl;
});
