// function: existsOne
function existsOne(test2, nodes) {
  return (Array.isArray(nodes) ? nodes : [nodes]).some((node2) => isTag2(node2) && test2(node2) || hasChildren(node2) && existsOne(test2, node2.children));
}
