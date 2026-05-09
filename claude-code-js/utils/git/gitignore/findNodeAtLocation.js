// function: findNodeAtLocation
function findNodeAtLocation(root2, path9) {
  if (!root2)
    return;
  let node = root2;
  for (let segment of path9)
    if (typeof segment === "string") {
      if (node.type !== "object" || !Array.isArray(node.children))
        return;
      let found = !1;
      for (let propertyNode of node.children)
        if (Array.isArray(propertyNode.children) && propertyNode.children[0].value === segment && propertyNode.children.length === 2) {
          node = propertyNode.children[1], found = !0;
          break;
        }
      if (!found)
        return;
    } else {
      let index = segment;
      if (node.type !== "array" || index < 0 || !Array.isArray(node.children) || index >= node.children.length)
        return;
      node = node.children[index];
    }
  return node;
}
