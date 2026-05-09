// Original: src/commands/config/index.ts
var config10, config_default;
var init_config14 = __esm(() => {
  config10 = {
    aliases: ["settings"],
    type: "local-jsx",
    name: "config",
    description: "Open config panel",
    load: () => Promise.resolve().then(() => (init_config13(), exports_config2))
  }, config_default = config10;
});
