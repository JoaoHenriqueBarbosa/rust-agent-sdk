// Original: src/utils/plugins/pluginIdentifier.ts
function parsePluginIdentifier(plugin) {
  if (plugin.includes("@")) {
    let parts = plugin.split("@");
    return { name: parts[0] || "", marketplace: parts[1] };
  }
  return { name: plugin };
}
function isOfficialMarketplaceName(marketplace) {
  return marketplace !== void 0 && ALLOWED_OFFICIAL_MARKETPLACE_NAMES.has(marketplace.toLowerCase());
}
function scopeToSettingSource(scope) {
  if (scope === "managed")
    throw Error("Cannot install plugins to managed scope");
  return SCOPE_TO_EDITABLE_SOURCE[scope];
}
function settingSourceToScope(source) {
  return SETTING_SOURCE_TO_SCOPE[source];
}
var SETTING_SOURCE_TO_SCOPE, SCOPE_TO_EDITABLE_SOURCE;
var init_pluginIdentifier = __esm(() => {
  init_schemas3();
  SETTING_SOURCE_TO_SCOPE = {
    policySettings: "managed",
    userSettings: "user",
    projectSettings: "project",
    localSettings: "local",
    flagSettings: "flag"
  };
  SCOPE_TO_EDITABLE_SOURCE = {
    user: "userSettings",
    project: "projectSettings",
    local: "localSettings"
  };
});
