// Original: src/ink/events/terminal-event.ts
var TerminalEvent;
var init_terminal_event = __esm(() => {
  TerminalEvent = class TerminalEvent extends Event2 {
    type;
    timeStamp;
    bubbles;
    cancelable;
    _target = null;
    _currentTarget = null;
    _eventPhase = "none";
    _propagationStopped = !1;
    _defaultPrevented = !1;
    constructor(type, init) {
      super();
      this.type = type, this.timeStamp = performance.now(), this.bubbles = init?.bubbles ?? !0, this.cancelable = init?.cancelable ?? !0;
    }
    get target() {
      return this._target;
    }
    get currentTarget() {
      return this._currentTarget;
    }
    get eventPhase() {
      return this._eventPhase;
    }
    get defaultPrevented() {
      return this._defaultPrevented;
    }
    stopPropagation() {
      this._propagationStopped = !0;
    }
    stopImmediatePropagation() {
      super.stopImmediatePropagation(), this._propagationStopped = !0;
    }
    preventDefault() {
      if (this.cancelable)
        this._defaultPrevented = !0;
    }
    _setTarget(target) {
      this._target = target;
    }
    _setCurrentTarget(target) {
      this._currentTarget = target;
    }
    _setEventPhase(phase) {
      this._eventPhase = phase;
    }
    _isPropagationStopped() {
      return this._propagationStopped;
    }
    _isImmediatePropagationStopped() {
      return this.didStopImmediatePropagation();
    }
    _prepareForTarget(_target) {}
  };
});
