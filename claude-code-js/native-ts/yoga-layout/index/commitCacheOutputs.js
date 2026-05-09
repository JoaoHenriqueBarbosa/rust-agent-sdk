// function: commitCacheOutputs
function commitCacheOutputs(node, performLayout) {
  if (performLayout)
    node._lOutW = node.layout.width, node._lOutH = node.layout.height;
  else
    node._mOutW = node.layout.width, node._mOutH = node.layout.height;
}
