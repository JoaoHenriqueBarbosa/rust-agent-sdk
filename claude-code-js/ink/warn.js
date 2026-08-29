// Original: src/ink/warn.ts
function ifNotInteger(value, name3) {
  if (value === void 0)
    return;
  if (Number.isInteger(value))
    return;
  logForDebugging(`${name3} should be an integer, got ${value}`, {
    level: "warn"
  });
}
var init_warn = __esm(() => {
  init_debug();
});
