// var: require_NamedNodeMap
var require_NamedNodeMap = __commonJS((exports, module) => {
  module.exports = NamedNodeMap2;
  var utils = require_utils12();
  function NamedNodeMap2(element) {
    this.element = element;
  }
  Object.defineProperties(NamedNodeMap2.prototype, {
    length: { get: utils.shouldOverride },
    item: { value: utils.shouldOverride },
    getNamedItem: { value: function(qualifiedName) {
      return this.element.getAttributeNode(qualifiedName);
    } },
    getNamedItemNS: { value: function(namespace, localName) {
      return this.element.getAttributeNodeNS(namespace, localName);
    } },
    setNamedItem: { value: utils.nyi },
    setNamedItemNS: { value: utils.nyi },
    removeNamedItem: { value: function(qualifiedName) {
      var attr = this.element.getAttributeNode(qualifiedName);
      if (attr)
        return this.element.removeAttribute(qualifiedName), attr;
      utils.NotFoundError();
    } },
    removeNamedItemNS: { value: function(ns, lname) {
      var attr = this.element.getAttributeNodeNS(ns, lname);
      if (attr)
        return this.element.removeAttributeNS(ns, lname), attr;
      utils.NotFoundError();
    } }
  });
});
