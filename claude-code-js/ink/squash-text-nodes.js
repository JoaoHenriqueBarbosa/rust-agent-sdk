// Original: src/ink/squash-text-nodes.ts
function squashTextNodesToSegments(node, inheritedStyles = {}, inheritedHyperlink, out = []) {
  let mergedStyles = node.textStyles ? { ...inheritedStyles, ...node.textStyles } : inheritedStyles;
  for (let childNode of node.childNodes) {
    if (childNode === void 0)
      continue;
    if (childNode.nodeName === "#text") {
      if (childNode.nodeValue.length > 0)
        out.push({
          text: childNode.nodeValue,
          styles: mergedStyles,
          hyperlink: inheritedHyperlink
        });
    } else if (childNode.nodeName === "ink-text" || childNode.nodeName === "ink-virtual-text")
      squashTextNodesToSegments(childNode, mergedStyles, inheritedHyperlink, out);
    else if (childNode.nodeName === "ink-link") {
      let href = childNode.attributes.href;
      squashTextNodesToSegments(childNode, mergedStyles, href || inheritedHyperlink, out);
    }
  }
  return out;
}
function squashTextNodes(node) {
  let text = "";
  for (let childNode of node.childNodes) {
    if (childNode === void 0)
      continue;
    if (childNode.nodeName === "#text")
      text += childNode.nodeValue;
    else if (childNode.nodeName === "ink-text" || childNode.nodeName === "ink-virtual-text")
      text += squashTextNodes(childNode);
    else if (childNode.nodeName === "ink-link")
      text += squashTextNodes(childNode);
  }
  return text;
}
var squash_text_nodes_default;
var init_squash_text_nodes = __esm(() => {
  squash_text_nodes_default = squashTextNodes;
});
