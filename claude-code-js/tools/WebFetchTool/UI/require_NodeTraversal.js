// var: require_NodeTraversal
var require_NodeTraversal = __commonJS((exports, module) => {
  var NodeTraversal = module.exports = {
    nextSkippingChildren,
    nextAncestorSibling,
    next,
    previous,
    deepLastChild
  };
  function nextSkippingChildren(node2, stayWithin) {
    if (node2 === stayWithin)
      return null;
    if (node2.nextSibling !== null)
      return node2.nextSibling;
    return nextAncestorSibling(node2, stayWithin);
  }
  function nextAncestorSibling(node2, stayWithin) {
    for (node2 = node2.parentNode;node2 !== null; node2 = node2.parentNode) {
      if (node2 === stayWithin)
        return null;
      if (node2.nextSibling !== null)
        return node2.nextSibling;
    }
    return null;
  }
  function next(node2, stayWithin) {
    var n5 = node2.firstChild;
    if (n5 !== null)
      return n5;
    if (node2 === stayWithin)
      return null;
    if (n5 = node2.nextSibling, n5 !== null)
      return n5;
    return nextAncestorSibling(node2, stayWithin);
  }
  function deepLastChild(node2) {
    while (node2.lastChild)
      node2 = node2.lastChild;
    return node2;
  }
  function previous(node2, stayWithin) {
    var p4 = node2.previousSibling;
    if (p4 !== null)
      return deepLastChild(p4);
    if (p4 = node2.parentNode, p4 === stayWithin)
      return null;
    return p4;
  }
});
