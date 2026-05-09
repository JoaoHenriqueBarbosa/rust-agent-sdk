// Original: src/utils/ultraplan/keyword.ts
function findKeywordTriggerPositions(text2, keyword) {
  if (!new RegExp(keyword, "i").test(text2))
    return [];
  if (text2.startsWith("/"))
    return [];
  let quotedRanges = [], openQuote = null, openAt = 0, isWord = (ch2) => !!ch2 && /[\p{L}\p{N}_]/u.test(ch2);
  for (let i5 = 0;i5 < text2.length; i5++) {
    let ch2 = text2[i5];
    if (openQuote) {
      if (openQuote === "[" && ch2 === "[") {
        openAt = i5;
        continue;
      }
      if (ch2 !== OPEN_TO_CLOSE[openQuote])
        continue;
      if (openQuote === "'" && isWord(text2[i5 + 1]))
        continue;
      quotedRanges.push({ start: openAt, end: i5 + 1 }), openQuote = null;
    } else if (ch2 === "<" && i5 + 1 < text2.length && /[a-zA-Z/]/.test(text2[i5 + 1]) || ch2 === "'" && !isWord(text2[i5 - 1]) || ch2 !== "<" && ch2 !== "'" && ch2 in OPEN_TO_CLOSE)
      openQuote = ch2, openAt = i5;
  }
  let positions = [], wordRe = new RegExp(`\\b${keyword}\\b`, "gi"), matches2 = text2.matchAll(wordRe);
  for (let match of matches2) {
    if (match.index === void 0)
      continue;
    let start = match.index, end = start + match[0].length;
    if (quotedRanges.some((r4) => start >= r4.start && start < r4.end))
      continue;
    let before2 = text2[start - 1], after2 = text2[end];
    if (before2 === "/" || before2 === "\\" || before2 === "-")
      continue;
    if (after2 === "/" || after2 === "\\" || after2 === "-" || after2 === "?")
      continue;
    if (after2 === "." && isWord(text2[end + 1]))
      continue;
    positions.push({ word: match[0], start, end });
  }
  return positions;
}
function findUltrareviewTriggerPositions(text2) {
  return findKeywordTriggerPositions(text2, "ultrareview");
}
var OPEN_TO_CLOSE;
var init_keyword = __esm(() => {
  OPEN_TO_CLOSE = {
    "`": "`",
    '"': '"',
    "<": ">",
    "{": "}",
    "[": "]",
    "(": ")",
    "'": "'"
  };
});
