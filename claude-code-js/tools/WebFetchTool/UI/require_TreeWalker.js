// var: require_TreeWalker
var require_TreeWalker = __commonJS((exports, module) => {
  module.exports = TreeWalker2;
  var Node5 = require_Node2(), NodeFilter2 = require_NodeFilter(), NodeTraversal = require_NodeTraversal(), utils = require_utils12(), mapChild = {
    first: "firstChild",
    last: "lastChild",
    next: "firstChild",
    previous: "lastChild"
  }, mapSibling = {
    first: "nextSibling",
    last: "previousSibling",
    next: "nextSibling",
    previous: "previousSibling"
  };
  function traverseChildren(tw, type) {
    var child, node2, parent2, result, sibling;
    node2 = tw._currentNode[mapChild[type]];
    while (node2 !== null) {
      if (result = tw._internalFilter(node2), result === NodeFilter2.FILTER_ACCEPT)
        return tw._currentNode = node2, node2;
      if (result === NodeFilter2.FILTER_SKIP) {
        if (child = node2[mapChild[type]], child !== null) {
          node2 = child;
          continue;
        }
      }
      while (node2 !== null) {
        if (sibling = node2[mapSibling[type]], sibling !== null) {
          node2 = sibling;
          break;
        }
        if (parent2 = node2.parentNode, parent2 === null || parent2 === tw.root || parent2 === tw._currentNode)
          return null;
        else
          node2 = parent2;
      }
    }
    return null;
  }
  function traverseSiblings(tw, type) {
    var node2, result, sibling;
    if (node2 = tw._currentNode, node2 === tw.root)
      return null;
    while (!0) {
      sibling = node2[mapSibling[type]];
      while (sibling !== null) {
        if (node2 = sibling, result = tw._internalFilter(node2), result === NodeFilter2.FILTER_ACCEPT)
          return tw._currentNode = node2, node2;
        if (sibling = node2[mapChild[type]], result === NodeFilter2.FILTER_REJECT || sibling === null)
          sibling = node2[mapSibling[type]];
      }
      if (node2 = node2.parentNode, node2 === null || node2 === tw.root)
        return null;
      if (tw._internalFilter(node2) === NodeFilter2.FILTER_ACCEPT)
        return null;
    }
  }
  function TreeWalker2(root2, whatToShow, filter3) {
    if (!root2 || !root2.nodeType)
      utils.NotSupportedError();
    this._root = root2, this._whatToShow = Number(whatToShow) || 0, this._filter = filter3 || null, this._active = !1, this._currentNode = root2;
  }
  Object.defineProperties(TreeWalker2.prototype, {
    root: { get: function() {
      return this._root;
    } },
    whatToShow: { get: function() {
      return this._whatToShow;
    } },
    filter: { get: function() {
      return this._filter;
    } },
    currentNode: {
      get: function() {
        return this._currentNode;
      },
      set: function(v2) {
        if (!(v2 instanceof Node5))
          throw TypeError("Not a Node");
        this._currentNode = v2;
      }
    },
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
    parentNode: { value: function() {
      var node2 = this._currentNode;
      while (node2 !== this.root) {
        if (node2 = node2.parentNode, node2 === null)
          return null;
        if (this._internalFilter(node2) === NodeFilter2.FILTER_ACCEPT)
          return this._currentNode = node2, node2;
      }
      return null;
    } },
    firstChild: { value: function() {
      return traverseChildren(this, "first");
    } },
    lastChild: { value: function() {
      return traverseChildren(this, "last");
    } },
    previousSibling: { value: function() {
      return traverseSiblings(this, "previous");
    } },
    nextSibling: { value: function() {
      return traverseSiblings(this, "next");
    } },
    previousNode: { value: function() {
      var node2, result, previousSibling2, lastChild;
      node2 = this._currentNode;
      while (node2 !== this._root) {
        for (previousSibling2 = node2.previousSibling;previousSibling2; previousSibling2 = node2.previousSibling) {
          if (node2 = previousSibling2, result = this._internalFilter(node2), result === NodeFilter2.FILTER_REJECT)
            continue;
          for (lastChild = node2.lastChild;lastChild; lastChild = node2.lastChild)
            if (node2 = lastChild, result = this._internalFilter(node2), result === NodeFilter2.FILTER_REJECT)
              break;
          if (result === NodeFilter2.FILTER_ACCEPT)
            return this._currentNode = node2, node2;
        }
        if (node2 === this.root || node2.parentNode === null)
          return null;
        if (node2 = node2.parentNode, this._internalFilter(node2) === NodeFilter2.FILTER_ACCEPT)
          return this._currentNode = node2, node2;
      }
      return null;
    } },
    nextNode: { value: function() {
      var node2, result, firstChild, nextSibling2;
      node2 = this._currentNode, result = NodeFilter2.FILTER_ACCEPT;
      CHILDREN:
        while (!0) {
          for (firstChild = node2.firstChild;firstChild; firstChild = node2.firstChild)
            if (node2 = firstChild, result = this._internalFilter(node2), result === NodeFilter2.FILTER_ACCEPT)
              return this._currentNode = node2, node2;
            else if (result === NodeFilter2.FILTER_REJECT)
              break;
          for (nextSibling2 = NodeTraversal.nextSkippingChildren(node2, this.root);nextSibling2; nextSibling2 = NodeTraversal.nextSkippingChildren(node2, this.root))
            if (node2 = nextSibling2, result = this._internalFilter(node2), result === NodeFilter2.FILTER_ACCEPT)
              return this._currentNode = node2, node2;
            else if (result === NodeFilter2.FILTER_SKIP)
              continue CHILDREN;
          return null;
        }
    } },
    toString: { value: function() {
      return "[object TreeWalker]";
    } }
  });
});
