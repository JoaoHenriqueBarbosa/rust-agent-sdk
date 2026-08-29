// function: getInnerHTML
function getInnerHTML(node2, options2) {
  return hasChildren(node2) ? node2.children.map((node3) => getOuterHTML(node3, options2)).join("") : "";
}
