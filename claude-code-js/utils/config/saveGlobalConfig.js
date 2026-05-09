// function: saveGlobalConfig
function saveGlobalConfig(updater) {
  let written = null;
  try {
    if (saveConfigWithLock(getGlobalClaudeFile(), createDefaultGlobalConfig, (current) => {
      let config5 = updater(current);
      if (config5 === current)
        return current;
      return written = {
        ...config5,
        projects: removeProjectHistory(current.projects)
      }, written;
    }) && written)
      writeThroughGlobalConfigCache(written);
  } catch (error41) {
    logForDebugging(`Failed to save config with lock: ${error41}`, {
      level: "error"
    });
    let currentConfig = getConfig(getGlobalClaudeFile(), createDefaultGlobalConfig);
    if (wouldLoseAuthState(currentConfig)) {
      logForDebugging("saveGlobalConfig fallback: re-read config is missing auth that cache has; refusing to write. See GH #3117.", { level: "error" }), logEvent("tengu_config_auth_loss_prevented", {});
      return;
    }
    let config5 = updater(currentConfig);
    if (config5 === currentConfig)
      return;
    written = {
      ...config5,
      projects: removeProjectHistory(currentConfig.projects)
    }, saveConfig(getGlobalClaudeFile(), written, DEFAULT_GLOBAL_CONFIG), writeThroughGlobalConfigCache(written);
  }
}
