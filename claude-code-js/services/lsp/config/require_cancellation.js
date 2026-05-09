// var: require_cancellation
var require_cancellation = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.CancellationTokenSource = exports.CancellationToken = void 0;
  var ral_1 = require_ral(), Is = require_is(), events_1 = require_events(), CancellationToken;
  (function(CancellationToken2) {
    CancellationToken2.None = Object.freeze({
      isCancellationRequested: !1,
      onCancellationRequested: events_1.Event.None
    }), CancellationToken2.Cancelled = Object.freeze({
      isCancellationRequested: !0,
      onCancellationRequested: events_1.Event.None
    });
    function is(value) {
      let candidate = value;
      return candidate && (candidate === CancellationToken2.None || candidate === CancellationToken2.Cancelled || Is.boolean(candidate.isCancellationRequested) && !!candidate.onCancellationRequested);
    }
    CancellationToken2.is = is;
  })(CancellationToken || (exports.CancellationToken = CancellationToken = {}));
  var shortcutEvent = Object.freeze(function(callback, context6) {
    let handle = (0, ral_1.default)().timer.setTimeout(callback.bind(context6), 0);
    return { dispose() {
      handle.dispose();
    } };
  });

  class MutableToken {
    constructor() {
      this._isCancelled = !1;
    }
    cancel() {
      if (!this._isCancelled) {
        if (this._isCancelled = !0, this._emitter)
          this._emitter.fire(void 0), this.dispose();
      }
    }
    get isCancellationRequested() {
      return this._isCancelled;
    }
    get onCancellationRequested() {
      if (this._isCancelled)
        return shortcutEvent;
      if (!this._emitter)
        this._emitter = new events_1.Emitter;
      return this._emitter.event;
    }
    dispose() {
      if (this._emitter)
        this._emitter.dispose(), this._emitter = void 0;
    }
  }

  class CancellationTokenSource {
    get token() {
      if (!this._token)
        this._token = new MutableToken;
      return this._token;
    }
    cancel() {
      if (!this._token)
        this._token = CancellationToken.Cancelled;
      else
        this._token.cancel();
    }
    dispose() {
      if (!this._token)
        this._token = CancellationToken.None;
      else if (this._token instanceof MutableToken)
        this._token.dispose();
    }
  }
  exports.CancellationTokenSource = CancellationTokenSource;
});
