// var: init_screen
var init_screen = __esm(() => {
  init_build();
  init_geometry();
  init_ansi();
  init_warn();
  INVERSE_CODE = {
    type: "ansi",
    code: "\x1B[7m",
    endCode: "\x1B[27m"
  }, BOLD_CODE = {
    type: "ansi",
    code: "\x1B[1m",
    endCode: "\x1B[22m"
  }, UNDERLINE_CODE = {
    type: "ansi",
    code: "\x1B[4m",
    endCode: "\x1B[24m"
  }, YELLOW_FG_CODE = {
    type: "ansi",
    code: "\x1B[33m",
    endCode: "\x1B[39m"
  };
  VISIBLE_ON_SPACE = /* @__PURE__ */ new Set([
    "\x1B[49m",
    "\x1B[27m",
    "\x1B[24m",
    "\x1B[29m",
    "\x1B[55m"
  ]);
  OSC8_REGEX = new RegExp(`^${ESC}\\]8${SEP}${SEP}([^${BEL}]*)${BEL}$`), OSC8_PREFIX = `${ESC}]8${SEP}`;
});
