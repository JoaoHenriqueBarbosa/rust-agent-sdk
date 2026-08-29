// var: require_Window
var require_Window = __commonJS((exports, module) => {
  var DOMImplementation = require_DOMImplementation(), EventTarget2 = require_EventTarget(), Location = require_Location(), utils = require_utils12();
  module.exports = Window;
  function Window(document2) {
    this.document = document2 || new DOMImplementation(null).createHTMLDocument(""), this.document._scripting_enabled = !0, this.document.defaultView = this, this.location = new Location(this, this.document._address || "about:blank");
  }
  Window.prototype = Object.create(EventTarget2.prototype, {
    console: { value: console },
    history: { value: {
      back: utils.nyi,
      forward: utils.nyi,
      go: utils.nyi
    } },
    navigator: { value: require_NavigatorID() },
    window: { get: function() {
      return this;
    } },
    self: { get: function() {
      return this;
    } },
    frames: { get: function() {
      return this;
    } },
    parent: { get: function() {
      return this;
    } },
    top: { get: function() {
      return this;
    } },
    length: { value: 0 },
    frameElement: { value: null },
    opener: { value: null },
    onload: {
      get: function() {
        return this._getEventHandler("load");
      },
      set: function(v2) {
        this._setEventHandler("load", v2);
      }
    },
    getComputedStyle: { value: function(elt) {
      return elt.style;
    } }
  });
  utils.expose(require_WindowTimers(), Window);
  utils.expose(require_impl(), Window);
});
