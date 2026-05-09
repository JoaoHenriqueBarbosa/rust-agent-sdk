// function: getText
function getText(node2) {
  if (Array.isArray(node2))
    return node2.map(getText).join("");
  if (isTag2(node2))
    return node2.name === "br" ? `
` : getText(node2.children);
  if (isCDATA(node2))
    return getText(node2.children);
  if (isText(node2))
    return node2.data;
  return "";
}
