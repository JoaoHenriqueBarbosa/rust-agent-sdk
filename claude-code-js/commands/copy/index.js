// Original: src/commands/copy/index.ts
var copy, copy_default;
var init_copy2 = __esm(() => {
  copy = {
    type: "local-jsx",
    name: "copy",
    description: "Copy Claude's last response to clipboard (or /copy N for the Nth-latest)",
    load: () => Promise.resolve().then(() => (init_copy(), exports_copy))
  }, copy_default = copy;
});
