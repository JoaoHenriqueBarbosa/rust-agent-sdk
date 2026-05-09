// Original: src/commands/vim/index.ts
var command16, vim_default;
var init_vim2 = __esm(() => {
  command16 = {
    name: "vim",
    description: "Toggle between Vim and Normal editing modes",
    supportsNonInteractive: !1,
    type: "local",
    load: () => Promise.resolve().then(() => (init_vim(), exports_vim))
  }, vim_default = command16;
});
