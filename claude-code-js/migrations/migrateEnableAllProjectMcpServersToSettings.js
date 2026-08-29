// Original: src/migrations/migrateEnableAllProjectMcpServersToSettings.ts
function migrateEnableAllProjectMcpServersToSettings() {
  let projectConfig = getCurrentProjectConfig(), hasEnableAll = projectConfig.enableAllProjectMcpServers !== void 0, hasEnabledServers = projectConfig.enabledMcpjsonServers && projectConfig.enabledMcpjsonServers.length > 0, hasDisabledServers = projectConfig.disabledMcpjsonServers && projectConfig.disabledMcpjsonServers.length > 0;
  if (!hasEnableAll && !hasEnabledServers && !hasDisabledServers)
    return;
  try {
    let existingSettings = getSettingsForSource("localSettings") || {}, updates = {}, fieldsToRemove = [];
    if (hasEnableAll && existingSettings.enableAllProjectMcpServers === void 0)
      updates.enableAllProjectMcpServers = projectConfig.enableAllProjectMcpServers, fieldsToRemove.push("enableAllProjectMcpServers");
    else if (hasEnableAll)
      fieldsToRemove.push("enableAllProjectMcpServers");
    if (hasEnabledServers && projectConfig.enabledMcpjsonServers) {
      let existingEnabledServers = existingSettings.enabledMcpjsonServers || [];
      updates.enabledMcpjsonServers = [
        .../* @__PURE__ */ new Set([
          ...existingEnabledServers,
          ...projectConfig.enabledMcpjsonServers
        ])
      ], fieldsToRemove.push("enabledMcpjsonServers");
    }
    if (hasDisabledServers && projectConfig.disabledMcpjsonServers) {
      let existingDisabledServers = existingSettings.disabledMcpjsonServers || [];
      updates.disabledMcpjsonServers = [
        .../* @__PURE__ */ new Set([
          ...existingDisabledServers,
          ...projectConfig.disabledMcpjsonServers
        ])
      ], fieldsToRemove.push("disabledMcpjsonServers");
    }
    if (Object.keys(updates).length > 0)
      updateSettingsForSource("localSettings", updates);
    if (fieldsToRemove.includes("enableAllProjectMcpServers") || fieldsToRemove.includes("enabledMcpjsonServers") || fieldsToRemove.includes("disabledMcpjsonServers"))
      saveCurrentProjectConfig((current) => {
        let {
          enableAllProjectMcpServers: _enableAll,
          enabledMcpjsonServers: _enabledServers,
          disabledMcpjsonServers: _disabledServers,
          ...configWithoutFields
        } = current;
        return configWithoutFields;
      });
    logEvent("tengu_migrate_mcp_approval_fields_success", {
      migratedCount: fieldsToRemove.length
    });
  } catch (e) {
    logError2(e), logEvent("tengu_migrate_mcp_approval_fields_error", {});
  }
}
var init_migrateEnableAllProjectMcpServersToSettings = __esm(() => {
  init_config4();
  init_log3();
  init_settings2();
});
