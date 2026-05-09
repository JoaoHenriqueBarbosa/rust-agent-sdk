// var: isNode2
var isNode2 = (node2) => node2 instanceof Node3, insert = (parentNode, child, nodes) => {
  let { ownerDocument } = parentNode;
  for (let node2 of nodes)
    parentNode.insertBefore(isNode2(node2) ? node2 : new Text5(ownerDocument, node2), child);
}, ParentNode;
