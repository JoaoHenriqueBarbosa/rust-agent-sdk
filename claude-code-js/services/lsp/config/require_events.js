// var: require_events
var require_events = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.Emitter = exports.Event = void 0;
  var ral_1 = require_ral(), Event3;
  (function(Event4) {
    let _disposable = { dispose() {} };
    Event4.None = function() {
      return _disposable;
    };
  })(Event3 || (exports.Event = Event3 = {}));

  class CallbackList {
    add(callback, context6 = null, bucket) {
      if (!this._callbacks)
        this._callbacks = [], this._contexts = [];
      if (this._callbacks.push(callback), this._contexts.push(context6), Array.isArray(bucket))
        bucket.push({ dispose: () => this.remove(callback, context6) });
    }
    remove(callback, context6 = null) {
      if (!this._callbacks)
        return;
      let foundCallbackWithDifferentContext = !1;
      for (let i5 = 0, len = this._callbacks.length;i5 < len; i5++)
        if (this._callbacks[i5] === callback)
          if (this._contexts[i5] === context6) {
            this._callbacks.splice(i5, 1), this._contexts.splice(i5, 1);
            return;
          } else
            foundCallbackWithDifferentContext = !0;
      if (foundCallbackWithDifferentContext)
        throw Error("When adding a listener with a context, you should remove it with the same context");
    }
    invoke(...args) {
      if (!this._callbacks)
        return [];
      let ret = [], callbacks = this._callbacks.slice(0), contexts = this._contexts.slice(0);
      for (let i5 = 0, len = callbacks.length;i5 < len; i5++)
        try {
          ret.push(callbacks[i5].apply(contexts[i5], args));
        } catch (e) {
          (0, ral_1.default)().console.error(e);
        }
      return ret;
    }
    isEmpty() {
      return !this._callbacks || this._callbacks.length === 0;
    }
    dispose() {
      this._callbacks = void 0, this._contexts = void 0;
    }
  }

  class Emitter2 {
    constructor(_options) {
      this._options = _options;
    }
    get event() {
      if (!this._event)
        this._event = (listener2, thisArgs, disposables) => {
          if (!this._callbacks)
            this._callbacks = new CallbackList;
          if (this._options && this._options.onFirstListenerAdd && this._callbacks.isEmpty())
            this._options.onFirstListenerAdd(this);
          this._callbacks.add(listener2, thisArgs);
          let result = {
            dispose: () => {
              if (!this._callbacks)
                return;
              if (this._callbacks.remove(listener2, thisArgs), result.dispose = Emitter2._noop, this._options && this._options.onLastListenerRemove && this._callbacks.isEmpty())
                this._options.onLastListenerRemove(this);
            }
          };
          if (Array.isArray(disposables))
            disposables.push(result);
          return result;
        };
      return this._event;
    }
    fire(event) {
      if (this._callbacks)
        this._callbacks.invoke.call(this._callbacks, event);
    }
    dispose() {
      if (this._callbacks)
        this._callbacks.dispose(), this._callbacks = void 0;
    }
  }
  exports.Emitter = Emitter2;
  Emitter2._noop = function() {};
});
