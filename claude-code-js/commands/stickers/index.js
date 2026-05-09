// Original: src/commands/stickers/index.ts
var stickers, stickers_default;
var init_stickers2 = __esm(() => {
  stickers = {
    type: "local",
    name: "stickers",
    description: "Order Claude Code stickers",
    supportsNonInteractive: !1,
    load: () => Promise.resolve().then(() => (init_stickers(), exports_stickers))
  }, stickers_default = stickers;
});
