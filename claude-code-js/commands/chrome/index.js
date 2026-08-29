// Original: src/commands/chrome/index.ts
var command18, chrome_default;
var init_chrome2 = __esm(() => {
  init_state();
  command18 = {
    name: "chrome",
    description: "Claude in Chrome (Beta) settings",
    availability: ["claude-ai"],
    isEnabled: () => !getIsNonInteractiveSession(),
    type: "local-jsx",
    load: () => Promise.resolve().then(() => (init_chrome(), exports_chrome))
  }, chrome_default = command18;
});
