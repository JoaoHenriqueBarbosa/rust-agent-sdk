// var: require_Event
var require_Event = __commonJS((exports, module) => {
  module.exports = Event3;
  Event3.CAPTURING_PHASE = 1;
  Event3.AT_TARGET = 2;
  Event3.BUBBLING_PHASE = 3;
  function Event3(type, dictionary) {
    if (this.type = "", this.target = null, this.currentTarget = null, this.eventPhase = Event3.AT_TARGET, this.bubbles = !1, this.cancelable = !1, this.isTrusted = !1, this.defaultPrevented = !1, this.timeStamp = Date.now(), this._propagationStopped = !1, this._immediatePropagationStopped = !1, this._initialized = !0, this._dispatching = !1, type)
      this.type = type;
    if (dictionary)
      for (var p4 in dictionary)
        this[p4] = dictionary[p4];
  }
  Event3.prototype = Object.create(Object.prototype, {
    constructor: { value: Event3 },
    stopPropagation: { value: function() {
      this._propagationStopped = !0;
    } },
    stopImmediatePropagation: { value: function() {
      this._propagationStopped = !0, this._immediatePropagationStopped = !0;
    } },
    preventDefault: { value: function() {
      if (this.cancelable)
        this.defaultPrevented = !0;
    } },
    initEvent: { value: function(type, bubbles, cancelable) {
      if (this._initialized = !0, this._dispatching)
        return;
      this._propagationStopped = !1, this._immediatePropagationStopped = !1, this.defaultPrevented = !1, this.isTrusted = !1, this.target = null, this.type = type, this.bubbles = bubbles, this.cancelable = cancelable;
    } }
  });
});
