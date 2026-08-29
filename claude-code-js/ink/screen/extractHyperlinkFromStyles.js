// function: extractHyperlinkFromStyles
function extractHyperlinkFromStyles(styles5) {
  for (let style of styles5) {
    let code = style.code;
    if (code.length < 5 || !code.startsWith(OSC8_PREFIX))
      continue;
    let match = code.match(OSC8_REGEX);
    if (match)
      return match[1] || null;
  }
  return null;
}
