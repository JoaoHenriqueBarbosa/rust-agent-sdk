// var: require_semaphore
var require_semaphore = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.Semaphore = void 0;
  var ral_1 = require_ral();

  class Semaphore {
    constructor(capacity = 1) {
      if (capacity <= 0)
        throw Error("Capacity must be greater than 0");
      this._capacity = capacity, this._active = 0, this._waiting = [];
    }
    lock(thunk) {
      return new Promise((resolve28, reject2) => {
        this._waiting.push({ thunk, resolve: resolve28, reject: reject2 }), this.runNext();
      });
    }
    get active() {
      return this._active;
    }
    runNext() {
      if (this._waiting.length === 0 || this._active === this._capacity)
        return;
      (0, ral_1.default)().timer.setImmediate(() => this.doRunNext());
    }
    doRunNext() {
      if (this._waiting.length === 0 || this._active === this._capacity)
        return;
      let next = this._waiting.shift();
      if (this._active++, this._active > this._capacity)
        throw Error("To many thunks active");
      try {
        let result = next.thunk();
        if (result instanceof Promise)
          result.then((value) => {
            this._active--, next.resolve(value), this.runNext();
          }, (err2) => {
            this._active--, next.reject(err2), this.runNext();
          });
        else
          this._active--, next.resolve(result), this.runNext();
      } catch (err2) {
        this._active--, next.reject(err2), this.runNext();
      }
    }
  }
  exports.Semaphore = Semaphore;
});
