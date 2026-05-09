// var: require_ContainerNode
var require_ContainerNode = __commonJS((exports, module) => {
  module.exports = ContainerNode;
  var Node5 = require_Node2(), NodeList2 = require_NodeList();
  function ContainerNode() {
    Node5.call(this), this._firstChild = this._childNodes = null;
  }
  ContainerNode.prototype = Object.create(Node5.prototype, {
    hasChildNodes: { value: function() {
      if (this._childNodes)
        return this._childNodes.length > 0;
      return this._firstChild !== null;
    } },
    childNodes: { get: function() {
      return this._ensureChildNodes(), this._childNodes;
    } },
    firstChild: { get: function() {
      if (this._childNodes)
        return this._childNodes.length === 0 ? null : this._childNodes[0];
      return this._firstChild;
    } },
    lastChild: { get: function() {
      var kids = this._childNodes, first;
      if (kids)
        return kids.length === 0 ? null : kids[kids.length - 1];
      if (first = this._firstChild, first === null)
        return null;
      return first._previousSibling;
    } },
    _ensureChildNodes: { value: function() {
      if (this._childNodes)
        return;
      var first = this._firstChild, kid = first, childNodes = this._childNodes = new NodeList2;
      if (first)
        do
          childNodes.push(kid), kid = kid._nextSibling;
        while (kid !== first);
      this._firstChild = null;
    } },
    removeChildren: { value: function() {
      var root2 = this.rooted ? this.ownerDocument : null, next = this.firstChild, kid;
      while (next !== null) {
        if (kid = next, next = kid.nextSibling, root2)
          root2.mutateRemove(kid);
        kid.parentNode = null;
      }
      if (this._childNodes)
        this._childNodes.length = 0;
      else
        this._firstChild = null;
      this.modify();
    } }
  });
});
