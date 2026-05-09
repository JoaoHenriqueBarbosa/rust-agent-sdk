// Original: src/commands/compact/index.ts
var compact, compact_default;
var init_compact3 = __esm(() => {
  init_envUtils();
  compact = {
    type: "local",
    name: "compact",
    description: "Clear conversation history but keep a summary in context. Optional: /compact [instructions for summarization]",
    isEnabled: () => !isEnvTruthy(process.env.DISABLE_COMPACT),
    supportsNonInteractive: !0,
    argumentHint: "<optional custom summarization instructions>",
    load: () => Promise.resolve().then(() => (init_compact2(), exports_compact))
  }, compact_default = compact;
});
