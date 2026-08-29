// Original: src/ink/stringWidth.ts
function stringWidthJavaScript(str) {
  if (typeof str !== "string" || str.length === 0)
    return 0;
  let isPureAscii = !0;
  for (let i = 0;i < str.length; i++) {
    let code = str.charCodeAt(i);
    if (code >= 127 || code === 27) {
      isPureAscii = !1;
      break;
    }
  }
  if (isPureAscii) {
    let width2 = 0;
    for (let i = 0;i < str.length; i++)
      if (str.charCodeAt(i) > 31)
        width2++;
    return width2;
  }
  if (str.includes("\x1B")) {
    if (str = stripAnsi(str), str.length === 0)
      return 0;
  }
  if (!needsSegmentation(str)) {
    let width2 = 0;
    for (let char of str) {
      let codePoint = char.codePointAt(0);
      if (!isZeroWidth(codePoint))
        width2 += eastAsianWidth(codePoint, { ambiguousAsWide: !1 });
    }
    return width2;
  }
  let width = 0;
  for (let { segment: grapheme } of getGraphemeSegmenter().segment(str)) {
    if (EMOJI_REGEX.lastIndex = 0, EMOJI_REGEX.test(grapheme)) {
      width += getEmojiWidth(grapheme);
      continue;
    }
    for (let char of grapheme) {
      let codePoint = char.codePointAt(0);
      if (!isZeroWidth(codePoint)) {
        width += eastAsianWidth(codePoint, { ambiguousAsWide: !1 });
        break;
      }
    }
  }
  return width;
}
function needsSegmentation(str) {
  for (let char of str) {
    let cp = char.codePointAt(0);
    if (cp >= 127744 && cp <= 129791)
      return !0;
    if (cp >= 9728 && cp <= 10175)
      return !0;
    if (cp >= 127462 && cp <= 127487)
      return !0;
    if (cp >= 65024 && cp <= 65039)
      return !0;
    if (cp === 8205)
      return !0;
  }
  return !1;
}
function getEmojiWidth(grapheme) {
  let first = grapheme.codePointAt(0);
  if (first >= 127462 && first <= 127487) {
    let count = 0;
    for (let _ of grapheme)
      count++;
    return count === 1 ? 1 : 2;
  }
  if (grapheme.length === 2) {
    if (grapheme.codePointAt(1) === 65039 && (first >= 48 && first <= 57 || first === 35 || first === 42))
      return 1;
  }
  return 2;
}
function isZeroWidth(codePoint) {
  if (codePoint >= 32 && codePoint < 127)
    return !1;
  if (codePoint >= 160 && codePoint < 768)
    return codePoint === 173;
  if (codePoint <= 31 || codePoint >= 127 && codePoint <= 159)
    return !0;
  if (codePoint >= 8203 && codePoint <= 8205 || codePoint === 65279 || codePoint >= 8288 && codePoint <= 8292)
    return !0;
  if (codePoint >= 65024 && codePoint <= 65039 || codePoint >= 917760 && codePoint <= 917999)
    return !0;
  if (codePoint >= 768 && codePoint <= 879 || codePoint >= 6832 && codePoint <= 6911 || codePoint >= 7616 && codePoint <= 7679 || codePoint >= 8400 && codePoint <= 8447 || codePoint >= 65056 && codePoint <= 65071)
    return !0;
  if (codePoint >= 2304 && codePoint <= 3407) {
    let offset = codePoint & 127;
    if (offset <= 3)
      return !0;
    if (offset >= 58 && offset <= 79)
      return !0;
    if (offset >= 81 && offset <= 87)
      return !0;
    if (offset >= 98 && offset <= 99)
      return !0;
  }
  if (codePoint === 3633 || codePoint >= 3636 && codePoint <= 3642 || codePoint >= 3655 && codePoint <= 3662 || codePoint === 3761 || codePoint >= 3764 && codePoint <= 3772 || codePoint >= 3784 && codePoint <= 3789)
    return !0;
  if (codePoint >= 1536 && codePoint <= 1541 || codePoint === 1757 || codePoint === 1807 || codePoint === 2274)
    return !0;
  if (codePoint >= 55296 && codePoint <= 57343)
    return !0;
  if (codePoint >= 917504 && codePoint <= 917631)
    return !0;
  return !1;
}
var EMOJI_REGEX, bunStringWidth, BUN_STRING_WIDTH_OPTS, stringWidth;
var init_stringWidth = __esm(() => {
  init_get_east_asian_width();
  init_strip_ansi();
  init_intl();
  EMOJI_REGEX = emoji_regex_default();
  bunStringWidth = typeof Bun < "u" && typeof Bun.stringWidth === "function" ? Bun.stringWidth : null, BUN_STRING_WIDTH_OPTS = { ambiguousIsNarrow: !0 }, stringWidth = bunStringWidth ? (str) => bunStringWidth(str, BUN_STRING_WIDTH_OPTS) : stringWidthJavaScript;
});
