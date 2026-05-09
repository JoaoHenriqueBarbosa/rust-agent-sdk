// function: isFlankedByWhitespace
function isFlankedByWhitespace(side, node2, options2) {
  var sibling, regExp, isFlanked;
  if (side === "left")
    sibling = node2.previousSibling, regExp = / $/;
  else
    sibling = node2.nextSibling, regExp = /^ /;
  if (sibling) {
    if (sibling.nodeType === 3)
      isFlanked = regExp.test(sibling.nodeValue);
    else if (options2.preformattedCode && sibling.nodeName === "CODE")
      isFlanked = !1;
    else if (sibling.nodeType === 1 && !isBlock(sibling))
      isFlanked = regExp.test(sibling.textContent);
  }
  return isFlanked;
}
