// Original: src/utils/truncate.ts
function truncatePathMiddle(path2, maxLength) {
  if (stringWidth(path2) <= maxLength)
    return path2;
  if (maxLength <= 0)
    return "\u2026";
  if (maxLength < 5)
    return truncateToWidth(path2, maxLength);
  let lastSlash = path2.lastIndexOf("/"), filename = lastSlash >= 0 ? path2.slice(lastSlash) : path2, directory = lastSlash >= 0 ? path2.slice(0, lastSlash) : "", filenameWidth = stringWidth(filename);
  if (filenameWidth >= maxLength - 1)
    return truncateStartToWidth(path2, maxLength);
  let availableForDir = maxLength - 1 - filenameWidth;
  if (availableForDir <= 0)
    return truncateStartToWidth(filename, maxLength);
  return truncateToWidthNoEllipsis(directory, availableForDir) + "\u2026" + filename;
}
function truncateToWidth(text, maxWidth) {
  if (stringWidth(text) <= maxWidth)
    return text;
  if (maxWidth <= 1)
    return "\u2026";
  let width = 0, result = "";
  for (let { segment } of getGraphemeSegmenter().segment(text)) {
    let segWidth = stringWidth(segment);
    if (width + segWidth > maxWidth - 1)
      break;
    result += segment, width += segWidth;
  }
  return result + "\u2026";
}
function truncateStartToWidth(text, maxWidth) {
  if (stringWidth(text) <= maxWidth)
    return text;
  if (maxWidth <= 1)
    return "\u2026";
  let segments = [...getGraphemeSegmenter().segment(text)], width = 0, startIdx = segments.length;
  for (let i = segments.length - 1;i >= 0; i--) {
    let segWidth = stringWidth(segments[i].segment);
    if (width + segWidth > maxWidth - 1)
      break;
    width += segWidth, startIdx = i;
  }
  return "\u2026" + segments.slice(startIdx).map((s) => s.segment).join("");
}
function truncateToWidthNoEllipsis(text, maxWidth) {
  if (stringWidth(text) <= maxWidth)
    return text;
  if (maxWidth <= 0)
    return "";
  let width = 0, result = "";
  for (let { segment } of getGraphemeSegmenter().segment(text)) {
    let segWidth = stringWidth(segment);
    if (width + segWidth > maxWidth)
      break;
    result += segment, width += segWidth;
  }
  return result;
}
function truncate(str, maxWidth, singleLine = !1) {
  let result = str;
  if (singleLine) {
    let firstNewline = str.indexOf(`
`);
    if (firstNewline !== -1) {
      if (result = str.substring(0, firstNewline), stringWidth(result) + 1 > maxWidth)
        return truncateToWidth(result, maxWidth);
      return `${result}\u2026`;
    }
  }
  if (stringWidth(result) <= maxWidth)
    return result;
  return truncateToWidth(result, maxWidth);
}
var init_truncate = __esm(() => {
  init_stringWidth();
  init_intl();
});
