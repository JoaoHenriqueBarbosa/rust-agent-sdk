// Original: src/commands/files/index.ts
var files2, files_default;
var init_files5 = __esm(() => {
  files2 = {
    type: "local",
    name: "files",
    description: "List all files currently in context",
    isEnabled: () => !0,
    supportsNonInteractive: !0,
    load: () => Promise.resolve().then(() => (init_files4(), exports_files2))
  }, files_default = files2;
});
