// Original: src/commands/clear/index.ts
var clear, clear_default;
var init_clear2 = __esm(() => {
  clear = {
    type: "local",
    name: "clear",
    description: "Clear conversation history and free up context",
    aliases: ["reset", "new"],
    supportsNonInteractive: !1,
    load: () => Promise.resolve().then(() => (init_clear(), exports_clear))
  }, clear_default = clear;
});
