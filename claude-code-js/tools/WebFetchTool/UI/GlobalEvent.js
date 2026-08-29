// class: GlobalEvent
class GlobalEvent {
  static get BUBBLING_PHASE() {
    return 3;
  }
  static get AT_TARGET() {
    return 2;
  }
  static get CAPTURING_PHASE() {
    return 1;
  }
  static get NONE() {
    return 0;
  }
  constructor(type, eventInitDict = {}) {
    this.type = type, this.bubbles = !!eventInitDict.bubbles, this.cancelBubble = !1, this._stopImmediatePropagationFlag = !1, this.cancelable = !!eventInitDict.cancelable, this.eventPhase = this.NONE, this.timeStamp = Date.now(), this.defaultPrevented = !1, this.originalTarget = null, this.returnValue = null, this.srcElement = null, this.target = null, this._path = [];
  }
  get BUBBLING_PHASE() {
    return 3;
  }
  get AT_TARGET() {
    return 2;
  }
  get CAPTURING_PHASE() {
    return 1;
  }
  get NONE() {
    return 0;
  }
  preventDefault() {
    this.defaultPrevented = !0;
  }
  composedPath() {
    return this._path.map(getCurrentTarget);
  }
  stopPropagation() {
    this.cancelBubble = !0;
  }
  stopImmediatePropagation() {
    this.stopPropagation(), this._stopImmediatePropagationFlag = !0;
  }
}
