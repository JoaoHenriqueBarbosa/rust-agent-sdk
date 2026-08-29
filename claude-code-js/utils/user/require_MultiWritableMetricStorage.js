// var: require_MultiWritableMetricStorage
var require_MultiWritableMetricStorage = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.MultiMetricStorage = void 0;

  class MultiMetricStorage {
    _backingStorages;
    constructor(backingStorages) {
      this._backingStorages = backingStorages;
    }
    record(value, attributes, context4, recordTime) {
      this._backingStorages.forEach((it) => {
        it.record(value, attributes, context4, recordTime);
      });
    }
  }
  exports.MultiMetricStorage = MultiMetricStorage;
});
