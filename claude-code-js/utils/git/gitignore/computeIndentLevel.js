// function: computeIndentLevel
function computeIndentLevel(content, options) {
  let i2 = 0, nChars = 0, tabSize = options.tabSize || 4;
  while (i2 < content.length) {
    let ch = content.charAt(i2);
    if (ch === cachedSpaces[1])
      nChars++;
    else if (ch === "\t")
      nChars += tabSize;
    else
      break;
    i2++;
  }
  return Math.floor(nChars / tabSize);
}
