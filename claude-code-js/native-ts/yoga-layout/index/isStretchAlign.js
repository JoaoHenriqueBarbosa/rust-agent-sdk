// function: isStretchAlign
function isStretchAlign(child) {
  let p4 = child.parent;
  if (!p4)
    return !1;
  return (child.style.alignSelf === Align.Auto ? p4.style.alignItems : child.style.alignSelf) === Align.Stretch;
}
