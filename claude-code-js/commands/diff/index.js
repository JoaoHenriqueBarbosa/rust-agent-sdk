// Original: src/commands/diff/index.ts
var diff_default;
var init_diff4 = __esm(() => {
  diff_default = {
    type: "local-jsx",
    name: "diff",
    description: "View uncommitted changes and per-turn diffs",
    load: () => Promise.resolve().then(() => (init_diff3(), exports_diff))
  };
});
