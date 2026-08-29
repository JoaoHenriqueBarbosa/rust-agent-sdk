// Original: src/commands/add-dir/index.ts
var addDir, add_dir_default;
var init_add_dir2 = __esm(() => {
  addDir = {
    type: "local-jsx",
    name: "add-dir",
    description: "Add a new working directory",
    argumentHint: "<path>",
    load: () => Promise.resolve().then(() => (init_add_dir(), exports_add_dir))
  }, add_dir_default = addDir;
});
