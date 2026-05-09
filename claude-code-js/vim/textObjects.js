// Original: src/vim/textObjects.ts
function findTextObject(text2, offset, objectType2, isInner) {
  if (objectType2 === "w")
    return findWordObject(text2, offset, isInner, isVimWordChar);
  if (objectType2 === "W")
    return findWordObject(text2, offset, isInner, (ch2) => !isVimWhitespace(ch2));
  let pair = PAIRS[objectType2];
  if (pair) {
    let [open17, close] = pair;
    return open17 === close ? findQuoteObject(text2, offset, open17, isInner) : findBracketObject(text2, offset, open17, close, isInner);
  }
  return null;
}
function findWordObject(text2, offset, isInner, isWordChar2) {
  let graphemes = [];
  for (let { segment, index: index2 } of getGraphemeSegmenter().segment(text2))
    graphemes.push({ segment, index: index2 });
  let graphemeIdx = graphemes.length - 1;
  for (let i5 = 0;i5 < graphemes.length; i5++) {
    let g = graphemes[i5], nextStart = i5 + 1 < graphemes.length ? graphemes[i5 + 1].index : text2.length;
    if (offset >= g.index && offset < nextStart) {
      graphemeIdx = i5;
      break;
    }
  }
  let graphemeAt = (idx) => graphemes[idx]?.segment ?? "", offsetAt = (idx) => idx < graphemes.length ? graphemes[idx].index : text2.length, isWs = (idx) => isVimWhitespace(graphemeAt(idx)), isWord = (idx) => isWordChar2(graphemeAt(idx)), isPunct = (idx) => isVimPunctuation(graphemeAt(idx)), startIdx = graphemeIdx, endIdx = graphemeIdx;
  if (isWord(graphemeIdx)) {
    while (startIdx > 0 && isWord(startIdx - 1))
      startIdx--;
    while (endIdx < graphemes.length && isWord(endIdx))
      endIdx++;
  } else if (isWs(graphemeIdx)) {
    while (startIdx > 0 && isWs(startIdx - 1))
      startIdx--;
    while (endIdx < graphemes.length && isWs(endIdx))
      endIdx++;
    return { start: offsetAt(startIdx), end: offsetAt(endIdx) };
  } else if (isPunct(graphemeIdx)) {
    while (startIdx > 0 && isPunct(startIdx - 1))
      startIdx--;
    while (endIdx < graphemes.length && isPunct(endIdx))
      endIdx++;
  }
  if (!isInner) {
    if (endIdx < graphemes.length && isWs(endIdx))
      while (endIdx < graphemes.length && isWs(endIdx))
        endIdx++;
    else if (startIdx > 0 && isWs(startIdx - 1))
      while (startIdx > 0 && isWs(startIdx - 1))
        startIdx--;
  }
  return { start: offsetAt(startIdx), end: offsetAt(endIdx) };
}
function findQuoteObject(text2, offset, quote2, isInner) {
  let lineStart = text2.lastIndexOf(`
`, offset - 1) + 1, lineEnd = text2.indexOf(`
`, offset), effectiveEnd = lineEnd === -1 ? text2.length : lineEnd, line = text2.slice(lineStart, effectiveEnd), posInLine = offset - lineStart, positions = [];
  for (let i5 = 0;i5 < line.length; i5++)
    if (line[i5] === quote2)
      positions.push(i5);
  for (let i5 = 0;i5 < positions.length - 1; i5 += 2) {
    let qs = positions[i5], qe = positions[i5 + 1];
    if (qs <= posInLine && posInLine <= qe)
      return isInner ? { start: lineStart + qs + 1, end: lineStart + qe } : { start: lineStart + qs, end: lineStart + qe + 1 };
  }
  return null;
}
function findBracketObject(text2, offset, open17, close, isInner) {
  let depth = 0, start = -1;
  for (let i5 = offset;i5 >= 0; i5--)
    if (text2[i5] === close && i5 !== offset)
      depth++;
    else if (text2[i5] === open17) {
      if (depth === 0) {
        start = i5;
        break;
      }
      depth--;
    }
  if (start === -1)
    return null;
  depth = 0;
  let end = -1;
  for (let i5 = start + 1;i5 < text2.length; i5++)
    if (text2[i5] === open17)
      depth++;
    else if (text2[i5] === close) {
      if (depth === 0) {
        end = i5;
        break;
      }
      depth--;
    }
  if (end === -1)
    return null;
  return isInner ? { start: start + 1, end } : { start, end: end + 1 };
}
var PAIRS;
var init_textObjects = __esm(() => {
  init_Cursor();
  init_intl();
  PAIRS = {
    "(": ["(", ")"],
    ")": ["(", ")"],
    b: ["(", ")"],
    "[": ["[", "]"],
    "]": ["[", "]"],
    "{": ["{", "}"],
    "}": ["{", "}"],
    B: ["{", "}"],
    "<": ["<", ">"],
    ">": ["<", ">"],
    '"': ['"', '"'],
    "'": ["'", "'"],
    "`": ["`", "`"]
  };
});
