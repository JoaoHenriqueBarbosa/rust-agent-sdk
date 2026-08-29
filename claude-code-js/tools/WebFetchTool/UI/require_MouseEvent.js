// var: require_MouseEvent
var require_MouseEvent = __commonJS((exports, module) => {
  var UIEvent = require_UIEvent();
  module.exports = MouseEvent;
  function MouseEvent() {
    UIEvent.call(this), this.screenX = this.screenY = this.clientX = this.clientY = 0, this.ctrlKey = this.altKey = this.shiftKey = this.metaKey = !1, this.button = 0, this.buttons = 1, this.relatedTarget = null;
  }
  MouseEvent.prototype = Object.create(UIEvent.prototype, {
    constructor: { value: MouseEvent },
    initMouseEvent: { value: function(type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget) {
      switch (this.initEvent(type, bubbles, cancelable, view, detail), this.screenX = screenX, this.screenY = screenY, this.clientX = clientX, this.clientY = clientY, this.ctrlKey = ctrlKey, this.altKey = altKey, this.shiftKey = shiftKey, this.metaKey = metaKey, this.button = button, button) {
        case 0:
          this.buttons = 1;
          break;
        case 1:
          this.buttons = 4;
          break;
        case 2:
          this.buttons = 2;
          break;
        default:
          this.buttons = 0;
          break;
      }
      this.relatedTarget = relatedTarget;
    } },
    getModifierState: { value: function(key3) {
      switch (key3) {
        case "Alt":
          return this.altKey;
        case "Control":
          return this.ctrlKey;
        case "Shift":
          return this.shiftKey;
        case "Meta":
          return this.metaKey;
        default:
          return !1;
      }
    } }
  });
});
