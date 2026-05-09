// var: require_UIEvent
var require_UIEvent = __commonJS((exports, module) => {
  var Event3 = require_Event();
  module.exports = UIEvent;
  function UIEvent() {
    Event3.call(this), this.view = null, this.detail = 0;
  }
  UIEvent.prototype = Object.create(Event3.prototype, {
    constructor: { value: UIEvent },
    initUIEvent: { value: function(type, bubbles, cancelable, view, detail) {
      this.initEvent(type, bubbles, cancelable), this.view = view, this.detail = detail;
    } }
  });
});
