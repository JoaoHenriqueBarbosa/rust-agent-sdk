// Original: src/utils/tokenBudget.ts
var VERBOSE_RE, VERBOSE_RE_G;
var init_tokenBudget = __esm(() => {
  VERBOSE_RE = /\b(?:use|spend)\s+(\d+(?:\.\d+)?)\s*(k|m|b)\s*tokens?\b/i, VERBOSE_RE_G = new RegExp(VERBOSE_RE.source, "gi");
});
