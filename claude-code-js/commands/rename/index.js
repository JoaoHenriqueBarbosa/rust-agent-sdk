// Original: src/commands/rename/index.ts
var rename9, rename_default;
var init_rename2 = __esm(() => {
  rename9 = {
    type: "local-jsx",
    name: "rename",
    description: "Rename the current conversation",
    immediate: !0,
    argumentHint: "[name]",
    load: () => Promise.resolve().then(() => (init_rename(), exports_rename))
  }, rename_default = rename9;
});
