// var: require_EventTarget
var require_EventTarget = __commonJS((exports, module) => {
  var Event3 = require_Event(), MouseEvent = require_MouseEvent(), utils = require_utils12();
  module.exports = EventTarget2;
  function EventTarget2() {}
  EventTarget2.prototype = {
    addEventListener: function(type, listener2, capture) {
      if (!listener2)
        return;
      if (capture === void 0)
        capture = !1;
      if (!this._listeners)
        this._listeners = Object.create(null);
      if (!this._listeners[type])
        this._listeners[type] = [];
      var list2 = this._listeners[type];
      for (var i5 = 0, n5 = list2.length;i5 < n5; i5++) {
        var l3 = list2[i5];
        if (l3.listener === listener2 && l3.capture === capture)
          return;
      }
      var obj = { listener: listener2, capture };
      if (typeof listener2 === "function")
        obj.f = listener2;
      list2.push(obj);
    },
    removeEventListener: function(type, listener2, capture) {
      if (capture === void 0)
        capture = !1;
      if (this._listeners) {
        var list2 = this._listeners[type];
        if (list2)
          for (var i5 = 0, n5 = list2.length;i5 < n5; i5++) {
            var l3 = list2[i5];
            if (l3.listener === listener2 && l3.capture === capture) {
              if (list2.length === 1)
                this._listeners[type] = void 0;
              else
                list2.splice(i5, 1);
              return;
            }
          }
      }
    },
    dispatchEvent: function(event) {
      return this._dispatchEvent(event, !1);
    },
    _dispatchEvent: function(event, trusted) {
      if (typeof trusted !== "boolean")
        trusted = !1;
      function invoke2(target, event2) {
        var { type, eventPhase: phase } = event2;
        if (event2.currentTarget = target, phase !== Event3.CAPTURING_PHASE && target._handlers && target._handlers[type]) {
          var handler4 = target._handlers[type], rv;
          if (typeof handler4 === "function")
            rv = handler4.call(event2.currentTarget, event2);
          else {
            var f = handler4.handleEvent;
            if (typeof f !== "function")
              throw TypeError("handleEvent property of event handler object isnot a function.");
            rv = f.call(handler4, event2);
          }
          switch (event2.type) {
            case "mouseover":
              if (rv === !0)
                event2.preventDefault();
              break;
            case "beforeunload":
            default:
              if (rv === !1)
                event2.preventDefault();
              break;
          }
        }
        var list2 = target._listeners && target._listeners[type];
        if (!list2)
          return;
        list2 = list2.slice();
        for (var i6 = 0, n6 = list2.length;i6 < n6; i6++) {
          if (event2._immediatePropagationStopped)
            return;
          var l3 = list2[i6];
          if (phase === Event3.CAPTURING_PHASE && !l3.capture || phase === Event3.BUBBLING_PHASE && l3.capture)
            continue;
          if (l3.f)
            l3.f.call(event2.currentTarget, event2);
          else {
            var fn = l3.listener.handleEvent;
            if (typeof fn !== "function")
              throw TypeError("handleEvent property of event listener object is not a function.");
            fn.call(l3.listener, event2);
          }
        }
      }
      if (!event._initialized || event._dispatching)
        utils.InvalidStateError();
      event.isTrusted = trusted, event._dispatching = !0, event.target = this;
      var ancestors = [];
      for (var n5 = this.parentNode;n5; n5 = n5.parentNode)
        ancestors.push(n5);
      event.eventPhase = Event3.CAPTURING_PHASE;
      for (var i5 = ancestors.length - 1;i5 >= 0; i5--)
        if (invoke2(ancestors[i5], event), event._propagationStopped)
          break;
      if (!event._propagationStopped)
        event.eventPhase = Event3.AT_TARGET, invoke2(this, event);
      if (event.bubbles && !event._propagationStopped) {
        event.eventPhase = Event3.BUBBLING_PHASE;
        for (var ii = 0, nn = ancestors.length;ii < nn; ii++)
          if (invoke2(ancestors[ii], event), event._propagationStopped)
            break;
      }
      if (event._dispatching = !1, event.eventPhase = Event3.AT_TARGET, event.currentTarget = null, trusted && !event.defaultPrevented && event instanceof MouseEvent)
        switch (event.type) {
          case "mousedown":
            this._armed = {
              x: event.clientX,
              y: event.clientY,
              t: event.timeStamp
            };
            break;
          case "mouseout":
          case "mouseover":
            this._armed = null;
            break;
          case "mouseup":
            if (this._isClick(event))
              this._doClick(event);
            this._armed = null;
            break;
        }
      return !event.defaultPrevented;
    },
    _isClick: function(event) {
      return this._armed !== null && event.type === "mouseup" && event.isTrusted && event.button === 0 && event.timeStamp - this._armed.t < 1000 && Math.abs(event.clientX - this._armed.x) < 10 && Math.abs(event.clientY - this._armed.Y) < 10;
    },
    _doClick: function(event) {
      if (this._click_in_progress)
        return;
      this._click_in_progress = !0;
      var activated = this;
      while (activated && !activated._post_click_activation_steps)
        activated = activated.parentNode;
      if (activated && activated._pre_click_activation_steps)
        activated._pre_click_activation_steps();
      var click = this.ownerDocument.createEvent("MouseEvent");
      click.initMouseEvent("click", !0, !0, this.ownerDocument.defaultView, 1, event.screenX, event.screenY, event.clientX, event.clientY, event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, event.button, null);
      var result = this._dispatchEvent(click, !0);
      if (activated) {
        if (result) {
          if (activated._post_click_activation_steps)
            activated._post_click_activation_steps(click);
        } else if (activated._cancelled_activation_steps)
          activated._cancelled_activation_steps();
      }
    },
    _setEventHandler: function(type, handler4) {
      if (!this._handlers)
        this._handlers = Object.create(null);
      this._handlers[type] = handler4;
    },
    _getEventHandler: function(type) {
      return this._handlers && this._handlers[type] || null;
    }
  };
});
