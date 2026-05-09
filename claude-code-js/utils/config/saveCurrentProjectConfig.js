// function: saveCurrentProjectConfig
function saveCurrentProjectConfig(updater) {
  let absolutePath = getProjectPathForConfig(), written = null;
  try {
    if (saveConfigWithLock(getGlobalClaudeFile(), createDefaultGlobalConfig, (current) => {
      let currentProjectConfig = current.projects?.[absolutePath] ?? DEFAULT_PROJECT_CONFIG, newProjectConfig = updater(currentProjectConfig);
      if (newProjectConfig === currentProjectConfig)
        return current;
      return written = {
        ...current,
        projects: {
          ...current.projects,
          [absolutePath]: newProjectConfig
        }
      }, written;
    }) && written)
      writeThroughGlobalConfigCache(written);
  } catch (error41) {
    logForDebugging(`Failed to save config with lock: ${error41}`, {
      level: "error"
    });
    let config5 = getConfig(getGlobalClaudeFile(), createDefaultGlobalConfig);
    if (wouldLoseAuthState(config5)) {
      logForDebugging("saveCurrentProjectConfig fallback: re-read config is missing auth that cache has; refusing to write. See GH #3117.", { level: "error" }), logEvent("tengu_config_auth_loss_prevented", {});
      return;
    }
    let currentProjectConfig = config5.projects?.[absolutePath] ?? DEFAULT_PROJECT_CONFIG, newProjectConfig = updater(currentProjectConfig);
    if (newProjectConfig === currentProjectConfig)
      return;
    written = {
      ...config5,
      projects: {
        ...config5.projects,
        [absolutePath]: newProjectConfig
      }
    }, saveConfig(getGlobalClaudeFile(), written, DEFAULT_GLOBAL_CONFIG), writeThroughGlobalConfigCache(written);
  }
}
