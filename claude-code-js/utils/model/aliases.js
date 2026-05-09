// Original: src/utils/model/aliases.ts
function isModelAlias(modelInput) {
  return MODEL_ALIASES.includes(modelInput);
}
var MODEL_ALIASES;
var init_aliases = __esm(() => {
  MODEL_ALIASES = [
    "sonnet",
    "opus",
    "haiku",
    "best",
    "sonnet[1m]",
    "opus[1m]",
    "opusplan"
  ];
});
