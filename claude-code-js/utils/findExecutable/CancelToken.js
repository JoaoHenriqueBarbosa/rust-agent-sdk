// class: CancelToken
class CancelToken {
  constructor(executor) {
    if (typeof executor !== "function")
      throw TypeError("executor must be a function.");
    let resolvePromise;
    this.promise = new Promise(function(resolve7) {
      resolvePromise = resolve7;
    });
    let token = this;
    this.promise.then((cancel) => {
      if (!token._listeners)
        return;
      let i2 = token._listeners.length;
      while (i2-- > 0)
        token._listeners[i2](cancel);
      token._listeners = null;
    }), this.promise.then = (onfulfilled) => {
      let _resolve, promise2 = new Promise((resolve7) => {
        token.subscribe(resolve7), _resolve = resolve7;
      }).then(onfulfilled);
      return promise2.cancel = function() {
        token.unsubscribe(_resolve);
      }, promise2;
    }, executor(function(message, config2, request) {
      if (token.reason)
        return;
      token.reason = new CanceledError_default(message, config2, request), resolvePromise(token.reason);
    });
  }
  throwIfRequested() {
    if (this.reason)
      throw this.reason;
  }
  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    if (this._listeners)
      this._listeners.push(listener);
    else
      this._listeners = [listener];
  }
  unsubscribe(listener) {
    if (!this._listeners)
      return;
    let index = this._listeners.indexOf(listener);
    if (index !== -1)
      this._listeners.splice(index, 1);
  }
  toAbortSignal() {
    let controller = new AbortController, abort = (err) => {
      controller.abort(err);
    };
    return this.subscribe(abort), controller.signal.unsubscribe = () => this.unsubscribe(abort), controller.signal;
  }
  static source() {
    let cancel;
    return {
      token: new CancelToken(function(c3) {
        cancel = c3;
      }),
      cancel
    };
  }
}
