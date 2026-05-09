// var: require_Meter
var require_Meter = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.Meter = void 0;
  var InstrumentDescriptor_1 = require_InstrumentDescriptor(), Instruments_1 = require_Instruments(), MetricData_1 = require_MetricData();

  class Meter {
    _meterSharedState;
    constructor(meterSharedState) {
      this._meterSharedState = meterSharedState;
    }
    createGauge(name3, options2) {
      let descriptor = (0, InstrumentDescriptor_1.createInstrumentDescriptor)(name3, MetricData_1.InstrumentType.GAUGE, options2), storage = this._meterSharedState.registerMetricStorage(descriptor);
      return new Instruments_1.GaugeInstrument(storage, descriptor);
    }
    createHistogram(name3, options2) {
      let descriptor = (0, InstrumentDescriptor_1.createInstrumentDescriptor)(name3, MetricData_1.InstrumentType.HISTOGRAM, options2), storage = this._meterSharedState.registerMetricStorage(descriptor);
      return new Instruments_1.HistogramInstrument(storage, descriptor);
    }
    createCounter(name3, options2) {
      let descriptor = (0, InstrumentDescriptor_1.createInstrumentDescriptor)(name3, MetricData_1.InstrumentType.COUNTER, options2), storage = this._meterSharedState.registerMetricStorage(descriptor);
      return new Instruments_1.CounterInstrument(storage, descriptor);
    }
    createUpDownCounter(name3, options2) {
      let descriptor = (0, InstrumentDescriptor_1.createInstrumentDescriptor)(name3, MetricData_1.InstrumentType.UP_DOWN_COUNTER, options2), storage = this._meterSharedState.registerMetricStorage(descriptor);
      return new Instruments_1.UpDownCounterInstrument(storage, descriptor);
    }
    createObservableGauge(name3, options2) {
      let descriptor = (0, InstrumentDescriptor_1.createInstrumentDescriptor)(name3, MetricData_1.InstrumentType.OBSERVABLE_GAUGE, options2), storages = this._meterSharedState.registerAsyncMetricStorage(descriptor);
      return new Instruments_1.ObservableGaugeInstrument(descriptor, storages, this._meterSharedState.observableRegistry);
    }
    createObservableCounter(name3, options2) {
      let descriptor = (0, InstrumentDescriptor_1.createInstrumentDescriptor)(name3, MetricData_1.InstrumentType.OBSERVABLE_COUNTER, options2), storages = this._meterSharedState.registerAsyncMetricStorage(descriptor);
      return new Instruments_1.ObservableCounterInstrument(descriptor, storages, this._meterSharedState.observableRegistry);
    }
    createObservableUpDownCounter(name3, options2) {
      let descriptor = (0, InstrumentDescriptor_1.createInstrumentDescriptor)(name3, MetricData_1.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER, options2), storages = this._meterSharedState.registerAsyncMetricStorage(descriptor);
      return new Instruments_1.ObservableUpDownCounterInstrument(descriptor, storages, this._meterSharedState.observableRegistry);
    }
    addBatchObservableCallback(callback, observables) {
      this._meterSharedState.observableRegistry.addBatchCallback(callback, observables);
    }
    removeBatchObservableCallback(callback, observables) {
      this._meterSharedState.observableRegistry.removeBatchCallback(callback, observables);
    }
  }
  exports.Meter = Meter;
});
