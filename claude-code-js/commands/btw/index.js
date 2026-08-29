// Original: src/commands/btw/index.ts
var btw, btw_default;
var init_btw2 = __esm(() => {
  btw = {
    type: "local-jsx",
    name: "btw",
    description: "Ask a quick side question without interrupting the main conversation",
    immediate: !0,
    argumentHint: "<question>",
    load: () => Promise.resolve().then(() => (init_btw(), exports_btw))
  }, btw_default = btw;
});
