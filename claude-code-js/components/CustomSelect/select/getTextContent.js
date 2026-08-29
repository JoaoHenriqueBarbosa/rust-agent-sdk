// function: getTextContent
function getTextContent(node) {
  if (typeof node === "string")
    return node;
  if (typeof node === "number")
    return String(node);
  if (!node)
    return "";
  if (Array.isArray(node))
    return node.map(getTextContent).join("");
  if (import_react49.default.isValidElement(node))
    return getTextContent(node.props.children);
  return "";
}
