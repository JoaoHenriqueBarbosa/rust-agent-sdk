// Original: src/ink/wrapAnsi.ts
var wrapAnsiBun, wrapAnsi2;
var init_wrapAnsi = __esm(() => {
  init_wrap_ansi();
  wrapAnsiBun = typeof Bun < "u" && typeof Bun.wrapAnsi === "function" ? Bun.wrapAnsi : null, wrapAnsi2 = wrapAnsiBun ?? wrapAnsi;
});
