// var: require_NonDocumentTypeChildNode
var require_NonDocumentTypeChildNode = __commonJS((exports, module) => {
  var Node5 = require_Node2(), NonDocumentTypeChildNode = {
    nextElementSibling: { get: function() {
      if (this.parentNode) {
        for (var kid = this.nextSibling;kid !== null; kid = kid.nextSibling)
          if (kid.nodeType === Node5.ELEMENT_NODE)
            return kid;
      }
      return null;
    } },
    previousElementSibling: { get: function() {
      if (this.parentNode) {
        for (var kid = this.previousSibling;kid !== null; kid = kid.previousSibling)
          if (kid.nodeType === Node5.ELEMENT_NODE)
            return kid;
      }
      return null;
    } }
  };
  module.exports = NonDocumentTypeChildNode;
});
