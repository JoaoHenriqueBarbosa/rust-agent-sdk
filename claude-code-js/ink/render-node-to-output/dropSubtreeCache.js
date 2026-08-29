// function: dropSubtreeCache
function dropSubtreeCache(node) {
  nodeCache.delete(node);
  for (let child of node.childNodes)
    if (child.nodeName !== "#text")
      dropSubtreeCache(child);
}
