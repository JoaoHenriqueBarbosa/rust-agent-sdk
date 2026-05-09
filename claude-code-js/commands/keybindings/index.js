// Original: src/commands/keybindings/index.ts
var keybindings, keybindings_default;
var init_keybindings2 = __esm(() => {
  keybindings = {
    name: "keybindings",
    description: "Open or create your keybindings configuration file",
    isEnabled: () => !0,
    supportsNonInteractive: !1,
    type: "local",
    load: () => Promise.resolve().then(() => (init_keybindings(), exports_keybindings))
  }, keybindings_default = keybindings;
});
