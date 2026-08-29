// Original: src/commands/reload-plugins/index.ts
var reloadPlugins, reload_plugins_default;
var init_reload_plugins2 = __esm(() => {
  reloadPlugins = {
    type: "local",
    name: "reload-plugins",
    description: "Activate pending plugin changes in the current session",
    supportsNonInteractive: !1,
    load: () => Promise.resolve().then(() => (init_reload_plugins(), exports_reload_plugins))
  }, reload_plugins_default = reloadPlugins;
});
