// function: replacementForNode
function replacementForNode(node2) {
  var rule = this.rules.forNode(node2), content = process23.call(this, node2), whitespace2 = node2.flankingWhitespace;
  if (whitespace2.leading || whitespace2.trailing)
    content = content.trim();
  return whitespace2.leading + rule.replacement(content, node2, this.options) + whitespace2.trailing;
}
