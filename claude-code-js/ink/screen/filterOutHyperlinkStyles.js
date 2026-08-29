// function: filterOutHyperlinkStyles
function filterOutHyperlinkStyles(styles5) {
  return styles5.filter((style) => !style.code.startsWith(OSC8_PREFIX) || !OSC8_REGEX.test(style.code));
}
