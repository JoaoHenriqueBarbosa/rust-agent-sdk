// var: require_bounded_queue_export_promise_handler
var require_bounded_queue_export_promise_handler = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.createBoundedQueueExportPromiseHandler = void 0;

  class BoundedQueueExportPromiseHandler {
    _concurrencyLimit;
    _sendingPromises = [];
    constructor(concurrencyLimit) {
      this._concurrencyLimit = concurrencyLimit;
    }
    pushPromise(promise3) {
      if (this.hasReachedLimit())
        throw Error("Concurrency Limit reached");
      this._sendingPromises.push(promise3);
      let popPromise = () => {
        let index = this._sendingPromises.indexOf(promise3);
        this._sendingPromises.splice(index, 1);
      };
      promise3.then(popPromise, popPromise);
    }
    hasReachedLimit() {
      return this._sendingPromises.length >= this._concurrencyLimit;
    }
    async awaitAll() {
      await Promise.all(this._sendingPromises);
    }
  }
  function createBoundedQueueExportPromiseHandler(options2) {
    return new BoundedQueueExportPromiseHandler(options2.concurrencyLimit);
  }
  exports.createBoundedQueueExportPromiseHandler = createBoundedQueueExportPromiseHandler;
});
