// Original: src/commands/desktop/index.ts
function isSupportedPlatform3() {
  if (process.platform === "darwin")
    return !0;
  if (process.platform === "win32" && process.arch === "x64")
    return !0;
  return !1;
}
var desktop, desktop_default;
var init_desktop2 = __esm(() => {
  desktop = {
    type: "local-jsx",
    name: "desktop",
    aliases: ["app"],
    description: "Continue the current session in Claude Desktop",
    availability: ["claude-ai"],
    isEnabled: isSupportedPlatform3,
    get isHidden() {
      return !isSupportedPlatform3();
    },
    load: () => Promise.resolve().then(() => (init_desktop(), exports_desktop))
  }, desktop_default = desktop;
});
