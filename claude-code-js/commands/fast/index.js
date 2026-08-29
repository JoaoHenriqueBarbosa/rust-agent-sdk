// Original: src/commands/fast/index.ts
var fast, fast_default;
var init_fast2 = __esm(() => {
  init_fastMode();
  fast = {
    type: "local-jsx",
    name: "fast",
    get description() {
      return `Toggle fast mode (${FAST_MODE_MODEL_DISPLAY} only)`;
    },
    availability: ["claude-ai", "console"],
    isEnabled: () => isFastModeEnabled(),
    get isHidden() {
      return !isFastModeEnabled();
    },
    argumentHint: "[on|off]",
    get immediate() {
      return shouldInferenceConfigCommandBeImmediate();
    },
    load: () => Promise.resolve().then(() => (init_fast(), exports_fast))
  }, fast_default = fast;
});
