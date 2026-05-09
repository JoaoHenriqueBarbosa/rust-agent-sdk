// Original: src/commands/plugin/index.tsx
var plugin, plugin_default;
var init_plugin2 = __esm(() => {
  plugin = {
    type: "local-jsx",
    name: "plugin",
    aliases: ["plugins", "marketplace"],
    description: "Manage Claude Code plugins",
    immediate: !0,
    load: () => Promise.resolve().then(() => (init_plugin(), exports_plugin))
  }, plugin_default = plugin;
});
