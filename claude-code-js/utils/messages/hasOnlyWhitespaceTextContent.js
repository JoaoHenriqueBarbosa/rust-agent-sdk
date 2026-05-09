// function: hasOnlyWhitespaceTextContent
function hasOnlyWhitespaceTextContent(content) {
  if (content.length === 0)
    return !1;
  for (let block2 of content) {
    if (block2.type !== "text")
      return !1;
    if (block2.text !== void 0 && block2.text.trim() !== "")
      return !1;
  }
  return !0;
}
