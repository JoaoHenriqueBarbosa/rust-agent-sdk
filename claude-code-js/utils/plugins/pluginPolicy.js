// Original: src/utils/plugins/pluginPolicy.ts
function isPluginBlockedByPolicy(pluginId) {
  return getSettingsForSource("policySettings")?.enabledPlugins?.[pluginId] === !1;
}
var init_pluginPolicy = __esm(() => {
  init_settings2();
});
