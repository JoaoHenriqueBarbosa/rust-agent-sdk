// function: innerText
function innerText(node2) {
  if (Array.isArray(node2))
    return node2.map(innerText).join("");
  if (hasChildren(node2) && (node2.type === ElementType.Tag || isCDATA(node2)))
    return innerText(node2.children);
  if (isText(node2))
    return node2.data;
  return "";
}
