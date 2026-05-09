// Original: src/utils/plugins/managedPlugins.ts
function getManagedPluginNames() {
  let enabledPlugins = getSettingsForSource("policySettings")?.enabledPlugins;
  if (!enabledPlugins)
    return null;
  let names = /* @__PURE__ */ new Set;
  for (let [pluginId, value] of Object.entries(enabledPlugins)) {
    if (typeof value !== "boolean" || !pluginId.includes("@"))
      continue;
    let name3 = pluginId.split("@")[0];
    if (name3)
      names.add(name3);
  }
  return names.size > 0 ? names : null;
}
var init_managedPlugins = __esm(() => {
  init_settings2();
});
