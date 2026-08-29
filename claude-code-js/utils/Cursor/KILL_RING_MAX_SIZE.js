// var: KILL_RING_MAX_SIZE
var KILL_RING_MAX_SIZE = 10, killRing, killRingIndex = 0, lastActionWasKill = !1, lastYankStart = 0, lastYankLength = 0, lastActionWasYank = !1, VIM_WORD_CHAR_REGEX, WHITESPACE_REGEX2, isVimWordChar = (ch2) => VIM_WORD_CHAR_REGEX.test(ch2), isVimWhitespace = (ch2) => WHITESPACE_REGEX2.test(ch2), isVimPunctuation = (ch2) => ch2.length > 0 && !isVimWhitespace(ch2) && !isVimWordChar(ch2);
var init_Cursor = __esm(() => {
  init_stringWidth();
  init_wrapAnsi();
  init_intl();
  killRing = [];
  VIM_WORD_CHAR_REGEX = /^[\p{L}\p{N}\p{M}_]$/u, WHITESPACE_REGEX2 = /\s/;
});
