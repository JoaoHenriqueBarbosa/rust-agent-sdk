// var: require_CustomEvent
var require_CustomEvent = __commonJS((exports, module) => {
  module.exports = CustomEvent2;
  var Event3 = require_Event();
  function CustomEvent2(type, dictionary) {
    Event3.call(this, type, dictionary);
  }
  CustomEvent2.prototype = Object.create(Event3.prototype, {
    constructor: { value: CustomEvent2 }
  });
});
