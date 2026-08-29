// var: init_escape
var init_escape = __esm(() => {
  SPECIAL_CHAR_REGEXP = getSpecialCharRegExp(), COMMON_ESCAPES = {
    " ": " ",
    "\b": "\\b",
    "\f": "\\f",
    "\n": "\\n",
    "\r": "\\r",
    "\t": "\\t"
  }, NO_ESCAPE_REGEXP = /^[\w./-]+$/;
});
