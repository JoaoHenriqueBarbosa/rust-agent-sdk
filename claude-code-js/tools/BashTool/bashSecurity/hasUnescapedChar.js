// function: hasUnescapedChar
function hasUnescapedChar(content, char) {
  if (char.length !== 1)
    throw Error("hasUnescapedChar only works with single characters");
  let i5 = 0;
  while (i5 < content.length) {
    if (content[i5] === "\\" && i5 + 1 < content.length) {
      i5 += 2;
      continue;
    }
    if (content[i5] === char)
      return !0;
    i5++;
  }
  return !1;
}
