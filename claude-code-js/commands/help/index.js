// Original: src/commands/help/index.ts
var help, help_default;
var init_help2 = __esm(() => {
  help = {
    type: "local-jsx",
    name: "help",
    description: "Show help and available commands",
    load: () => Promise.resolve().then(() => (init_help(), exports_help))
  }, help_default = help;
});
