// var: require_Leaf
var require_Leaf = __commonJS((exports, module) => {
  module.exports = Leaf;
  var Node5 = require_Node2(), NodeList2 = require_NodeList(), utils = require_utils12(), HierarchyRequestError = utils.HierarchyRequestError, NotFoundError2 = utils.NotFoundError;
  function Leaf() {
    Node5.call(this);
  }
  Leaf.prototype = Object.create(Node5.prototype, {
    hasChildNodes: { value: function() {
      return !1;
    } },
    firstChild: { value: null },
    lastChild: { value: null },
    insertBefore: { value: function(node2, child) {
      if (!node2.nodeType)
        throw TypeError("not a node");
      HierarchyRequestError();
    } },
    replaceChild: { value: function(node2, child) {
      if (!node2.nodeType)
        throw TypeError("not a node");
      HierarchyRequestError();
    } },
    removeChild: { value: function(node2) {
      if (!node2.nodeType)
        throw TypeError("not a node");
      NotFoundError2();
    } },
    removeChildren: { value: function() {} },
    childNodes: { get: function() {
      if (!this._childNodes)
        this._childNodes = new NodeList2;
      return this._childNodes;
    } }
  });
});
