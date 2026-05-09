// function: isEOL
function isEOL(text, offset) {
  return `\r
`.indexOf(text.charAt(offset)) !== -1;
}
