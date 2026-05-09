// function: extractCompletionToken
function extractCompletionToken(text2, cursorPos, includeAtSymbol = !1) {
  if (!text2)
    return null;
  let textBeforeCursor = text2.substring(0, cursorPos);
  if (includeAtSymbol) {
    let quotedAtRegex = /@"([^"]*)"?$/, quotedMatch = textBeforeCursor.match(quotedAtRegex);
    if (quotedMatch && quotedMatch.index !== void 0) {
      let afterQuotedMatch = text2.substring(cursorPos).match(/^[^"]*"?/), quotedSuffix = afterQuotedMatch ? afterQuotedMatch[0] : "";
      return {
        token: quotedMatch[0] + quotedSuffix,
        startPos: quotedMatch.index,
        isQuoted: !0
      };
    }
  }
  if (includeAtSymbol) {
    let atIdx = textBeforeCursor.lastIndexOf("@");
    if (atIdx >= 0 && (atIdx === 0 || /\s/.test(textBeforeCursor[atIdx - 1]))) {
      let fromAt = textBeforeCursor.substring(atIdx), atHeadMatch = fromAt.match(AT_TOKEN_HEAD_RE);
      if (atHeadMatch && atHeadMatch[0].length === fromAt.length) {
        let afterMatch2 = text2.substring(cursorPos).match(PATH_CHAR_HEAD_RE), tokenSuffix2 = afterMatch2 ? afterMatch2[0] : "";
        return {
          token: atHeadMatch[0] + tokenSuffix2,
          startPos: atIdx,
          isQuoted: !1
        };
      }
    }
  }
  let tokenRegex = includeAtSymbol ? TOKEN_WITH_AT_RE : TOKEN_WITHOUT_AT_RE, match = textBeforeCursor.match(tokenRegex);
  if (!match || match.index === void 0)
    return null;
  let afterMatch = text2.substring(cursorPos).match(PATH_CHAR_HEAD_RE), tokenSuffix = afterMatch ? afterMatch[0] : "";
  return {
    token: match[0] + tokenSuffix,
    startPos: match.index,
    isQuoted: !1
  };
}
