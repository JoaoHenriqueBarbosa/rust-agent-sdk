// Original: src/utils/shell/resolveDefaultShell.ts
function resolveDefaultShell() {
  return getInitialSettings().defaultShell ?? "bash";
}
var init_resolveDefaultShell = __esm(() => {
  init_settings2();
});
