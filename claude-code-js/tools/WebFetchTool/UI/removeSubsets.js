// function: removeSubsets
function removeSubsets(nodes) {
  let idx = nodes.length;
  while (--idx >= 0) {
    let node2 = nodes[idx];
    if (idx > 0 && nodes.lastIndexOf(node2, idx - 1) >= 0) {
      nodes.splice(idx, 1);
      continue;
    }
    for (let ancestor = node2.parent;ancestor; ancestor = ancestor.parent)
      if (nodes.includes(ancestor)) {
        nodes.splice(idx, 1);
        break;
      }
  }
  return nodes;
}
