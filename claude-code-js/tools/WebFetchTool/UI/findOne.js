// function: findOne
function findOne(test2, nodes, recurse = !0) {
  let searchedNodes = Array.isArray(nodes) ? nodes : [nodes];
  for (let i5 = 0;i5 < searchedNodes.length; i5++) {
    let node2 = searchedNodes[i5];
    if (isTag2(node2) && test2(node2))
      return node2;
    if (recurse && hasChildren(node2) && node2.children.length > 0) {
      let found = findOne(test2, node2.children, !0);
      if (found)
        return found;
    }
  }
  return null;
}
