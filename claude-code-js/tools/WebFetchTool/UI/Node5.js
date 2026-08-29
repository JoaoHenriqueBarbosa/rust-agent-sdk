// function: Node5
function Node5(node2, options2) {
  return node2.isBlock = isBlock(node2), node2.isCode = node2.nodeName === "CODE" || node2.parentNode.isCode, node2.isBlank = isBlank(node2), node2.flankingWhitespace = flankingWhitespace(node2, options2), node2;
}
