// Original: src/commands/tag/index.ts
var tag2, tag_default;
var init_tag2 = __esm(() => {
  tag2 = {
    type: "local-jsx",
    name: "tag",
    description: "Toggle a searchable tag on the current session",
    isEnabled: () => !0,
    argumentHint: "<tag-name>",
    load: () => Promise.resolve().then(() => (init_tag(), exports_tag))
  }, tag_default = tag2;
});
