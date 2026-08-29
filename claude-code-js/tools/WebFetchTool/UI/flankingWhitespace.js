// function: flankingWhitespace
function flankingWhitespace(node2, options2) {
  if (node2.isBlock || options2.preformattedCode && node2.isCode)
    return {
      leading: "",
      trailing: ""
    };
  var edges = edgeWhitespace(node2.textContent);
  if (edges.leadingAscii && isFlankedByWhitespace("left", node2, options2))
    edges.leading = edges.leadingNonAscii;
  if (edges.trailingAscii && isFlankedByWhitespace("right", node2, options2))
    edges.trailing = edges.trailingNonAscii;
  return {
    leading: edges.leading,
    trailing: edges.trailing
  };
}
