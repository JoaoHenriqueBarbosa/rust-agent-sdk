// function: createAnalyzer
function createAnalyzer({
  isCaseSensitive = !1,
  ignoreDiacritics = !1
} = {}) {
  return {
    tokenize(text2) {
      if (!isCaseSensitive)
        text2 = text2.toLowerCase();
      if (ignoreDiacritics)
        text2 = stripDiacritics(text2);
      return text2.match(WORD) || [];
    }
  };
}
