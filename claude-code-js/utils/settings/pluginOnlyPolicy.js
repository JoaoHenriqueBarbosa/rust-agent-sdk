// Original: src/utils/settings/pluginOnlyPolicy.ts
function isRestrictedToPluginOnly(surface) {
  let policy = getSettingsForSource("policySettings")?.strictPluginOnlyCustomization;
  if (policy === !0)
    return !0;
  if (Array.isArray(policy))
    return policy.includes(surface);
  return !1;
}
function isSourceAdminTrusted(source) {
  return source !== void 0 && ADMIN_TRUSTED_SOURCES.has(source);
}
var ADMIN_TRUSTED_SOURCES;
var init_pluginOnlyPolicy = __esm(() => {
  init_settings2();
  ADMIN_TRUSTED_SOURCES = /* @__PURE__ */ new Set([
    "plugin",
    "policySettings",
    "built-in",
    "builtin",
    "bundled"
  ]);
});
