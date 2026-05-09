// var: require_NodeIterator
var require_NodeIterator = __commonJS((exports, module) => {
  module.exports = NodeIterator;
  var NodeFilter2 = require_NodeFilter(), NodeTraversal = require_NodeTraversal(), utils = require_utils12();
  function move(node2, stayWithin, directionIsNext) {
    if (directionIsNext)
      return NodeTraversal.next(node2, stayWithin);
    else {
      if (node2 === stayWithin)
        return null;
      return NodeTraversal.previous(node2, null);
    }
  }
  function isInclusiveAncestor(node2, possibleChild) {
    for (;possibleChild; possibleChild = possibleChild.parentNode)
      if (node2 === possibleChild)
        return !0;
    return !1;
  }
  function traverse(ni, directionIsNext) {
    var node2, beforeNode;
    node2 = ni._referenceNode, beforeNode = ni._pointerBeforeReferenceNode;
    while (!0) {
      if (beforeNode === directionIsNext)
        beforeNode = !beforeNode;
      else if (node2 = move(node2, ni._root, directionIsNext), node2 === null)
        return null;
      var result = ni._internalFilter(node2);
      if (result === NodeFilter2.FILTER_ACCEPT)
        break;
    }
    return ni._referenceNode = node2, ni._pointerBeforeReferenceNode = beforeNode, node2;
  }
  function NodeIterator(root2, whatToShow, filter3) {
    if (!root2 || !root2.nodeType)
      utils.NotSupportedError();
    this._root = root2, this._referenceNode = root2, this._pointerBeforeReferenceNode = !0, this._whatToShow = Number(whatToShow) || 0, this._filter = filter3 || null, this._active = !1, root2.doc._attachNodeIterator(this);
  }
  Object.defineProperties(NodeIterator.prototype, {
    root: { get: function() {
      return this._root;
    } },
    referenceNode: { get: function() {
      return this._referenceNode;
    } },
    pointerBeforeReferenceNode: { get: function() {
      return this._pointerBeforeReferenceNode;
    } },
    whatToShow: { get: function() {
      return this._whatToShow;
    } },
    filter: { get: function() {
      return this._filter;
    } },
    _internalFilter: { value: function(node2) {
      var result, filter3;
      if (this._active)
        utils.InvalidStateError();
      if (!(1 << node2.nodeType - 1 & this._whatToShow))
        return NodeFilter2.FILTER_SKIP;
      if (filter3 = this._filter, filter3 === null)
        result = NodeFilter2.FILTER_ACCEPT;
      else {
        this._active = !0;
        try {
          if (typeof filter3 === "function")
            result = filter3(node2);
          else
            result = filter3.acceptNode(node2);
        } finally {
          this._active = !1;
        }
      }
      return +result;
    } },
    _preremove: { value: function(toBeRemovedNode) {
      if (isInclusiveAncestor(toBeRemovedNode, this._root))
        return;
      if (!isInclusiveAncestor(toBeRemovedNode, this._referenceNode))
        return;
      if (this._pointerBeforeReferenceNode) {
        var next = toBeRemovedNode;
        while (next.lastChild)
          next = next.lastChild;
        if (next = NodeTraversal.next(next, this.root), next) {
          this._referenceNode = next;
          return;
        }
        this._pointerBeforeReferenceNode = !1;
      }
      if (toBeRemovedNode.previousSibling === null)
        this._referenceNode = toBeRemovedNode.parentNode;
      else {
        this._referenceNode = toBeRemovedNode.previousSibling;
        var lastChild;
        for (lastChild = this._referenceNode.lastChild;lastChild; lastChild = this._referenceNode.lastChild)
          this._referenceNode = lastChild;
      }
    } },
    nextNode: { value: function() {
      return traverse(this, !0);
    } },
    previousNode: { value: function() {
      return traverse(this, !1);
    } },
    detach: { value: function() {} },
    toString: { value: function() {
      return "[object NodeIterator]";
    } }
  });
});
