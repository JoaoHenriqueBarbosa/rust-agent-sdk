// Original: src/utils/keyboardShortcuts.ts
function isMacosOptionChar(char) {
  return char in MACOS_OPTION_SPECIAL_CHARS;
}
var MACOS_OPTION_SPECIAL_CHARS;
var init_keyboardShortcuts = __esm(() => {
  MACOS_OPTION_SPECIAL_CHARS = {
    "\u2020": "alt+t",
    \u{3c0}: "alt+p",
    \u{f8}: "alt+o"
  };
});