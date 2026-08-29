// function: normalizeAndTruncateToWidth
function normalizeAndTruncateToWidth(text2, maxWidth) {
  let normalized = text2.replace(/\s+/g, " ").trim();
  return truncateToWidth(normalized, maxWidth);
}
