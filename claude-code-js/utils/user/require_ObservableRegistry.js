// var: require_ObservableRegistry
var require_ObservableRegistry = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.ObservableRegistry = void 0;
  var api_1 = require_src7(), Instruments_1 = require_Instruments(), ObservableResult_1 = require_ObservableResult(), utils_1 = require_utils11();

  class ObservableRegistry {
    _callbacks = [];
    _batchCallbacks = [];
    addCallback(callback, instrument) {
      if (this._findCallback(callback, instrument) >= 0)
        return;
      this._callbacks.push({ callback, instrument });
    }
    removeCallback(callback, instrument) {
      let idx = this._findCallback(callback, instrument);
      if (idx < 0)
        return;
      this._callbacks.splice(idx, 1);
    }
    addBatchCallback(callback, instruments) {
      let observableInstruments = new Set(instruments.filter(Instruments_1.isObservableInstrument));
      if (observableInstruments.size === 0) {
        api_1.diag.error("BatchObservableCallback is not associated with valid instruments", instruments);
        return;
      }
      if (this._findBatchCallback(callback, observableInstruments) >= 0)
        return;
      this._batchCallbacks.push({ callback, instruments: observableInstruments });
    }
    removeBatchCallback(callback, instruments) {
      let observableInstruments = new Set(instruments.filter(Instruments_1.isObservableInstrument)), idx = this._findBatchCallback(callback, observableInstruments);
      if (idx < 0)
        return;
      this._batchCallbacks.splice(idx, 1);
    }
    async observe(collectionTime, timeoutMillis) {
      let callbackFutures = this._observeCallbacks(collectionTime, timeoutMillis), batchCallbackFutures = this._observeBatchCallbacks(collectionTime, timeoutMillis);
      return (await Promise.allSettled([
        ...callbackFutures,
        ...batchCallbackFutures
      ])).filter((result) => result.status === "rejected").map((result) => result.reason);
    }
    _observeCallbacks(observationTime, timeoutMillis) {
      return this._callbacks.map(async ({ callback, instrument }) => {
        let observableResult = new ObservableResult_1.ObservableResultImpl(instrument._descriptor.name, instrument._descriptor.valueType), callPromise = Promise.resolve(callback(observableResult));
        if (timeoutMillis != null)
          callPromise = (0, utils_1.callWithTimeout)(callPromise, timeoutMillis);
        await callPromise, instrument._metricStorages.forEach((metricStorage) => {
          metricStorage.record(observableResult._buffer, observationTime);
        });
      });
    }
    _observeBatchCallbacks(observationTime, timeoutMillis) {
      return this._batchCallbacks.map(async ({ callback, instruments }) => {
        let observableResult = new ObservableResult_1.BatchObservableResultImpl, callPromise = Promise.resolve(callback(observableResult));
        if (timeoutMillis != null)
          callPromise = (0, utils_1.callWithTimeout)(callPromise, timeoutMillis);
        await callPromise, instruments.forEach((instrument) => {
          let buffer = observableResult._buffer.get(instrument);
          if (buffer == null)
            return;
          instrument._metricStorages.forEach((metricStorage) => {
            metricStorage.record(buffer, observationTime);
          });
        });
      });
    }
    _findCallback(callback, instrument) {
      return this._callbacks.findIndex((record3) => {
        return record3.callback === callback && record3.instrument === instrument;
      });
    }
    _findBatchCallback(callback, instruments) {
      return this._batchCallbacks.findIndex((record3) => {
        return record3.callback === callback && (0, utils_1.setEquals)(record3.instruments, instruments);
      });
    }
  }
  exports.ObservableRegistry = ObservableRegistry;
});
