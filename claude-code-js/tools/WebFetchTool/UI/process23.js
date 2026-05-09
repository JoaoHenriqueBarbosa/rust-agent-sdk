// function: process23
function process23(parentNode) {
  var self2 = this;
  return reduce.call(parentNode.childNodes, function(output, node2) {
    node2 = new Node5(node2, self2.options);
    var replacement = "";
    if (node2.nodeType === 3)
      replacement = node2.isCode ? node2.nodeValue : self2.escape(node2.nodeValue);
    else if (node2.nodeType === 1)
      replacement = replacementForNode.call(self2, node2);
    return join85(output, replacement);
  }, "");
}
