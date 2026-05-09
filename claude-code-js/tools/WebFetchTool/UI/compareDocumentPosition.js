// function: compareDocumentPosition
function compareDocumentPosition(nodeA, nodeB) {
  let aParents = [], bParents = [];
  if (nodeA === nodeB)
    return 0;
  let current = hasChildren(nodeA) ? nodeA : nodeA.parent;
  while (current)
    aParents.unshift(current), current = current.parent;
  current = hasChildren(nodeB) ? nodeB : nodeB.parent;
  while (current)
    bParents.unshift(current), current = current.parent;
  let maxIdx = Math.min(aParents.length, bParents.length), idx = 0;
  while (idx < maxIdx && aParents[idx] === bParents[idx])
    idx++;
  if (idx === 0)
    return DocumentPosition.DISCONNECTED;
  let sharedParent = aParents[idx - 1], siblings = sharedParent.children, aSibling = aParents[idx], bSibling = bParents[idx];
  if (siblings.indexOf(aSibling) > siblings.indexOf(bSibling)) {
    if (sharedParent === nodeB)
      return DocumentPosition.FOLLOWING | DocumentPosition.CONTAINED_BY;
    return DocumentPosition.FOLLOWING;
  }
  if (sharedParent === nodeA)
    return DocumentPosition.PRECEDING | DocumentPosition.CONTAINS;
  return DocumentPosition.PRECEDING;
}
