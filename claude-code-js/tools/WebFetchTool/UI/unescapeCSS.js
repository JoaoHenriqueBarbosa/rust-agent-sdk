// function: unescapeCSS
function unescapeCSS(str2) {
  return str2.replace(reEscape, funescape);
}
