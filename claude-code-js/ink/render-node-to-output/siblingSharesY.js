// function: siblingSharesY
function siblingSharesY(node, yogaNode) {
  let parent = node.parentNode;
  if (!parent)
    return !1;
  let myTop = yogaNode.getComputedTop(), siblings = parent.childNodes, idx = siblings.indexOf(node);
  for (let i4 = idx + 1;i4 < siblings.length; i4++) {
    let sib = siblings[i4].yogaNode;
    if (!sib)
      continue;
    return sib.getComputedTop() === myTop;
  }
  for (let i4 = idx - 1;i4 >= 0; i4--) {
    let sib = siblings[i4].yogaNode;
    if (!sib)
      continue;
    return sib.getComputedTop() === myTop;
  }
  return !1;
}
