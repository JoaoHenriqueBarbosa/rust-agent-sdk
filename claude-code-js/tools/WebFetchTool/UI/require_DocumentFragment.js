// var: require_DocumentFragment
var require_DocumentFragment = __commonJS((exports, module) => {
  module.exports = DocumentFragment3;
  var Node5 = require_Node2(), NodeList2 = require_NodeList(), ContainerNode = require_ContainerNode(), Element4 = require_Element(), select2 = require_select(), utils = require_utils12();
  function DocumentFragment3(doc2) {
    ContainerNode.call(this), this.nodeType = Node5.DOCUMENT_FRAGMENT_NODE, this.ownerDocument = doc2;
  }
  DocumentFragment3.prototype = Object.create(ContainerNode.prototype, {
    nodeName: { value: "#document-fragment" },
    nodeValue: {
      get: function() {
        return null;
      },
      set: function() {}
    },
    textContent: Object.getOwnPropertyDescriptor(Element4.prototype, "textContent"),
    innerText: Object.getOwnPropertyDescriptor(Element4.prototype, "innerText"),
    querySelector: { value: function(selector) {
      var nodes = this.querySelectorAll(selector);
      return nodes.length ? nodes[0] : null;
    } },
    querySelectorAll: { value: function(selector) {
      var context6 = Object.create(this);
      context6.isHTML = !0, context6.getElementsByTagName = Element4.prototype.getElementsByTagName, context6.nextElement = Object.getOwnPropertyDescriptor(Element4.prototype, "firstElementChild").get;
      var nodes = select2(selector, context6);
      return nodes.item ? nodes : new NodeList2(nodes);
    } },
    clone: { value: function() {
      return new DocumentFragment3(this.ownerDocument);
    } },
    isEqual: { value: function(n5) {
      return !0;
    } },
    innerHTML: {
      get: function() {
        return this.serialize();
      },
      set: utils.nyi
    },
    outerHTML: {
      get: function() {
        return this.serialize();
      },
      set: utils.nyi
    }
  });
});
