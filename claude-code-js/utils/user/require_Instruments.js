// var: require_Instruments
var require_Instruments = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.isObservableInstrument = exports.ObservableUpDownCounterInstrument = exports.ObservableGaugeInstrument = exports.ObservableCounterInstrument = exports.ObservableInstrument = exports.HistogramInstrument = exports.GaugeInstrument = exports.CounterInstrument = exports.UpDownCounterInstrument = exports.SyncInstrument = void 0;
  var api_1 = require_src7(), core_1 = require_src9();

  class SyncInstrument {
    _writableMetricStorage;
    _descriptor;
    constructor(writableMetricStorage, descriptor) {
      this._writableMetricStorage = writableMetricStorage, this._descriptor = descriptor;
    }
    _record(value, attributes = {}, context4 = api_1.context.active()) {
      if (typeof value !== "number") {
        api_1.diag.warn(`non-number value provided to metric ${this._descriptor.name}: ${value}`);
        return;
      }
      if (this._descriptor.valueType === api_1.ValueType.INT && !Number.isInteger(value)) {
        if (api_1.diag.warn(`INT value type cannot accept a floating-point value for ${this._descriptor.name}, ignoring the fractional digits.`), value = Math.trunc(value), !Number.isInteger(value))
          return;
      }
      this._writableMetricStorage.record(value, attributes, context4, (0, core_1.millisToHrTime)(Date.now()));
    }
  }
  exports.SyncInstrument = SyncInstrument;

  class UpDownCounterInstrument extends SyncInstrument {
    add(value, attributes, ctx) {
      this._record(value, attributes, ctx);
    }
  }
  exports.UpDownCounterInstrument = UpDownCounterInstrument;

  class CounterInstrument extends SyncInstrument {
    add(value, attributes, ctx) {
      if (value < 0) {
        api_1.diag.warn(`negative value provided to counter ${this._descriptor.name}: ${value}`);
        return;
      }
      this._record(value, attributes, ctx);
    }
  }
  exports.CounterInstrument = CounterInstrument;

  class GaugeInstrument extends SyncInstrument {
    record(value, attributes, ctx) {
      this._record(value, attributes, ctx);
    }
  }
  exports.GaugeInstrument = GaugeInstrument;

  class HistogramInstrument extends SyncInstrument {
    record(value, attributes, ctx) {
      if (value < 0) {
        api_1.diag.warn(`negative value provided to histogram ${this._descriptor.name}: ${value}`);
        return;
      }
      this._record(value, attributes, ctx);
    }
  }
  exports.HistogramInstrument = HistogramInstrument;

  class ObservableInstrument {
    _metricStorages;
    _descriptor;
    _observableRegistry;
    constructor(descriptor, metricStorages, observableRegistry) {
      this._descriptor = descriptor, this._metricStorages = metricStorages, this._observableRegistry = observableRegistry;
    }
    addCallback(callback) {
      this._observableRegistry.addCallback(callback, this);
    }
    removeCallback(callback) {
      this._observableRegistry.removeCallback(callback, this);
    }
  }
  exports.ObservableInstrument = ObservableInstrument;

  class ObservableCounterInstrument extends ObservableInstrument {
  }
  exports.ObservableCounterInstrument = ObservableCounterInstrument;

  class ObservableGaugeInstrument extends ObservableInstrument {
  }
  exports.ObservableGaugeInstrument = ObservableGaugeInstrument;

  class ObservableUpDownCounterInstrument extends ObservableInstrument {
  }
  exports.ObservableUpDownCounterInstrument = ObservableUpDownCounterInstrument;
  function isObservableInstrument(it) {
    return it instanceof ObservableInstrument;
  }
  exports.isObservableInstrument = isObservableInstrument;
});
