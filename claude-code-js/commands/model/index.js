// Original: src/commands/model/index.ts
var model_default;
var init_model3 = __esm(() => {
  init_model();
  model_default = {
    type: "local-jsx",
    name: "model",
    get description() {
      return `Set the AI model for Claude Code (currently ${renderModelName(getMainLoopModel())})`;
    },
    argumentHint: "[model]",
    get immediate() {
      return shouldInferenceConfigCommandBeImmediate();
    },
    load: () => Promise.resolve().then(() => (init_model2(), exports_model))
  };
});
