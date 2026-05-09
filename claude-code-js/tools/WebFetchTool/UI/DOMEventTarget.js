// class: DOMEventTarget
class DOMEventTarget {
  constructor() {
    wm.set(this, /* @__PURE__ */ new Map);
  }
  _getParent() {
    return null;
  }
  addEventListener(type, listener2, options2) {
    let map8 = wm.get(this);
    if (!map8.has(type))
      map8.set(type, /* @__PURE__ */ new Map);
    map8.get(type).set(listener2, options2);
  }
  removeEventListener(type, listener2) {
    let map8 = wm.get(this);
    if (map8.has(type)) {
      let listeners = map8.get(type);
      if (listeners.delete(listener2) && !listeners.size)
        map8.delete(type);
    }
  }
  dispatchEvent(event) {
    let node2 = this;
    event.eventPhase = event.CAPTURING_PHASE;
    while (node2) {
      if (node2.dispatchEvent)
        event._path.push({ currentTarget: node2, target: this });
      node2 = event.bubbles && node2._getParent && node2._getParent();
    }
    return event._path.some(invokeListeners, event), event._path = [], event.eventPhase = event.NONE, !event.defaultPrevented;
  }
}
