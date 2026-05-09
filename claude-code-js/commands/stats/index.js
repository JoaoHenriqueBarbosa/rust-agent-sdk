// Original: src/commands/stats/index.ts
var stats, stats_default;
var init_stats3 = __esm(() => {
  stats = {
    type: "local-jsx",
    name: "stats",
    description: "Show your Claude Code usage statistics and activity",
    load: () => Promise.resolve().then(() => (init_stats2(), exports_stats))
  }, stats_default = stats;
});
