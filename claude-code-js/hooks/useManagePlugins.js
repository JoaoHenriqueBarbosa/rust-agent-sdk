// Original: src/hooks/useManagePlugins.ts
function useManagePlugins({
  enabled: enabled2 = !0
} = {}) {
  let setAppState = useSetAppState(), needsRefresh = useAppState((s2) => s2.plugins.needsRefresh), { addNotification } = useNotifications(), initialPluginLoad = import_react274.useCallback(async () => {
    try {
      let { enabled: enabled3, disabled, errors: errors8 } = await loadAllPlugins();
      await detectAndUninstallDelistedPlugins();
      let flagged = getFlaggedPlugins();
      if (Object.keys(flagged).length > 0)
        addNotification({
          key: "plugin-delisted-flagged",
          text: "Plugins flagged. Check /plugins",
          color: "warning",
          priority: "high"
        });
      let commands7 = [], agents2 = [];
      try {
        commands7 = await getPluginCommands();
      } catch (error44) {
        let errorMessage4 = error44 instanceof Error ? error44.message : String(error44);
        errors8.push({
          type: "generic-error",
          source: "plugin-commands",
          error: `Failed to load plugin commands: ${errorMessage4}`
        });
      }
      try {
        agents2 = await loadPluginAgents();
      } catch (error44) {
        let errorMessage4 = error44 instanceof Error ? error44.message : String(error44);
        errors8.push({
          type: "generic-error",
          source: "plugin-agents",
          error: `Failed to load plugin agents: ${errorMessage4}`
        });
      }
      try {
        await loadPluginHooks();
      } catch (error44) {
        let errorMessage4 = error44 instanceof Error ? error44.message : String(error44);
        errors8.push({
          type: "generic-error",
          source: "plugin-hooks",
          error: `Failed to load plugin hooks: ${errorMessage4}`
        });
      }
      let mcp_count = (await Promise.all(enabled3.map(async (p4) => {
        if (p4.mcpServers)
          return Object.keys(p4.mcpServers).length;
        let servers = await loadPluginMcpServers(p4, errors8);
        if (servers)
          p4.mcpServers = servers;
        return servers ? Object.keys(servers).length : 0;
      }))).reduce((sum, n6) => sum + n6, 0), lsp_count = (await Promise.all(enabled3.map(async (p4) => {
        if (p4.lspServers)
          return Object.keys(p4.lspServers).length;
        let servers = await loadPluginLspServers(p4, errors8);
        if (servers)
          p4.lspServers = servers;
        return servers ? Object.keys(servers).length : 0;
      }))).reduce((sum, n6) => sum + n6, 0);
      reinitializeLspServerManager(), setAppState((prevState) => {
        let existingLspErrors = prevState.plugins.errors.filter((e) => e.source === "lsp-manager" || e.source.startsWith("plugin:")), newErrorKeys = new Set(errors8.map((e) => e.type === "generic-error" ? `generic-error:${e.source}:${e.error}` : `${e.type}:${e.source}`)), mergedErrors = [...existingLspErrors.filter((e) => {
          let key3 = e.type === "generic-error" ? `generic-error:${e.source}:${e.error}` : `${e.type}:${e.source}`;
          return !newErrorKeys.has(key3);
        }), ...errors8];
        return {
          ...prevState,
          plugins: {
            ...prevState.plugins,
            enabled: enabled3,
            disabled,
            commands: commands7,
            errors: mergedErrors
          }
        };
      }), logForDebugging(`Loaded plugins - Enabled: ${enabled3.length}, Disabled: ${disabled.length}, Commands: ${commands7.length}, Agents: ${agents2.length}, Errors: ${errors8.length}`);
      let hook_count = enabled3.reduce((sum, p4) => {
        if (!p4.hooksConfig)
          return sum;
        return sum + Object.values(p4.hooksConfig).reduce((s2, matchers) => s2 + (matchers?.reduce((h4, m4) => h4 + m4.hooks.length, 0) ?? 0), 0);
      }, 0);
      return {
        enabled_count: enabled3.length,
        disabled_count: disabled.length,
        inline_count: count2(enabled3, (p4) => p4.source.endsWith("@inline")),
        marketplace_count: count2(enabled3, (p4) => !p4.source.endsWith("@inline")),
        error_count: errors8.length,
        skill_count: commands7.length,
        agent_count: agents2.length,
        hook_count,
        mcp_count,
        lsp_count
      };
    } catch (error44) {
      let errorObj = toError(error44);
      return logError2(errorObj), logForDebugging(`Error loading plugins: ${error44}`), setAppState((prevState) => {
        let existingLspErrors = prevState.plugins.errors.filter((e) => e.source === "lsp-manager" || e.source.startsWith("plugin:")), newError = {
          type: "generic-error",
          source: "plugin-system",
          error: errorObj.message
        };
        return {
          ...prevState,
          plugins: {
            ...prevState.plugins,
            enabled: [],
            disabled: [],
            commands: [],
            errors: [...existingLspErrors, newError]
          }
        };
      }), {
        enabled_count: 0,
        disabled_count: 0,
        inline_count: 0,
        marketplace_count: 0,
        error_count: 1,
        skill_count: 0,
        agent_count: 0,
        hook_count: 0,
        mcp_count: 0,
        lsp_count: 0,
        load_failed: !0,
        ant_enabled_names: void 0
      };
    }
  }, [setAppState, addNotification]);
  import_react274.useEffect(() => {
    if (!enabled2)
      return;
    initialPluginLoad().then((metrics) => {
      let { ant_enabled_names, ...baseMetrics } = metrics, allMetrics = {
        ...baseMetrics,
        has_custom_plugin_cache_dir: !!process.env.CLAUDE_CODE_PLUGIN_CACHE_DIR
      };
      logEvent("tengu_plugins_loaded", {
        ...allMetrics,
        ...ant_enabled_names !== void 0 && {
          enabled_names: ant_enabled_names
        }
      }), logForDiagnosticsNoPII("info", "tengu_plugins_loaded", allMetrics);
    });
  }, [initialPluginLoad, enabled2]), import_react274.useEffect(() => {
    if (!enabled2 || !needsRefresh)
      return;
    addNotification({
      key: "plugin-reload-pending",
      text: "Plugins changed. Run /reload-plugins to activate.",
      color: "suggestion",
      priority: "low"
    });
  }, [enabled2, needsRefresh, addNotification]);
}
var import_react274;
var init_useManagePlugins = __esm(() => {
  init_notifications();
  init_manager7();
  init_AppState();
  init_debug();
  init_diagLogs();
  init_errors();
  init_log3();
  init_loadPluginAgents();
  init_loadPluginCommands();
  init_loadPluginHooks();
  init_lspPluginIntegration();
  init_mcpPluginIntegration();
  init_pluginBlocklist();
  init_pluginFlagging();
  init_pluginLoader();
  import_react274 = __toESM(require_react_development(), 1);
});
