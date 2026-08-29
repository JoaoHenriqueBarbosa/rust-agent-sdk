// Original: src/ink/termio/csi.ts
function isCSIParam(byte) {
  return byte >= CSI_RANGE.PARAM_START && byte <= CSI_RANGE.PARAM_END;
}
function isCSIIntermediate(byte) {
  return byte >= CSI_RANGE.INTERMEDIATE_START && byte <= CSI_RANGE.INTERMEDIATE_END;
}
function isCSIFinal(byte) {
  return byte >= CSI_RANGE.FINAL_START && byte <= CSI_RANGE.FINAL_END;
}
function csi(...args) {
  if (args.length === 0)
    return CSI_PREFIX;
  if (args.length === 1)
    return `${CSI_PREFIX}${args[0]}`;
  let params = args.slice(0, -1), final = args[args.length - 1];
  return `${CSI_PREFIX}${params.join(SEP)}${final}`;
}
function cursorUp(n5 = 1) {
  return n5 === 0 ? "" : csi(n5, "A");
}
function cursorDown(n5 = 1) {
  return n5 === 0 ? "" : csi(n5, "B");
}
function cursorForward(n5 = 1) {
  return n5 === 0 ? "" : csi(n5, "C");
}
function cursorBack(n5 = 1) {
  return n5 === 0 ? "" : csi(n5, "D");
}
function cursorTo(col) {
  return csi(col, "G");
}
function cursorPosition(row, col) {
  return csi(row, col, "H");
}
function cursorMove(x3, y2) {
  let result = "";
  if (x3 < 0)
    result += cursorBack(-x3);
  else if (x3 > 0)
    result += cursorForward(x3);
  if (y2 < 0)
    result += cursorUp(-y2);
  else if (y2 > 0)
    result += cursorDown(y2);
  return result;
}
function eraseLines(n5) {
  if (n5 <= 0)
    return "";
  let result = "";
  for (let i4 = 0;i4 < n5; i4++)
    if (result += ERASE_LINE, i4 < n5 - 1)
      result += cursorUp(1);
  return result += CURSOR_LEFT, result;
}
function scrollUp(n5 = 1) {
  return n5 === 0 ? "" : csi(n5, "S");
}
function scrollDown(n5 = 1) {
  return n5 === 0 ? "" : csi(n5, "T");
}
function setScrollRegion(top, bottom) {
  return csi(top, bottom, "r");
}
var CSI_PREFIX, CSI_RANGE, CSI, ERASE_DISPLAY, ERASE_LINE_REGION, CURSOR_STYLES, CURSOR_LEFT, CURSOR_HOME, CURSOR_SAVE, CURSOR_RESTORE, ERASE_LINE, ERASE_SCREEN, ERASE_SCROLLBACK, RESET_SCROLL_REGION, PASTE_START, PASTE_END, FOCUS_IN, FOCUS_OUT, ENABLE_KITTY_KEYBOARD, DISABLE_KITTY_KEYBOARD, ENABLE_MODIFY_OTHER_KEYS, DISABLE_MODIFY_OTHER_KEYS;
var init_csi = __esm(() => {
  init_ansi();
  CSI_PREFIX = ESC + String.fromCharCode(ESC_TYPE.CSI), CSI_RANGE = {
    PARAM_START: 48,
    PARAM_END: 63,
    INTERMEDIATE_START: 32,
    INTERMEDIATE_END: 47,
    FINAL_START: 64,
    FINAL_END: 126
  };
  CSI = {
    CUU: 65,
    CUD: 66,
    CUF: 67,
    CUB: 68,
    CNL: 69,
    CPL: 70,
    CHA: 71,
    CUP: 72,
    CHT: 73,
    VPA: 100,
    HVP: 102,
    ED: 74,
    EL: 75,
    ECH: 88,
    IL: 76,
    DL: 77,
    ICH: 64,
    DCH: 80,
    SU: 83,
    SD: 84,
    SM: 104,
    RM: 108,
    SGR: 109,
    DSR: 110,
    DECSCUSR: 113,
    DECSTBM: 114,
    SCOSC: 115,
    SCORC: 117,
    CBT: 90
  }, ERASE_DISPLAY = ["toEnd", "toStart", "all", "scrollback"], ERASE_LINE_REGION = ["toEnd", "toStart", "all"], CURSOR_STYLES = [
    { style: "block", blinking: !0 },
    { style: "block", blinking: !0 },
    { style: "block", blinking: !1 },
    { style: "underline", blinking: !0 },
    { style: "underline", blinking: !1 },
    { style: "bar", blinking: !0 },
    { style: "bar", blinking: !1 }
  ];
  CURSOR_LEFT = csi("G");
  CURSOR_HOME = csi("H");
  CURSOR_SAVE = csi("s"), CURSOR_RESTORE = csi("u"), ERASE_LINE = csi(2, "K"), ERASE_SCREEN = csi(2, "J"), ERASE_SCROLLBACK = csi(3, "J");
  RESET_SCROLL_REGION = csi("r"), PASTE_START = csi("200~"), PASTE_END = csi("201~"), FOCUS_IN = csi("I"), FOCUS_OUT = csi("O"), ENABLE_KITTY_KEYBOARD = csi(">1u"), DISABLE_KITTY_KEYBOARD = csi("<u"), ENABLE_MODIFY_OTHER_KEYS = csi(">4;2m"), DISABLE_MODIFY_OTHER_KEYS = csi(">4m");
});
