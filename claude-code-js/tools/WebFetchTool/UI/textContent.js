// function: textContent
function textContent(node2) {
  if (Array.isArray(node2))
    return node2.map(textContent).join("");
  if (hasChildren(node2) && !isComment(node2))
    return textContent(node2.children);
  if (isText(node2))
    return node2.data;
  return "";
}
