// Original: src/commands/export/index.ts
var exportCommand, export_default;
var init_export2 = __esm(() => {
  exportCommand = {
    type: "local-jsx",
    name: "export",
    description: "Export the current conversation to a file or clipboard",
    argumentHint: "[filename]",
    load: () => Promise.resolve().then(() => (init_export(), exports_export))
  }, export_default = exportCommand;
});
