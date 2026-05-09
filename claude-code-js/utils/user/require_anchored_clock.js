// var: require_anchored_clock
var require_anchored_clock = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.AnchoredClock = void 0;

  class AnchoredClock {
    _monotonicClock;
    _epochMillis;
    _performanceMillis;
    constructor(systemClock, monotonicClock) {
      this._monotonicClock = monotonicClock, this._epochMillis = systemClock.now(), this._performanceMillis = monotonicClock.now();
    }
    now() {
      let delta = this._monotonicClock.now() - this._performanceMillis;
      return this._epochMillis + delta;
    }
  }
  exports.AnchoredClock = AnchoredClock;
});
