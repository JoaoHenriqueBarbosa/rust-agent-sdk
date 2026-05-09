// Original: src/commands/ide/index.ts
var ide, ide_default;
var init_ide3 = __esm(() => {
  ide = {
    type: "local-jsx",
    name: "ide",
    description: "Manage IDE integrations and show status",
    argumentHint: "[open]",
    load: () => Promise.resolve().then(() => (init_ide2(), exports_ide))
  }, ide_default = ide;
});
