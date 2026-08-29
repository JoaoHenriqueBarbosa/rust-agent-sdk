// function: render2
function render2(node2, options2 = {}) {
  let nodes = "length" in node2 ? node2 : [node2], output = "";
  for (let i5 = 0;i5 < nodes.length; i5++)
    output += renderNode(nodes[i5], options2);
  return output;
}
