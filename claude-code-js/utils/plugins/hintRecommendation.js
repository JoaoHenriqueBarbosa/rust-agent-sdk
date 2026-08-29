// Original: src/utils/plugins/hintRecommendation.ts
function maybeRecordPluginHint(hint) {
  return;
}
async function resolvePluginHint(hint) {
  let pluginId = hint.value, { name: name3, marketplace } = parsePluginIdentifier(pluginId), pluginData = await getPluginById(pluginId);
  if (logEvent("tengu_plugin_hint_detected", {
    _PROTO_plugin_name: name3 ?? "",
    _PROTO_marketplace_name: marketplace ?? "",
    result: pluginData ? "passed" : "not_in_cache"
  }), !pluginData)
    return logForDebugging(`[hintRecommendation] ${pluginId} not found in marketplace cache`), null;
  return {
    pluginId,
    pluginName: pluginData.entry.name,
    marketplaceName: marketplace ?? "",
    pluginDescription: pluginData.entry.description,
    sourceCommand: hint.sourceCommand
  };
}
function markHintPluginShown(pluginId) {
  saveGlobalConfig((current) => {
    let existing = current.claudeCodeHints?.plugin ?? [];
    if (existing.includes(pluginId))
      return current;
    return {
      ...current,
      claudeCodeHints: {
        ...current.claudeCodeHints,
        plugin: [...existing, pluginId]
      }
    };
  });
}
function disableHintRecommendations() {
  saveGlobalConfig((current) => {
    if (current.claudeCodeHints?.disabled)
      return current;
    return {
      ...current,
      claudeCodeHints: { ...current.claudeCodeHints, disabled: !0 }
    };
  });
}
var MAX_SHOWN_PLUGINS = 100, triedThisSession;
var init_hintRecommendation = __esm(() => {
  init_claudeCodeHints();
  init_config4();
  init_debug();
  init_installedPluginsManager();
  init_marketplaceManager();
  init_pluginIdentifier();
  init_pluginPolicy();
  triedThisSession = /* @__PURE__ */ new Set;
});
