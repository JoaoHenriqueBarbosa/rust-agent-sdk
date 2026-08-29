// function: applyPaddingToText
function applyPaddingToText(node, text, softWrap) {
  let yogaNode = node.childNodes[0]?.yogaNode;
  if (yogaNode) {
    let offsetX = yogaNode.getComputedLeft(), offsetY = yogaNode.getComputedTop();
    if (text = `
`.repeat(offsetY) + indentString(text, offsetX), softWrap && offsetY > 0)
      softWrap.unshift(...Array(offsetY).fill(!1));
  }
  return text;
}
