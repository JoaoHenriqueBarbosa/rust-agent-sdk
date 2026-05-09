// var: require_callback
var require_callback = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.BindOnceFuture = void 0;
  var promise_1 = require_promise();

  class BindOnceFuture {
    _isCalled = !1;
    _deferred = new promise_1.Deferred;
    _callback;
    _that;
    constructor(callback, that) {
      this._callback = callback, this._that = that;
    }
    get isCalled() {
      return this._isCalled;
    }
    get promise() {
      return this._deferred.promise;
    }
    call(...args) {
      if (!this._isCalled) {
        this._isCalled = !0;
        try {
          Promise.resolve(this._callback.call(this._that, ...args)).then((val) => this._deferred.resolve(val), (err2) => this._deferred.reject(err2));
        } catch (err2) {
          this._deferred.reject(err2);
        }
      }
      return this._deferred.promise;
    }
  }
  exports.BindOnceFuture = BindOnceFuture;
});
