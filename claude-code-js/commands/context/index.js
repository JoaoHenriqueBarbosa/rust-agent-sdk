// Original: src/commands/context/index.ts
var context6, contextNonInteractive;
var init_context4 = __esm(() => {
  init_state();
  context6 = {
    name: "context",
    description: "Visualize current context usage as a colored grid",
    isEnabled: () => !getIsNonInteractiveSession(),
    type: "local-jsx",
    load: () => Promise.resolve().then(() => (init_context3(), exports_context))
  }, contextNonInteractive = {
    type: "local",
    name: "context",
    supportsNonInteractive: !0,
    description: "Show current context usage",
    get isHidden() {
      return !getIsNonInteractiveSession();
    },
    isEnabled() {
      return getIsNonInteractiveSession();
    },
    load: () => Promise.resolve().then(() => (init_context_noninteractive(), exports_context_noninteractive))
  };
});
