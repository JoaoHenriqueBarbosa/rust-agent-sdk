// var: require_promise
var require_promise = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.Deferred = void 0;

  class Deferred {
    _promise;
    _resolve;
    _reject;
    constructor() {
      this._promise = new Promise((resolve26, reject2) => {
        this._resolve = resolve26, this._reject = reject2;
      });
    }
    get promise() {
      return this._promise;
    }
    resolve(val) {
      this._resolve(val);
    }
    reject(err2) {
      this._reject(err2);
    }
  }
  exports.Deferred = Deferred;
});
