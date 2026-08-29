// Original: src/commands/terminalSetup/index.ts
var NATIVE_CSIU_TERMINALS2, terminalSetup, terminalSetup_default;
var init_terminalSetup2 = __esm(() => {
  init_env();
  NATIVE_CSIU_TERMINALS2 = {
    ghostty: "Ghostty",
    kitty: "Kitty",
    "iTerm.app": "iTerm2",
    WezTerm: "WezTerm"
  }, terminalSetup = {
    type: "local-jsx",
    name: "terminal-setup",
    description: env3.terminal === "Apple_Terminal" ? "Enable Option+Enter key binding for newlines and visual bell" : "Install Shift+Enter key binding for newlines",
    isHidden: env3.terminal !== null && env3.terminal in NATIVE_CSIU_TERMINALS2,
    load: () => Promise.resolve().then(() => (init_terminalSetup(), exports_terminalSetup))
  }, terminalSetup_default = terminalSetup;
});
