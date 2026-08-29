// var: require_DocumentType
var require_DocumentType = __commonJS((exports, module) => {
  module.exports = DocumentType3;
  var Node5 = require_Node2(), Leaf = require_Leaf(), ChildNode = require_ChildNode();
  function DocumentType3(ownerDocument, name3, publicId, systemId) {
    Leaf.call(this), this.nodeType = Node5.DOCUMENT_TYPE_NODE, this.ownerDocument = ownerDocument || null, this.name = name3, this.publicId = publicId || "", this.systemId = systemId || "";
  }
  DocumentType3.prototype = Object.create(Leaf.prototype, {
    nodeName: { get: function() {
      return this.name;
    } },
    nodeValue: {
      get: function() {
        return null;
      },
      set: function() {}
    },
    clone: { value: function() {
      return new DocumentType3(this.ownerDocument, this.name, this.publicId, this.systemId);
    } },
    isEqual: { value: function(n5) {
      return this.name === n5.name && this.publicId === n5.publicId && this.systemId === n5.systemId;
    } }
  });
  Object.defineProperties(DocumentType3.prototype, ChildNode);
});
