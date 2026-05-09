// function: extractTag
function extractTag(html2, tagName19) {
  if (!html2.trim() || !tagName19.trim())
    return null;
  let escapedTag = escapeRegExp(tagName19), pattern = new RegExp(`<${escapedTag}(?:\\s+[^>]*)?>([\\s\\S]*?)<\\/${escapedTag}>`, "gi"), match, depth = 0, lastIndex = 0, openingTag = new RegExp(`<${escapedTag}(?:\\s+[^>]*?)?>`, "gi"), closingTag = new RegExp(`<\\/${escapedTag}>`, "gi");
  while ((match = pattern.exec(html2)) !== null) {
    let content = match[1], beforeMatch = html2.slice(lastIndex, match.index);
    depth = 0, openingTag.lastIndex = 0;
    while (openingTag.exec(beforeMatch) !== null)
      depth++;
    closingTag.lastIndex = 0;
    while (closingTag.exec(beforeMatch) !== null)
      depth--;
    if (depth === 0 && content)
      return content;
    lastIndex = match.index + match[0].length;
  }
  return null;
}
