// Original: src/utils/plugins/refresh.ts
async function refreshActivePlugins(setAppState) {
  logForDebugging("refreshActivePlugins: clearing all plugin caches"), clearAllCaches(), clearPluginCacheExclusions();
  let pluginResult = await loadAllPlugins(), [pluginCommands, agentDefinitions] = await Promise.all([
    getPluginCommands(),
    getAgentDefinitionsWithOverrides(getOriginalCwd())
  ]), { enabled: enabled2, disabled, errors: errors8 } = pluginResult, [mcpCounts, lspCounts] = await Promise.all([
    Promise.all(enabled2.map(async (p4) => {
      if (p4.mcpServers)
        return Object.keys(p4.mcpServers).length;
      let servers = await loadPluginMcpServers(p4, errors8);
      if (servers)
        p4.mcpServers = servers;
      return servers ? Object.keys(servers).length : 0;
    })),
    Promise.all(enabled2.map(async (p4) => {
      if (p4.lspServers)
        return Object.keys(p4.lspServers).length;
      let servers = await loadPluginLspServers(p4, errors8);
      if (servers)
        p4.lspServers = servers;
      return servers ? Object.keys(servers).length : 0;
    }))
  ]), mcp_count = mcpCounts.reduce((sum, n5) => sum + n5, 0), lsp_count = lspCounts.reduce((sum, n5) => sum + n5, 0);
  setAppState((prev) => ({
    ...prev,
    plugins: {
      ...prev.plugins,
      enabled: enabled2,
      disabled,
      commands: pluginCommands,
      errors: mergePluginErrors(prev.plugins.errors, errors8),
      needsRefresh: !1
    },
    agentDefinitions,
    mcp: {
      ...prev.mcp,
      pluginReconnectKey: prev.mcp.pluginReconnectKey + 1
    }
  })), reinitializeLspServerManager();
  let hook_load_failed = !1;
  try {
    await loadPluginHooks();
  } catch (e) {
    hook_load_failed = !0, logError2(e), logForDebugging(`refreshActivePlugins: loadPluginHooks failed: ${errorMessage(e)}`);
  }
  let hook_count = enabled2.reduce((sum, p4) => {
    if (!p4.hooksConfig)
      return sum;
    return sum + Object.values(p4.hooksConfig).reduce((s2, matchers) => s2 + (matchers?.reduce((h4, m4) => h4 + m4.hooks.length, 0) ?? 0), 0);
  }, 0);
  return logForDebugging(`refreshActivePlugins: ${enabled2.length} enabled, ${pluginCommands.length} commands, ${agentDefinitions.allAgents.length} agents, ${hook_count} hooks, ${mcp_count} MCP, ${lsp_count} LSP`), {
    enabled_count: enabled2.length,
    disabled_count: disabled.length,
    command_count: pluginCommands.length,
    agent_count: agentDefinitions.allAgents.length,
    hook_count,
    mcp_count,
    lsp_count,
    error_count: errors8.length + (hook_load_failed ? 1 : 0),
    agentDefinitions,
    pluginCommands
  };
}
function mergePluginErrors(existing, fresh) {
  let preserved = existing.filter((e) => e.source === "lsp-manager" || e.source.startsWith("plugin:")), freshKeys = new Set(fresh.map(errorKey));
  return [...preserved.filter((e) => !freshKeys.has(errorKey(e))), ...fresh];
}
function errorKey(e) {
  return e.type === "generic-error" ? `generic-error:${e.source}:${e.error}` : `${e.type}:${e.source}`;
}
var init_refresh = __esm(() => {
  init_state();
  init_manager7();
  init_loadAgentsDir();
  init_debug();
  init_errors();
  init_log3();
  init_cacheUtils();
  init_loadPluginCommands();
  init_loadPluginHooks();
  init_lspPluginIntegration();
  init_mcpPluginIntegration();
  init_orphanedPluginFilter();
  init_pluginLoader();
});
